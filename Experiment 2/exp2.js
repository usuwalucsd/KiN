function startExperiment() {
    // var jsPsych = initJsPsych({
    //     on_finish: function() {
    //         // console.log(jsPsych.data.get().values().map(t => t.trial_type));
    //         var participant_ID = jsPsych.data.get().values()[0].participant_ID;
    //         var filename = participant_ID + ".json";
    //         saveData(jsPsych.data.get().json()); // ← add this

    //         jsPsych.data.get().localSave('json', filename);

    //         // jsPsych.data.displayData();
    //     }
    // });

    var jsPsych = initJsPsych({
        on_finish: function() {
            var participant_ID = jsPsych.data.get().values()[0].participant_ID;
            var filename = participant_ID + ".json";
            jsPsych.data.get().localSave('json', filename);
            saveData(filename, jsPsych.data.get().json()); // one argument, no name
        }
    });

    var timeline = [];
    full_design = jsPsych.randomization.repeat(full_design, 1);

    var init_mic = {
        type: jsPsychInitializeMicrophone
    };

    var preload = {
        type: jsPsychPreload,
        auto_preload: true, 
        // exclude_trial_type: [jsPsychHtmlAudioResponse]  // skip audio trials

    };

    var participant_id = {
        type: jsPsychSurveyText,
        questions: function() {
            return [{ prompt: `Participant ID<br>Condition number: ${condition_number}` }];
        },
        on_finish: function(trial) {
            jsPsych.data.addProperties({ participant_ID: trial.response['Q0'] });
        }
    };

    //  task introduction 
    var introduction = {
        type: jsPsychInstructions,
        pages: function() {
            return ["<img/src='stim/more-stim/agents.png' style='max-width:100%'>"];
        },
        show_clickable_nav: true,
        allow_keys: false,
        button_label_next: "Start!",
        allow_backward: false,
    };

    /* 
       procedure: 
            - start_intro --> for experimenters: current running condition + introduce the agents (and the pre-existing contraints)
            - attention_check --> about pre-existing constraint 
            - ask_size_contrast: shows what agent 1 and 2 want 
            - agent 1 ask size (a lot vs a little)
            - agent 2 ask size (a lot vs a little)
            - agent 1: interaction (failed/none)
            - audio response for agent 1 
            - agent 2: interaction (failed/none)
            - audio response for agent 2

            conditional timeline (only for the last trial)
            - unsuccessful outcome, reminder of agent1 ask size 
            - audio response for agent 1
            - unsuccessful outcome, reminder of agent2 ask size 
            - audio response for agent 2
    
    */
    
    // for experimenters: current running condition + introduce the agents (and the pre-existing contraints)
    var start_intro = {
        type: jsPsychInstructions,
        show_clickable_nav: true,
        allow_keys: true,
        pages: function() {
            var code = jsPsych.timelineVariable('code');
            var scenario = jsPsych.timelineVariable('scenario');
            var pages = [
                code,
                `<img/src='stim/${scenario}/${scenario}_intro_agent1.png' style='max-width:100%'>`,
                `<img/src='stim/${scenario}/${scenario}_intro_agent2.png' style='max-width:100%'>`,
                `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`,
                `<img/src='stim/${scenario}/${scenario}_rule_B.png' style='max-width:100%'>`,
            ];

            if (scenario == 'food' || scenario == 'activity') {
                pages.push(
                    `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`,
                    `<img/src='stim/${scenario}/${scenario}_rule_C.png' style='max-width:100%'>`,
                );
            }

            if (scenario == 'bedtime') {
                pages.push(
                    `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`,
                    `<img/src='stim/${scenario}/${scenario}_rule_C.png' style='max-width:100%'>`,
                    `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`,
                    `<img/src='stim/${scenario}/${scenario}_rule_D.png' style='max-width:100%'>`,
                );
            }
            return pages;
        }
    };

    // question: about pre-existing constraint
    var attention_check = {
        type: jsPsychSurveyText,
        questions: function() {
            var scenario = jsPsych.timelineVariable('scenario');
            if (scenario == 'food') {
                return [{ prompt: "How many candies are Sally and Piper allowed to eat in a day?", rows: 1, required: true }];
            } else if (scenario == 'bedtime') {
                return [{ prompt: "How many bedtime stories are Parker and Bobby allowed to get before going to bed?", rows: 1, required: true }];
            } else if (scenario == 'toy') {
                return [{ prompt: "How many toys are Jordan and Casey allowed to get at the toy store?", rows: 1, required: true }];
            } else if (scenario == 'activity') {
                return [{ prompt: "How many rounds of game are Sam and Riley allowed to play in a day?", rows: 1, required: true }];
            }
        },
    };

    // instructions: shows what agent 1 and 2 want 
    var ask_size_contrast = {
        type: jsPsychInstructions,
        show_clickable_nav: true,
        allow_keys: true,
        pages: function() {
            var askOrder = jsPsych.timelineVariable('askOrder');
            var scenario = jsPsych.timelineVariable('scenario');
            var pages = [
                `<img/src='stim/${scenario}/${scenario}_${askOrder}_A.png' style='max-width:100%'>`,
                `<img/src='stim/${scenario}/${scenario}_${askOrder}_B.png' style='max-width:100%'>`
            ];
            return pages;
        }
    };

    // ask size question (a lot vs a little)
    var ask_size_question = function(agent_num) {
        return {
            type: KiN_response,
            trial: 'attention_check_asksize',
            ask_size: function() {
                var askOrder = jsPsych.timelineVariable('askOrder');
                if (agent_num === "1") {
                    return askOrder === 'smallbig' ? 'small' : 'big';
                } else {
                    return askOrder === 'bigsmall' ? 'small' : 'big';
                }
            },
            interaction_history: jsPsych.timelineVariable('condition'),
            scenario: jsPsych.timelineVariable('scenario'),
            agent: agent_num,
            on_finish: function(trial) {
                if (agent_num === "1");
                trial[`agent${agent_num}_asksize`] = trial.ask_size;
                trial[`agent${agent_num}_asksize_response`] = trial.response;
            }
        };
    };

    // instruction for interaction history
    var interaction = function(agent_num) {
        return {
            type: jsPsychInstructions,
            show_clickable_nav: true,
            allow_keys: true,
            pages: function() {
                var askOrder = jsPsych.timelineVariable('askOrder');
                var scenario = jsPsych.timelineVariable('scenario');
                var condition = jsPsych.timelineVariable('condition');
                var ask_agent = agent_num === "1"
                    ? (askOrder === 'smallbig' ? 'small' : 'big')
                    : (askOrder === 'smallbig' ? 'big' : 'small');

                var pages = [`<img/src='stim/${scenario}/${scenario}_nointeraction_agent${agent_num}.png' style='max-width:100%'>`];

                if (condition == 'failed_interaction') {
                    pages.push(`<img/src='stim/${scenario}/${scenario}_parent_agent${agent_num}.png' style='max-width:100%'>`);
                    pages.push(`<img/src='stim/${scenario}/${scenario}_parent_${ask_agent}ask_agent${agent_num}.png' style='max-width:100%'>`);
                    pages.push(`<img/src='stim/${scenario}/${scenario}_parent_deny_agent${agent_num}.png' style='max-width:100%'>`);
                }

                pages.push(`<img/src='stim/${scenario}/${scenario}_question_agent${agent_num}.png' style='max-width:100%'>`);
                return pages;
            }
        };
    };

    var recording = function(agent_num){
        return {
            type: jsPsychHtmlAudioResponse,
            stimulus: function() {
                var scenario = jsPsych.timelineVariable('scenario');
                return `<img src='stim/more-stim/${scenario}_agent${agent_num}.png'>`;
            },
            recording_duration: null,
            show_done_button: true,
            // save_audio_url: true,
        }
    }
    
    var thankyou = {
        type: jsPsychInstructions,
        show_clickable_nav: true,
        allow_keys: true,
        pages: function() {
            var scenario = jsPsych.timelineVariable('scenario');
            return [`<img src='stim/more-stim/${scenario}_thankyou.png' style='max-width:100%'>`];
        }
    }

    var unsuccessful_outcome = function(agent_num) {
        return {
            type: jsPsychInstructions,
            show_clickable_nav: true,
            allow_keys: true,
            pages: function() {
                var askOrder = jsPsych.timelineVariable('askOrder');
                var scenario = jsPsych.timelineVariable('scenario');
                var ask = agent_num === "1"
                    ? "A" : "C"; 
                return [
                    `<img/src='stim/${scenario}/${scenario}_parent_outcome_agent${agent_num}.png' style='max-width:100%'>`,
                    `<img/src='stim/${scenario}/${scenario}_${askOrder}_${ask}.png' style='max-width:100%'>`
                ];
            }
        };
    };

    var procedure = {
        timeline: [
            start_intro,
            attention_check,
            ask_size_contrast,
            ask_size_question("1"),
            ask_size_question("2"),
            interaction("1"), 
            recording("1"), 
            {
                timeline: [unsuccessful_outcome("1"), recording("1")],
                conditional_function: function() {
                    return jsPsych.timelineVariable('scenario') === full_design.at(-1).scenario;
                }
            },
            interaction("2"),
            recording("2"),
            {
                timeline: [unsuccessful_outcome("2"), recording("2")],
                conditional_function: function() {
                    return jsPsych.timelineVariable('scenario') === full_design.at(-1).scenario;
                }
            },
            thankyou, 
        ],

        timeline_variables: full_design,

        on_finish: function(trial) {
            trial.scenario = jsPsych.timelineVariable('scenario');
            trial.condition = jsPsych.timelineVariable('condition');
            trial.code = jsPsych.timelineVariable('code');
            trial.askOrder = jsPsych.timelineVariable('askOrder');
        }
    };


    const subject_id = jsPsych.randomization.randomID(10);
    const filename = `${subject_id}.csv`;

    const save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "FFfqn93YYZdr",
        filename: filename,
        // to-do: find some way to use .filter to make sure that audio is not saved to osf
        data_string: () => jsPsych.data.get().csv()
    };

    // function saveData(name, data){
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send(JSON.stringify({filedata: data}));
    //     }

    //     // call the saveData function after the experiment is over
    //     initJsPsych({
    //     on_finish: function(){ saveData(jsPsych.data.get().json()); }
    // });
    function saveData(filename, data){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'write_data.php');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('✅ Data saved successfully!');
                console.log('Server response:', xhr.responseText);
            } else {
                console.error('❌ Server error:', xhr.status, xhr.responseText);
            }
        };
        xhr.send(JSON.stringify({ filename: filename, filedata: data })); // ← include filename in payload

        // xhr.send(JSON.stringify({filedata: data}));
    }

 
    
    timeline.push(preload);
    timeline.push(init_mic);
    timeline.push(participant_id);
    timeline.push(introduction);
    timeline.push(procedure);
    // timeline.push(save_data);

    jsPsych.run(timeline);
}
