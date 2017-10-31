/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

/*jslint browser: true, nomen: true*/
/*global $, jQuery, d3, _, console, PsiTurk, uniqueId, adServerLoc, mode, condition, counterbalance, uniqueId, exp_vars */
// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode),
    loop = 0,
    currentview,
    exp_vars = {
        // All pages to be loaded
        pages: [
            "instructions/instruct-1.html",
            "instructions/instruct-2.html",
            "instructions/instruct-3expanded.html",
            "instructions/instruct-3standard.html",
            "instructions/instruct-4.html",
            "restart.html",
            "quiz.html",
            "block.html",
            "stage.html",
            "testinstr.html",
            "endingquestions.html",
            "postquestionnaire.html"
        ],
        // pages included in instructions
        instructionPagesStandard: [
            "instructions/instruct-1.html",
            "instructions/instruct-2.html",
            "instructions/instruct-3standard.html"
        ],
        instructionPagesExpanded: [
            "instructions/instruct-1.html",
            "instructions/instruct-2.html",
            "instructions/instruct-3expanded.html",
            "instructions/instruct-4.html"
        ],
        //stimuli files
        stimuli: [
            ["/static/images/bees-01.svg", "/static/images/bees-smokelegs-01.svg", "/static/images/bees-smokestripes-01.svg", "/static/images/bees-smokewings-01.svg", "/static/images/bees-smokeantennae-01.svg"],
            ["/static/images/bees-02.svg", "/static/images/bees-smokelegs-02.svg", "/static/images/bees-smokestripes-02.svg", "/static/images/bees-smokewings-02.svg", "/static/images/bees-smokeantennae-02.svg"],
            ["/static/images/bees-03.svg", "/static/images/bees-smokelegs-03.svg", "/static/images/bees-smokestripes-03.svg", "/static/images/bees-smokewings-03.svg", "/static/images/bees-smokeantennae-03.svg"],
            ["/static/images/bees-04.svg", "/static/images/bees-smokelegs-04.svg", "/static/images/bees-smokestripes-04.svg", "/static/images/bees-smokewings-04.svg", "/static/images/bees-smokeantennae-04.svg"],
            ["/static/images/bees-05.svg", "/static/images/bees-smokelegs-05.svg", "/static/images/bees-smokestripes-05.svg", "/static/images/bees-smokewings-05.svg", "/static/images/bees-smokeantennae-05.svg"],
            ["/static/images/bees-06.svg", "/static/images/bees-smokelegs-06.svg", "/static/images/bees-smokestripes-06.svg", "/static/images/bees-smokewings-06.svg", "/static/images/bees-smokeantennae-06.svg"],
            ["/static/images/bees-07.svg", "/static/images/bees-smokelegs-07.svg", "/static/images/bees-smokestripes-07.svg", "/static/images/bees-smokewings-07.svg", "/static/images/bees-smokeantennae-07.svg"],
            ["/static/images/bees-08.svg", "/static/images/bees-smokelegs-08.svg", "/static/images/bees-smokestripes-08.svg", "/static/images/bees-smokewings-08.svg", "/static/images/bees-smokeantennae-08.svg"],
            ["/static/images/bees-09.svg", "/static/images/bees-smokelegs-09.svg", "/static/images/bees-smokestripes-09.svg", "/static/images/bees-smokewings-09.svg", "/static/images/bees-smokeantennae-09.svg"],
            ["/static/images/bees-10.svg", "/static/images/bees-smokelegs-10.svg", "/static/images/bees-smokestripes-10.svg", "/static/images/bees-smokewings-10.svg", "/static/images/bees-smokeantennae-10.svg"],
            ["/static/images/bees-11.svg", "/static/images/bees-smokelegs-11.svg", "/static/images/bees-smokestripes-11.svg", "/static/images/bees-smokewings-11.svg", "/static/images/bees-smokeantennae-11.svg"],
            ["/static/images/bees-12.svg", "/static/images/bees-smokelegs-12.svg", "/static/images/bees-smokestripes-12.svg", "/static/images/bees-smokewings-12.svg", "/static/images/bees-smokeantennae-12.svg"],
            ["/static/images/bees-13.svg", "/static/images/bees-smokelegs-13.svg", "/static/images/bees-smokestripes-13.svg", "/static/images/bees-smokewings-13.svg", "/static/images/bees-smokeantennae-13.svg"],
            ["/static/images/bees-14.svg", "/static/images/bees-smokelegs-14.svg", "/static/images/bees-smokestripes-14.svg", "/static/images/bees-smokewings-14.svg", "/static/images/bees-smokeantennae-14.svg"],
            ["/static/images/bees-15.svg", "/static/images/bees-smokelegs-15.svg", "/static/images/bees-smokestripes-15.svg", "/static/images/bees-smokewings-15.svg", "/static/images/bees-smokeantennae-15.svg"],
            ["/static/images/bees-16.svg", "/static/images/bees-smokelegs-16.svg", "/static/images/bees-smokestripes-16.svg", "/static/images/bees-smokewings-16.svg", "/static/images/bees-smokeantennae-16.svg"]
        ],
        //colors made with rainbow_hcl function in R colorspace package
        colors: [
            //using http://tools.medialab.sciences-po.fr/iwanthue/ and "hard" mode
            // with luminance setting no lower than 0.2
            // "#DEB8F5",
            // "#9AAE09",
            // "#7E0B04",
            // "#5AFDCA",
            // "#EC1188",
            // "#3A6789",
            // "#DFCCB4",
            // "#244E01",
            // "#FA822F",
            // "#75206D",
            // "#4ABBFF",
            // "#FE77D8",
            // "#FFC243",
            // "#429458",
            // "#908009",
            // "#22DF9D",
            //last color for non-color modes
            //"#FFFF00"
            "rgb(255,0,255)", //magenta
            "rgb(77,77,77)", //dk gray
            "rgb(235,0,0)", //red
            "rgb(42,75,215)", //blue
            "rgb(29,105,20)", //green
            "rgb(129,74, 25)", //brown
            "rgb(129,38,192)", //purple
            "rgb(170,170,170)", //lt gray
            "rgb(0,230,0)", //lt green
            "rgb(157,175,255)", //lt blue
            "rgb(41,208,208)", //cyan
            "rgb(255,146,51)", //orange
            "rgb(233,222,187)", //tan
            "rgb(255,205,243)", //pink
            "rgb(255,255,255)",//white
            "rgb(138, 20, 20)", //maroon
            "rgb(255, 238, 51)" //yellow

        ],
        outcomeimages: [
            "/static/images/avoid.png",
            "/static/images/stinger.png",
            "/static/images/droplet.png",
            "/static/images/stingeravoid.png",
            "/static/images/dropletavoid.png"
        ],
        basepayment: 0.40,
        moneyperpoint: 0.02,
        numblocks: 6,
        numtestblocks: 2,
        skipinstr: false
    };


