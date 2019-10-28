# original code to retrieve raw psiturk experiment data from DB

from sqlalchemy import *
from json import loads
import pandas as pd

dburl = "INSERT DB URL STRING HERE"
columnname = 'datastring'
tablename = 'debiasing_apav_v1'
versionname = ''
# boilerplate

def get_experiment_data(codeversion):
    engine = create_engine(dburl)
    metadata = MetaData()
    metadata.bind = engine
    table = Table(tablename, metadata, autoload=True)
    # making a query and looping through
    s=table.select()
    rs = s.execute()
    exclude = []
    data = []
    workers = []
    for row in rs:
        if (row['status']>2) and (row['status']!=6) and (row['codeversion'] == codeversion) and  (row['uniqueid'] not in exclude):
            workers.append(row['uniqueid'])
            data.append(row[columnname])

    questiondata = [loads(d)['questiondata'] for d in data]
    questionFrame = pd.DataFrame(questiondata)
    questionFrame.to_csv('../data/questiondata_v' + codeversion + '.csv')

    data = [loads(d)['data'] for d in data]
    data = [record['trialdata'] for d in data for record in d] # flatten nested list
    data = [record for record in data if record['phase']=='experiment']
    data_frame = pd.DataFrame(data)

    data_frame.to_csv('../data/exp_data_v' + codeversion + '.csv')

    # eventdata = [loads(d)['eventdata'] for d in data]
    # eventFrame = pd.DataFrame(eventdata)
    # eventFrame.to_csv('../data/eventdata_v' + codeversion + '.csv')

get_experiment_data('1.6')
get_experiment_data('2.8')
get_experiment_data('3.1')
get_experiment_data('4.0')
