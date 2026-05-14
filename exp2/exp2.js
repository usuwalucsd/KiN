
function startExperiment() {
    var jsPsych = initJsPsych({
        on_finish: function() {
            // var filename = trial.response['Q0'] + ".csv"
            jsPsych.data.get().localSave('csv',"whatever.csv");
            jsPsych.data.displayData();
        }
    });

    var timeline = [];
    full_design = jsPsych.randomization.repeat(full_design, 1);

    var init_mic = {
        type: jsPsychInitializeMicrophone
    }

    // var preload = {

    // }
    
    var participant_id = {
        type: jsPsychSurveyText,
        questions: function() {
        return [{ prompt: `Participant ID<br>Condition number: ${condition_number}` }];
        },
        on_finish: function(trial) {
        //   participant_code = trial.response["Q0"];
        jsPsych.data.addProperties({participant_ID: trial.response['Q0']});
        }
    };

    // intro to agents
    var introduction = {
        type: jsPsychInstructions, 
        pages: function(){
            return ["<img/src='stim/more-stim/agents.png' style='max-width:100%'>"]
        }, 
        show_clickable_nav: true, 
        allow_keys: false,
        button_label_next: "Start!",
        allow_backward: false,
    } 



    var procedure = {
        timeline: [
            // for experimenters: this slide helps the experimenters figure out which script to run
            {
                type: jsPsychInstructions,
                show_clickable_nav: true, 
                allow_keys: true, 
                pages: function() {
                    console.log(jsPsych.timelineVariable('code'))
                    var code = jsPsych.timelineVariable('code')
                    return [code]; 
                }
            },

            // introduce agents and rules 
            {
                type: jsPsychInstructions,
                show_clickable_nav: true, 
                allow_keys: true, 
                pages: function() {
                    var scenario = jsPsych.timelineVariable('scenario');

                    var pages = [
                    `<img/src='stim/${scenario}/${scenario}_intro_agent1.png' style='max-width:100%'>`, 
                    `<img/src='stim/${scenario}/${scenario}_intro_agent2.png' style='max-width:100%'>`, 
                    `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
                    `<img/src='stim/${scenario}/${scenario}_rule_B.png' style='max-width:100%'>`, 
                    ];

                    if (scenario == 'food' || scenario == 'activity'){
                        pages.push(
                            `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
                            `<img/src='stim/${scenario}/${scenario}_rule_C.png' style='max-width:100%'>`, 
                        )
                    }

                    if (scenario == 'bedtime'){
                        pages.push(
                            `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
                            `<img/src='stim/${scenario}/${scenario}_rule_C.png' style='max-width:100%'>`, 
                            `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
                            `<img/src='stim/${scenario}/${scenario}_rule_D.png' style='max-width:100%'>`, 
                        )
                    } 

                    return pages; 
                }
            },

            // attention check 1: ask about rule 
            {
                type: jsPsychSurveyText,
                questions: function(){
                    var scenario = jsPsych.timelineVariable('scenario');
                    if (scenario == 'food'){
                    return [{prompt: "How many candies are Sally and Piper allowed to eat in a day?", rows: 1, required: true}];
                    } 
                    else if (scenario == 'bedtime'){

                    return [{prompt: "How many bedtime stories are Parker and Bobby allowed to get before going to bed?", rows: 1, required: true}];  
                    } 
                    else if (scenario == 'toy'){
                    return [{prompt: "How many toys are Jordan and Casey allowed to get at the toy store?", rows: 1, required: true}]; 
                    } 
                    else if (scenario == 'activity'){
                    return [{prompt: "How many rounds of game are Sam and Riley allowed to play in a day?", rows: 1, required: true}]
                    }
                },
            },

            // instruction: what does the agent want 
            {
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
            },

            // attention check 2 (agent1): intuitions about ask size
            {
                type: KiN_response, 
                trial: 'attention_check_asksize',
                ask_size: function(){
                    var askOrder = jsPsych.timelineVariable('askOrder'); 

                    if (askOrder == 'smallbig'){
                        return 'small'
                    } else {return "big"}

                    if (askOrder == 'bigsmall'){
                        return 'big'
                    } else {return "small"}
                },
                // ask_size: jsPsych.timelineVariable('askOrder') === 'smallbig' ? 'big' : 'small', // agent1 ask , 
                interaction_history: jsPsych.timelineVariable('condition'),
                scenario: jsPsych.timelineVariable('scenario'),
                agent: "1", 
                on_finish: function(trial){
                    console.log(trial.ask_size)
                    trial.agent1_asksize = trial.ask_size; 
                    trial.agent1_asksize_response = trial.response; 
                }
            }, 

            // attention check 2 (agent1): intuitions about ask size
            {
                type: KiN_response, 
                trial: 'attention_check_asksize',
                // ask_size: jsPsych.timelineVariable('askOrder') === 'smallbig' ? 'small' : 'big', // agent2 ask , 
                ask_size: function(){
                    var askOrder = jsPsych.timelineVariable('askOrder'); 
                    if (askOrder == 'bigsmall'){
                        return 'small'
                    } else {return "big"}

                    if (askOrder == 'smallbig'){
                        return 'big'
                    } else {return "small"}
                },
                interaction_history: jsPsych.timelineVariable('condition'),
                scenario: jsPsych.timelineVariable('scenario'),
                agent: "2", 
                on_finish: function(trial){
                    trial.agent2_asksize = trial.ask_size; 
                    trial.agent2_asksize_response = trial.response; 
                }
            }, 
        

            // interaction: agent 1
            {
                type: jsPsychInstructions,
                show_clickable_nav: true, 
                allow_keys: true, 
                pages: function() {
                    var ask_agent1 = jsPsych.timelineVariable('askOrder') === 'smallbig' ? 'small' : 'big'; // agent1 ask 
                    var scenario = jsPsych.timelineVariable('scenario');
                    var condition = jsPsych.timelineVariable('condition'); 

                    var pages = [`<img/src='stim/${scenario}/${scenario}_nointeraction_agent1.png' style='max-width:100%'>`];
                    
                    if (condition == 'failed_interaction'){
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_agent1.png' style='max-width:100%'>`);
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_${ask_agent1}ask_agent1.png' style='max-width:100%'>`);
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_deny_agent1.png' style='max-width:100%'>`);
                    } 

                    pages.push(`<img/src='stim/${scenario}/${scenario}_question_agent1.png' style='max-width:100%'>`); 
                    return pages;
                }
            },

            // audio recorder!! 
            {
                type: jsPsychHtmlAudioResponse,

                stimulus: function(){
                    var scenario = jsPsych.timelineVariable('scenario'); 
                    return `<img src='stim/more-stim/${scenario}_agent1.png'>`
                },
                recording_duration: null, 
                save_audio_url: true,
            },

            // interaction: agent 2
            {
                type: jsPsychInstructions,
                show_clickable_nav: true, 
                allow_keys: true, 
                pages: function() {
                    var ask_agent2 = jsPsych.timelineVariable('askOrder') === 'smallbig' ? 'big' : 'small'; // agent2 ask 
                    var scenario = jsPsych.timelineVariable('scenario');
                    var condition = jsPsych.timelineVariable('condition'); 

                    var pages = [`<img/src='stim/${scenario}/${scenario}_nointeraction_agent2.png' style='max-width:100%'>`];
                    
                    if (condition == 'failed_interaction'){
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_agent2.png' style='max-width:100%'>`);
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_${ask_agent2}ask_agent2.png' style='max-width:100%'>`);
                        pages.push(`<img/src='stim/${scenario}/${scenario}_parent_deny_agent2.png' style='max-width:100%'>`);
                    } 

                    pages.push(`<img/src='stim/${scenario}/${scenario}_question_agent2.png' style='max-width:100%'>`); 
                    return pages;
                }
            },

            
            // audio recorder!! 
            {
                type: jsPsychHtmlAudioResponse,
                stimulus: function(){
                    var scenario = jsPsych.timelineVariable('scenario'); 
                    return `<img src='stim/more-stim/${scenario}_agent2.png'>`
                },
                recording_duration: null, 
                save_audio_url: true,
            },
        ], 

        // timeline_variables: jsPsych.randomization.repeat(full_design, 1)
        timeline_variables: full_design, 

        on_finish: function(trial){
            trial.scenario = jsPsych.timelineVariable('scenario');
            trial.condition = jsPsych.timelineVariable('condition');
            trial.code = jsPsych.timelineVariable('code');
            trial.askOrder = jsPsych.timelineVariable('askOrder')
        }
    }

    var unsuccessful_outcome = {
        timeline: [
            // show failed outcome and prompt again
            {
                type: jsPsychInstructions, 
                show_clickable_nav: true, 
                allow_keys: true, 
                pages: function() {
                    console.log( jsPsych.timelineVariable('askOrder')); 
                    var askOrder = jsPsych.timelineVariable('askOrder');
                    var scenario = jsPsych.timelineVariable('scenario');
                    
                    var pages = [
                        `<img/src='stim/${scenario}/${scenario}_parent_deny_agent1.png' style='max-width:100%'>`,
                        `<img/src='stim/${scenario}/${scenario}_${askOrder}_B.png' style='max-width:100%'>`

                    ]; 
                    return pages;
                }

            }, 

            // audio recorder!! 
            {
                type: jsPsychHtmlAudioResponse,

                stimulus: function(){
                    var scenario = jsPsych.timelineVariable('scenario'); 
                    return `<img src='stim/more-stim/${scenario}_agent1.png'>`
                },
                recording_duration: null, 
                save_audio_url: true,
            },
        ], 
        timeline_variables: [full_design.at(-1)]
    }

    timeline.push(init_mic); 
    timeline.push(participant_id);
    timeline.push(introduction); 
    timeline.push(procedure);
    timeline.push(unsuccessful_outcome); 


    jsPsych.run(timeline);
}