psiTurk.preloadPages(exp_vars.pages);
psiTurk.preloadImages(_.flatten(exp_vars.stimuli));
psiTurk.preloadImages(exp_vars.outcomeimages);

function quiz(instructions, complete_fn) {
    'use strict';
    function record_responses() {
        var allRight = true,
            checkeddims = 0;
        $('select').each(function () {
            //psiTurk.recordTrialData({'phase': "INSTRUCTQUIZ", 'question': this.id, 'answer': this.value});
            if (this.id === 'change' && this.value !== 'no') {
                allRight = false;
            } else if (this.id === 'telldangerous' && this.value !== 'feature') {
                allRight = false;
            } else if (this.id === 'avoidinfo' && condition !== 1 && this.value !== 'noInfo') {
                allRight = false;
            } else if (this.id === 'avoidinfo' && condition === 1 && this.value !== 'info') {
                allRight = false;
            }
        });
        $('input:checked').each(function () {
            if (['legs', 'body', 'wings', 'antennae'].indexOf($(this).val()) === -1) {
                allRight = false;
            }
            checkeddims += 1;
        });
        if (checkeddims !== 4) {
            allRight = false;
        }
        return allRight;
    }
    psiTurk.showPage('quiz.html');
    $('#continue').click(function () {
        if (record_responses()) {
            // Record that the user has finished the instructions and
            // moved on to the experiment. This changes their status code
            // in the database.
            psiTurk.recordUnstructuredData('instructionloops', loop);
            psiTurk.finishInstructions();
            // Move on to the experiment
            complete_fn();
        } else {
            loop += 1;
            psiTurk.showPage('restart.html');
            $('.continue').click(function () {
                psiTurk.doInstructions(
                    instructions,
                    function () {quiz(instructions, complete_fn); }
                );
            });
        }
    });

}

