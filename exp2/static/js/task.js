/*
 * Requires:
 *     psiturk.js
 *     utils.js
 *     underscore.js
 *     jquery.js
 */

/*jslint browser: true, nomen: true*/
/*global $, _, console, PsiTurk, uniqueId, adServerLoc, mode, condition, counterbalance, uniqueId, expVars, setTimeout*/
// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode),
    loop = 0,
    currentview,
    listening = true,
    expVars = {
        // All pages to be loaded
        pages: [
            "instructions/instruct-2.html",
            "instructions/instruct-3.html",
            "restart.html",
            "quiz.html",
            "block.html",
            "stage.html",
            "testinstr.html",
            "endingquestions.html",
            "postquestionnaire.html"
        ],
        condition: parseInt(condition),
        // pages included in instructions
        instructionPages: [
            "instructions/instruct-2.html",
            "instructions/instruct-3.html"
        ],
        basepayment: 50,
        moneyperpoint: 1,
        ndim: 4,
        numblocks: 10,
        numtestblocks: 2,
        skipinstr: false,
        individuationImages: [
            "static/images/boss_downscaled/africanelephant.png",
            "static/images/boss_downscaled/americangoldfinch.png",
            "static/images/boss_downscaled/americanwhitepelican.png",
            "static/images/boss_downscaled/antelope.png",
            "static/images/boss_downscaled/badger.png",
            "static/images/boss_downscaled/barnowl.png",
            "static/images/boss_downscaled/beaver.png",
            "static/images/boss_downscaled/bison.png",
            "static/images/boss_downscaled/blackbear.png",
            "static/images/boss_downscaled/bluejay.png",
            "static/images/boss_downscaled/chipmunk.png",
            "static/images/boss_downscaled/duck01.png",
            "static/images/boss_downscaled/eagle.png",
            "static/images/boss_downscaled/hen.png",
            "static/images/boss_downscaled/heron01.png",
            "static/images/boss_downscaled/lion.png",
        ],
        dimvaluenames: [
            ["Business", "Economics"],
            ["Hudson Inc.", "Nile Co."],
            ["Developer", "Analyst"],
            ["Design", "Programming"]
        ],
        feedbackstrings: [
            "-3",
            "+1",
            "+0",
            "-3",
            "+1",
            ""
        ],
        feedbackmessages: [
            "Darn! Loss of",
            "Great! Gain of",
            "Rejected",
            "Great! Avoided",
            "Darn! Missed",
            "?????"
        ]
    };

psiTurk.preloadPages(expVars.pages);
psiTurk.preloadImages(expVars.individuation_images);

function quiz(instructions, complete_fn) {
    "use strict";
    function record_responses() {
        var allRight = true;
        $("select").each(function () {
            psiTurk.recordTrialData({"phase": "INSTRUCTQUIZ", "question": this.id, "answer": this.value, "loop": loop});
            if (this.id === "change" && this.value !== "no") {
                allRight = false;
            } else if (this.id === "tellsuitable" && this.value !== "feature") {
                allRight = false;
            } else if (this.id === "avoidinfo" && expVars.condition !== 1 && this.value !== "noInfo") {
                allRight = false;
            } else if (this.id === "avoidinfo" && expVars.condition === 1 && this.value !== "info") {
                allRight = false;
            } else if (this.id === "keypress" && this.value !== "space") {
                allRight = false;
            } else if (this.id === "goal" && this.value !== "revenue") {
                allRight = false;
            } else if (this.id === "penpaper" && this.value !== "no") {
                allRight = false;
            }
        });
        return allRight;
    }
    psiTurk.showPage("quiz.html");
    $("#continue").click(function () {
        if (record_responses()) {
            // Record that the user has finished the instructions and
            // moved on to the experiment. This changes their status code
            // in the database.
            psiTurk.recordUnstructuredData("instructionloops", loop);
            psiTurk.finishInstructions();
            // Move on to the experiment
            complete_fn();
        } else {
            loop += 1;
            psiTurk.showPage("restart.html");
            $(".continue").click(function () {
                psiTurk.doInstructions(
                    instructions,
                    function () {quiz(instructions, complete_fn); }
                );
            });
        }
    });

}

