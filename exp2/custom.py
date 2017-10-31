# this file imports custom routes into the experiment server

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

from stimuli_generator import stimuli_generator

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')



###########################################################
#  serving warm, fresh, & sweet custom, user-provided routes
#  add them here
###########################################################

#----------------------------------------------
# example custom route
#----------------------------------------------
@custom_code.route('/my_custom_view')
def my_custom_view():
    current_app.logger.info("Reached /my_custom_view")  # Print message to server.log for debugging
    try:
        return render_template('custom.html')
    except TemplateNotFound:
        abort(404)

#----------------------------------------------
# example using HTTP authentication
#----------------------------------------------
@custom_code.route('/my_password_protected_route')
@myauth.requires_auth
def my_password_protected_route():
    try:
        return render_template('custom.html')
    except TemplateNotFound:
        abort(404)

#----------------------------------------------
# example accessing data
#----------------------------------------------
@custom_code.route('/view_data')
@myauth.requires_auth
def list_my_data():
    users = Participant.query.all()
    try:
        return render_template('list.html', participants=users)
    except TemplateNotFound:
        abort(404)


#----------------------------------------------
# get stimuli for experiment
#----------------------------------------------
@custom_code.route('/get_stims', methods=['GET'])
def get_stims():
    current_app.logger.info("accessing route /get_stims")
    #get all the parameters for the stim generator from the request
    condition = int(request.args['condition'])
    settings = {}
    if condition == 1:
        settings['fullinfo'] = True
    if condition == 2:
        settings['individuate'] = True
        settings['intervention_l1'] = .9
    elif condition == 3:
        settings['obscure'] = True
        settings['intervention_l1'] = .5
        settings['intervention_b1'] = 4
        settings['intervention_b2'] = 5
    elif condition == 4:
        settings['noisy'] = True
        settings['intervention_l1'] = .1
        settings['intervention_b1'] = 4
        settings['intervention_b2'] = 5
    trials = stimuli_generator(condition,
                               int(request.args['counterbalance']),
                               int(request.args['numblocks']),
                               int(request.args['numtestblocks']),
                               int(request.args['ndim']),
                               **settings)
    return jsonify(results=trials)


#----------------------------------------------
# example computing bonus
#----------------------------------------------

@custom_code.route('/compute_bonus', methods=['GET'])
def compute_bonus():
    # check that user provided the correct keys
    # errors will not be that gracefull here if being
    # accessed by the Javascrip client
    if not request.args.has_key('uniqueId'):
        raise ExperimentError('improper_inputs')  # i don't like returning HTML to JSON requests...  maybe should change this
    uniqueId = request.args['uniqueId']

    try:
        # lookup user in database
        user = Participant.query.\
               filter(Participant.uniqueid == uniqueId).\
               one()
        user_data = loads(user.datastring) # load datastring from JSON
        user.bonus = float(user_data['questiondata']['finalscore']) * .01
        db_session.add(user)
        db_session.commit()
        resp = {"bonusComputed": "success"}
        return jsonify(**resp)
    except:
        abort(404)  # again, bad to display HTML, but...