function CategoryUIcontroller(responseFn, startingscore, testphase) {
    "use strict";
    var stage = d3.select("#stage"),
        stim = stage.insert("g"),
        stimimage,
        score = stage.insert("g"),
        outcome = stage.insert("g"),
        infotext = d3.select("#info"),
        outcomemessage,
        trialcounter,
        OMline1,
        OMline2,
        that = this;

    //initializing stim
    stim.attr("transform", "translate(100, 0)");

    stimimage = stim.insert("g")
        .style("opacity", 0)
        .attr("id", "stimimage");

    // initialize outcome group
    outcome.attr("transform", "translate(420, 70)");

    outcome.append("image")
        .attr("id", "outcomeimage")
        .attr("width", 175)
        .attr("height", 175);

    outcome.append("text")
        .attr("id", "outcometext")
        .style("font", "bold 20px monospace");

    //initialize score
    score.attr("transform", "translate(50, 350)");
    // text above score
    score.append("text")
        .text("Bonus:")
        .style("fill", "black")
        .style("font", "bold 28px monospace");
    //score itself
    score.append("text")
        .attr("id", "scoretext")
        .text("$" + startingscore.toFixed(2))
        .attr("y", "70")
        .style("fill", "black")
        .style("font", "bold 80px monospace");

    outcomemessage = stage.append("g")
        .attr("transform", "translate(380, 390)");

    OMline1 = outcomemessage.append("text")
        .attr("class", "outcomemessages")
        .text("")
        .style("font", "bold 28px monospace");

    OMline2 = outcomemessage.append("text")
        .attr("class", "outcomemessages")
        .text("")
        .style("font", "bold 28px monospace")
        .attr("y", 28);

    if (!testphase) {
        trialcounter = stage.append("text")
            .attr("id", "trialtext")
            .text("Hives left: ")
            .style("font", "bold 28px monospace")
            .attr("x", 380)
            .attr("y", 20);
    }

    if (testphase) {
        d3.select("#scoretext")
            .text("$?");
    } else {
        d3.select("#scoretext")
            .text("$" + startingscore.toFixed(2));
    }

    this.stimIn = function (stimNum, colorNum, obscureNum, trial, longhorizon) {
        OMline1.text("");
        OMline2.text("");
        var totaltrials,
            thestim = exp_vars.stimuli[stimNum][obscureNum];
        stimimage.select("svg")
            .remove();
        stimimage.attr("transform", "scale(0.7, 0.7) translate(-40,0)");
        d3.xml(thestim,
            function (error, documentFragment) {
                var svgNode;
                if (error) {
                    return;
                }
                svgNode = documentFragment.getElementsByTagName("svg")[0];
                stimimage.node().appendChild(svgNode);
                d3.select("#body")
                    .style("fill", exp_vars.colors[colorNum]);
            });
        if (!testphase) {
            if (longhorizon) {
                totaltrials = 128;
            } else {
                totaltrials = 64;
            }
            trialcounter.text("Hives left: " + (totaltrials - (trial + 1)).toString());
        }
        stimimage.transition()
            .duration(1000)
            .style("opacity", 1);
        infotext.html("Choose <strong>\"harvest\"</strong> or <strong>\"avoid\"</strong>");
        d3.select("#outcomeimage")
            .attr("xlink:href", "");

        $(".choice").click(function () { responseFn($(this).attr('id')); });
        d3.selectAll(".choice")
            .style("opacity", 1);
    };

    this.stimOut = function () {
        d3.selectAll("#stimimage, #outcomeimage, #outcometext, .outcomemessages")
            .transition()
            .duration(1000)
            .style("opacity", 0);
        d3.select("#scoretext")
            .transition()
            .duration(1000)
            .style("fill", "black");

    };

    this.setScore = function (scoreNum) {
        d3.select("#scoretext")
            .text("$" + scoreNum.toFixed(2));
    };
    this.setOutcome = function (newscore, scorechange, approached, textcolor, imagevalue, messagelines) {
        $(".choice").off();
        d3.selectAll(".choice")
            .style("opacity", 0);
        if (!testphase) {
            that.setScore(newscore);
            d3.select("#outcometext")
                .text("$" + scorechange.toFixed(2))
                .style("text-decoration", "")
                .style("opacity", 1)
                .style("fill", textcolor)
                .style("font", "bold 60px monospace")
                .attr("y", 220)
                .attr("x");
            if (approached === 1) {
                d3.select("#scoretext")
                    .style("fill", textcolor);
            } else if (approached === 0 && condition === 1) {
                d3.select("#outcometext")
                    .style("text-decoration", "line-through");
            }
        }
        OMline1.text(messagelines[0])
            .style("opacity", 1);
        OMline2.text(messagelines[1])
            .style("opacity", 1);
        d3.select("#outcomeimage")
            .attr("xlink:href", exp_vars.outcomeimages[imagevalue])
            .style("opacity", 1);

        infotext.html("");
    };
}