function CategoryUIController(responseFn, startingscore) {
    "use strict";
    var i,
        dimsShown,
        individuateValue,
        dimvalues,
        dimOrder = [];

    for (i = 0; i < expVars.ndim; i++) {
        dimOrder.push(i);
    }

    $("#bonusnumber").html(startingscore);
    $("#feedback").css("opacity", 0);

    this.showNextDim = function () {
        if (dimsShown < expVars.ndim) {
            $("#dim" + dimOrder[dimsShown]).css("opacity", 1);
        }
        dimsShown += 1;
        if (dimsShown === expVars.ndim) {
            $("#info").html("");
            $("#response-buttons").css("opacity", 1);
            $("button").prop("disabled", null);
            $(".choice").click(function () { responseFn($(this).attr("id")); });
            if (individuateValue > -1) {
                $("#indivval").show();
                $("#indivimg").show();
            } else if (expVars.condition === 2) {
                $("#indivval").show();
            }
        }
    };

    this.stimIn = function(dimVal, indivVal, obscureNum, trialsleft) {
        dimvalues = dimVal;
        individuateValue = indivVal;
        listening = true;
        $("#info").html("<b>press SPACE to reveal application fields.</b>");
        $("#response-buttons").css("opacity", 0);
        $("button").prop("disabled", "disabled");
        $("#application").prop("class", "defaultstyle");
        $("#indivval").hide();
        if (individuateValue > -1) {
            $("#indivlabel").html("Application icon: ");
            $("#indivimg").prop("src", expVars.individuationImages[individuateValue]);
        } else if (expVars.condition === 2) {
            $("#indivimg").hide();
            $("#indivlabel").html("Application icon: N/A");
        }

        dimsShown = 0;
        dimOrder = _.shuffle(dimOrder);
        $("#application").css("opacity", 1);
        $("#trialsnumber").html(trialsleft.toString());
        $(".dim").css("opacity", 0);
        for (i = 0; i < expVars.ndim; i++) {
            if (obscureNum !== i) {
                $("#dimval" + i).html(expVars.dimvaluenames[i][dimvalues[i]]);
                $("#dimval" + i).removeClass("obscured");
            } else {
                $("#dimval" + i).addClass("obscured");
                $("#dimval" + i).html("XXXXXXXXX");
            }
        }
        $("#title").html("Applicant Info");
    };
    this.setOutcome = function(outcometype, score) {
        $(".choice").off();
        $("#feedbackmessage").html(expVars.feedbackmessages[outcometype]);
        $("#feedbackval").html(expVars.feedbackstrings[outcometype]);
        if (expVars.condition === 3 && outcometype < 2) {
            for (i = 0; i < expVars.ndim; i++) {
                $("#dimval" + i).html(expVars.dimvaluenames[i][dimvalues[i]]);
                $("#dimval" + i).removeClass("obscured");
            }
        }
        if (outcometype === 0){
            $("#feedback").css("color", "red");
        } else if (outcometype === 1) {
            $("#feedback").css("color", "green");
        } else {
            $("#feedback").css("color", "gray");
        }
        $("#bonusnumber").html(score);
        $("#feedback").css("opacity", 1);
    };

    this.stimOut = function () {
        $("#application").animate({opacity: 0}, 200);
        $("#feedback").animate({opacity: 0}, 200);
    };
}

function categoryBlockLogic(stimuli, startingscore, testphase, completeFn) {
    "use strict";
    psiTurk.showPage("stage.html");
    var stims = stimuli,
        stim,
        ui,
        timeOn,
        score = startingscore;

    function finish() {
	      $("body").unbind("keydown", keyboardFn); // Unbind keys
        completeFn(score);
    }

    function next() {
        var trialsleft;
        if (stims.length === 0) {
            finish();
        } else {
            stim = stims.shift();
            if (testphase) {
                trialsleft = (expVars.numblocks) *
                    Math.pow(2, expVars.ndim) - stim.trial - 1;
            } else {
                trialsleft = (expVars.numblocks - expVars.numtestblocks) *
                    Math.pow(2, expVars.ndim) - stim.trial - 1;
            }
            timeOn = new Date().getTime();
            ui.stimIn([stim.physdimval0,
                       stim.physdimval1,
                       stim.physdimval2,
                       stim.physdimval3,
                       stim.physdimval4],
                      stim.indiv_value,
                      stim.obscureNumPhys,
                      trialsleft
                     );
        }
    }

    function keyboardFn(e) {
        if (!listening) {
            return;
        } else if (e.keyCode === 32) {
            ui.showNextDim();
        }
    }

    function responseFn(button) {
        stim.rt = new Date().getTime() - timeOn;
        stim.phase = "experiment";
        if (button === "accept") {
            stim.response = 1;
            stim.reward = stim.ap_payoff;
        } else {
            stim.response = 0;
            stim.reward = stim.av_payoff;
        }
        stim.correct = stim.response === stim.category;
        score += stim.reward;
        stim.score_post = score;
        stim.uniqueid = uniqueId;
        if (testphase && stim.response) {
            ui.setOutcome(5, "$??");
        } else if (testphase) {
            ui.setOutcome(5, "$??");
        } else if (stim.response && stim.category_withnoise) {
            ui.setOutcome(1,
                          "$" + (expVars.moneyperpoint * score +
                                 expVars.basepayment).toString());
        } else if (stim.response) {
            ui.setOutcome(0,
                          "$" + (expVars.moneyperpoint * score +
                                 expVars.basepayment).toString());
        } else if (!stim.response && expVars.condition === 1) {
            if (stim.category_withnoise) {
                ui.setOutcome(4,
                              "$" + (expVars.moneyperpoint * score +
                                     expVars.basepayment).toString());
            } else {
                ui.setOutcome(3,
                              "$" + (expVars.moneyperpoint * score +
                                     expVars.basepayment).toString());
            }
        } else {
            ui.setOutcome(2,
                          "$" + (expVars.moneyperpoint * score +
                                 expVars.basepayment).toString());
        }
        psiTurk.recordTrialData(stim);
        if (testphase) {
            setTimeout(ui.stimOut, 750);
            setTimeout(next, 1500);
        } else {
            setTimeout(ui.stimOut, 1500);
            setTimeout(next, 2250);
        }
    }
    if (testphase) {
        ui = new CategoryUIController(responseFn, "$??");
    } else {
        ui = new CategoryUIController(responseFn, "$" + (expVars.moneyperpoint * score
                                                   + expVars.basepayment).toString());
    }
    $("body").focus().keydown(keyboardFn);
    next();
}