function categoryBlockLogic(stimuli, startingscore, testphase, completeFn) {
    "use strict";
    psiTurk.showPage('stage.html');
    var stims = stimuli,
        stim,
        ui,
        score = startingscore;


    function finish() {
        completeFn(score);
    }

    function next() {
        if (stims.length === 0) {
            finish();
        } else {
            stim = stims.shift();
            ui.stimIn(stim.imagenum, stim.color, stim.obscureNumPhys, stim.trial, stim.longhorizon);
        }
    }

    function responseFn(button) {
        var message, color, outcomepic;
        stim.score_pre = score;
        if (button === 'approach') {
            stim.response = 1;
            stim.reward = stim.ap_payoff;
            stim.correct = stim.response === stim.category;
            if (testphase) {
                message = ["You attempted to", "harvest this hive"];
                color = "gray";
                outcomepic = 0;
            } else {
                if (stim.correct) {
                    message = ["You successfully", "harvested honey!"];
                    color = "green";
                    outcomepic = 2;
                } else {
                    message = ["Ouch! you", "were stung!"];
                    color = "red";
                    outcomepic = 1;
                }
            }
        } else {
            stim.response = 0;
            stim.reward = stim.av_payoff;
            stim.correct = stim.response === stim.category;
            if (stim.correct) {
                if (stim.fullinfo && !testphase) {
                    message = ["Whew! You avoided", "being stung."];
                    outcomepic = 3;
                    color = "gray";
                } else {
                    message = ["You avoided", "this hive."];
                    outcomepic = 0;
                    color = "gray";
                }

            } else {
                if (stim.fullinfo && !testphase) {
                    message = ["Oops. you avoided", "a friendly hive."];
                    outcomepic = 4;
                    color = "gray";
                } else {
                    message = ["You avoided", "this hive."];
                    outcomepic = 0;
                    color = "gray";
                }

            }
        }
        score += stim.reward;
        stim.score_post = score;
        if (condition === 1) {
            ui.setOutcome(exp_vars.basepayment + exp_vars.moneyperpoint * score, exp_vars.moneyperpoint * stim.ap_payoff, stim.response, color, outcomepic, message);
        } else {
            ui.setOutcome(exp_vars.basepayment + exp_vars.moneyperpoint * score, exp_vars.moneyperpoint * stim.reward, stim.response, color, outcomepic, message);
        }
        stim.uniqueid = uniqueId;
        psiTurk.recordTrialData(stim);
        if (testphase) {
            setTimeout(ui.stimOut, 1000);
            setTimeout(next, 2000);
        } else {
            setTimeout(ui.stimOut, 2500);
            setTimeout(next, 3500);
        }

    }

    ui = new CategoryUIcontroller(responseFn, exp_vars.basepayment + exp_vars.moneyperpoint * score, testphase);
    next();
}


function questionnaire() {
    'use strict';
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    function record_responses() {
        psiTurk.recordTrialData({'phase': 'postquestionnaire', 'status': 'submit'});

        $('textarea').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
    }

    function prompt_resubmit() {

        document.body.innerHTML = error_message;
        $("#resubmit").click(resubmit);
    }

    function resubmit() {
        var reprompt;
        document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
        reprompt = setTimeout(prompt_resubmit, 10000);

        psiTurk.saveData({
            success: function () {
                clearInterval(reprompt);
                psiTurk.computeBonus('compute_bonus', function () {
                    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit
        });
    }
    // Load the questionnaire snippet
    psiTurk.showPage('postquestionnaire.html');
    psiTurk.recordTrialData({'phase': 'postquestionnaire', 'status': 'begin'});
    $("#continue").click(function () {
        record_responses();
        psiTurk.saveData({
            success: function () {
                psiTurk.computeBonus('compute_bonus', function () {
                    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit
        });
    });

}

function endingquestions(score) {
    'use strict';
    var record_responses = function () {
        var checkedDims = 0;
        $('input[type="number"]').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('input[type="checkbox"]').each(function () {
            psiTurk.recordUnstructuredData($(this).val(), $(this).prop("checked"));
            if ($(this).prop("checked")) {
                checkedDims += 1;
            }
            //checkedDims.push($(this).val());
            //psiTurk.recordUnstructuredData(this.name, this.value);
        });
        psiTurk.recordUnstructuredData("numdimchecked", checkedDims);
    };
    psiTurk.showPage('endingquestions.html');
    psiTurk.recordUnstructuredData('finalscore', (exp_vars.basepayment + exp_vars.moneyperpoint * score).toFixed(2));
    psiTurk.recordUnstructuredData('uniqueid', uniqueId);
    psiTurk.recordUnstructuredData('condition', condition);
    psiTurk.recordUnstructuredData('counterbalance', counterbalance);

    $('#performancereport').html('You have completed the beekeeper game! You earned a bonus of : <strong>' +
                                 (exp_vars.basepayment + exp_vars.moneyperpoint * score).toFixed(2) +
                                 '</strong>!');
    $('#next').click(function () {
        record_responses();
        questionnaire();
    });
}




function ExperimentDriver() {
    "use strict";
    var self = this,
        allStimuli,
        testphase = false;

    this.runBlock = function (startingscore) {
        if (allStimuli.length === 0) {
            endingquestions(startingscore);
        } else {
            var completeFn = function (endscore) {self.runBlock(endscore); },
                block;
            //if this is the first test block, show the testinstr page
            //and *then* go on to the block page when the participant
            //presses "continue"
            if (allStimuli.length === exp_vars.numtestblocks) {
                testphase = true;
                psiTurk.showPage("testinstr.html");
                block = allStimuli.shift();
                $('#continue').click(function () {
                    categoryBlockLogic(block, startingscore, testphase, completeFn);
                });
            } else {
                block = allStimuli.shift();
                categoryBlockLogic(block, startingscore, testphase, completeFn);
            }
        }
    };

    $.ajax({
        dataType: "json",
        url: "/get_stims",
        data: {condition: condition,
               counterbalance: counterbalance,
               numblocks: exp_vars.numblocks,
               numtestblocks: exp_vars.numtestblocks
               },
        success: function (data) {
            allStimuli = data.results;
            self.runBlock(0);
        }
    });
}


/*******************
 * Run Task
 ******************/
$(window).load(function () {
    "use strict";
    if (exp_vars.skipinstr) {
        currentview = new ExperimentDriver();
    } else {
        var instructionPages;
        if ([0, 1, 4].indexOf(condition) > -1) {
            instructionPages = exp_vars.instructionPagesStandard;
        } else {
            instructionPages = exp_vars.instructionPagesExpanded;
        }

        psiTurk.doInstructions(
            instructionPages, // a list of pages you want to display in sequence
            function () {quiz(instructionPages, function () { currentview = new ExperimentDriver(); }); }
        );
    }
});