function questionnaire() {
    "use strict";
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    function record_responses() {
        psiTurk.recordTrialData({"phase": "postquestionnaire", "status": "submit"});

        $("textarea").each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $("select").each(function () {
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
                psiTurk.computeBonus("compute_bonus", function () {
                    // when finished saving compute bonus, the quit
                    psiTurk.completeHIT();
                });
            },
            error: prompt_resubmit
        });
    }
    // Load the questionnaire snippet
    psiTurk.showPage("postquestionnaire.html");
    psiTurk.recordTrialData({"phase": "postquestionnaire", "status": "begin"});
    $("#continue").click(function () {
        record_responses();
        psiTurk.saveData({
            success: function () {
                psiTurk.computeBonus("compute_bonus", function () {
                    // when finished saving compute bonus, the quit
                    psiTurk.completeHIT();
                });
            },
            error: prompt_resubmit
        });
    });

}

function endingquestions(score) {
    "use strict";
    var record_responses = function () {
        var checkedDims = 0;
        if (($("#dangerpercent").val() === "") ||
            ($("#completeLearn").val() === "noresp") ||
            ($("#penpaper").val() === "noresp")){
            $("#blankmessage").html("<strong>Please answer all questions before continuing.</strong>");
        } else {
            $("input[type='number']").each(function () {
                psiTurk.recordUnstructuredData(this.id, this.value);
            });
            $("select").each(function () {
                psiTurk.recordUnstructuredData(this.id, this.value);
            });
            $("input[type='checkbox']").each(function () {
                psiTurk.recordUnstructuredData($(this).val(), $(this).prop("checked"));
                if ($(this).prop("checked")) {
                    checkedDims += 1;
                }
                //checkedDims.push($(this).val());
                //psiTurk.recordUnstructuredData(this.name, this.value);
            });
            psiTurk.recordUnstructuredData("numdimchecked", checkedDims);
            questionnaire();
        }
    };
    psiTurk.showPage("endingquestions.html");
    psiTurk.recordUnstructuredData("finalscore",
                                   (expVars.basepayment +
                                    expVars.moneyperpoint *
                                    score));
    psiTurk.recordUnstructuredData("uniqueid", uniqueId);
    psiTurk.recordUnstructuredData("condition", expVars.condition);
    psiTurk.recordUnstructuredData("counterbalance", counterbalance);

    $("#performancereport").html("You have finished the last batch of applicants! Your company's final revenue was: <strong>" +
                                 (expVars.basepayment +
                                  expVars.moneyperpoint *
                                  score).toString() +
                                 " thousand dollars</strong>!  This means your final bonus is: <strong>$" +
                                 ((expVars.basepayment +
                                  expVars.moneyperpoint *
                                   score) / 100).toFixed(2) + "</strong>."
                                );
    $("#next").click(function () {
        record_responses();
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
            if (allStimuli.length === expVars.numtestblocks) {
                testphase = true;
                psiTurk.showPage("testinstr.html");
                block = allStimuli.shift();
                $("#continue").click(function () {
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
        data: {condition: expVars.condition,
               counterbalance: counterbalance,
               numblocks: expVars.numblocks,
               numtestblocks: expVars.numtestblocks,
               ndim: expVars.ndim
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
    if (expVars.skipinstr) {
        currentview = new ExperimentDriver();
    } else {
        psiTurk.doInstructions(
            expVars.instructionPages,
            function () {quiz(expVars.instructionPages,
                              function () { currentview =
                                            new ExperimentDriver(); }); }
        );
    }
});
