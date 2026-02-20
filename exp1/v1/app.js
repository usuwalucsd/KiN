 
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

var timeline = []; 


var participant_id = {
  type: jsPsychSurveyText,
  questions: [
      {prompt: 'Participant ID', rows: 1, required: true}
  ], 
  on_finish: function(trial){
      participant_code = (trial.response["Q0"])
  }, 
};



/* cover story and warm up trial 
   - introduce the task
   - practice round with action consequence: show scenario, make choice (congruent request vs incongruent reqeust)
   - practice round repeats if participant chooses incongruent (wrong) choice for the first roun
   - introduce agents before starting the full study
*/

var warmup = {
  timeline: [
    // scenario
    {
      type: jsPsychInstructions, 
      pages: [
        '<img src="stim/warmup/warmup_intro.png" style="max-width:100%"', 
        '<img src="stim/warmup/warmup_crayons.png" style="max-width:100%"', 
        '<img src="stim/warmup/warmup_question.png" style="max-width:100%"',         
      ], 
      show_clickable_nav: true, 
      allow_keys: false,  
    }, 
    // button response
    {
      type: KiN_response, 
      trial: "main_DV",
      scenario: "warmup",
      prompts: [
        "Can I get crayons?", 
        "Can I get a teddy bear?"
      ],
      on_finish: function(data){
        data.correct = data.response === "Can I get crayons?"
      }
    },
    // consequence 
    {
      type: jsPsychInstructions,
      pages: function(){
        var data = jsPsych.data.get().last(1).values()[0];
        if (data.correct){
          return [
            "<img/src='stim/warmup/warmup_correct.png' style='max-width:100%'>", 
            "<img/src='stim/warmup/warmup_correct_consequence.png' style='max-width:100%'>"
          ]
        } else {
          return ["<img/src='stim/warmup/warmup_incorrect.png' style='max-width:100%'>"]
        }
      },
      show_clickable_nav: true, 
      allow_keys: false, 
    },
  ], 
}


var warmup_wrong = {
  // only runs if the participant responds with the incongruent response for the warmup trial 
  timeline : [warmup], 
  conditional_function: function(){
    var data = jsPsych.data.get().last(2).values()[0];
    if (data.correct){
      return false;
    } else {
      return true;
    }
  }
}

var intro_agents = {
  type: jsPsychInstructions,
  pages: ["<img/src='stim/more-stim/agents.png' style='max-width:100%'>"],
  show_clickable_nav: true, 
  allow_keys: false, 
}


/* full study
   - four blocks: four conditions randomly assigned to a scenario 
   - blocks are randomized  
*/

var conditions = [
  {
    ask_size: "small", 
    interaction_history: "none"
  }, 
  {
    ask_size: "big", 
    interaction_history: "none"
  }, 
  {
    ask_size: "small", 
    interaction_history: "failed"
  }, 
  {
    ask_size: "big", 
    interaction_history: "failed"
  }
]

var scenarios = jsPsych.randomization.repeat(["food", "activity", "toy", "bedtime"], 1)

// assign a random scenario to each condition  
conditions.forEach((condition, i) => condition.scenario = scenarios[i]);

// randomize condition order 
conditions = jsPsych.randomization.repeat(conditions, 1); 

conditions.forEach(dv_prompts); 

// helper function for generating prompts for each condition and scenario
function dv_prompts(condition){ 
  if (condition.scenario  == 'food'){
    if (condition.ask_size == 'small'){
      condition.prompts = [
        'Can I have one more candy?',
        'If I brush my teeth, can I have one more candy?'
      ]
      
    } else {
      condition.prompts = [
          'Can I have ten more candies?',
          'If I brush my teeth, can I have ten more candies?'
      ]
    }
  }

  if (condition.scenario == 'activity'){
    if (condition.ask_size == 'small'){
      condition.prompts = [
        'Can I play one more round of game?',
        'If I clean my room, can I play one more round of game?'
      ]
    } else {
      condition.prompts = [
        'Can I play five more round of games?',
        'If I clean my room, can I play five more round of games?'
      ]
    }
  }

  if (condition.scenario == 'toy'){
    if (condition.ask_size == 'small'){
      condition.prompts = [
        'Can I get one more toy?',
        'If I share my toys, can I get one more toy?'
      ]
    } else {
      condition.prompts = [
        'Can I get five more toys?',
        'If I share my toys, can I get give more toys?'
      ]
    }
  }

  if (condition.scenario == 'bedtime'){
    if (condition.ask_size == 'small'){
      condition.prompts = [
        'Can I stay up for 10 more minutes after bedtime?',
        'If I wake up early tomorrow, can I stay up for 10 more minutes after bedtime?'
      ]
    } else {
        condition.prompts = [
        'Can I stay up for 1 more hour after bedtime?',
        'If I wake up early tomorrow, can I stay up for 1 more hour after bedtime?'
      ]
    }
  }
} 

/* procedure holds the main task structure 
  - instruction: agent intro and rule 
  - attention check 1 (rule)
  - instruction: agent desire (agent wants more of .. )
  - attention check 2 (ask size intuition)
  - main DV: direct vs negotiating 
  - likelihood of success follow up questions (for both direct and negotiation requests)
*/

var procedure = {
  timeline: [
    {
      type: jsPsychInstructions,
      show_clickable_nav: true, 
      allow_keys: false, 
      pages: function() {

        // this is so that we know which manipulation for each scenario we are running 
        const scenario_code = {food: 1,bedtime: 2,activity: 3,toy: 4};
        const ask_size_code = {small: 1,large: 2};
        const interaction_history_code = {none: 1,failed: 2};
        return ['Start']
      }
    },

    // instruction: agent intro and rule
    {
      type: jsPsychInstructions,
      show_clickable_nav: true, 
      allow_keys: false, 
      pages: function() {
        var scenario = jsPsych.timelineVariable('scenario');

        var pages = [
          `<img/src='stim/${scenario}/${scenario}_intro.png' style='max-width:100%'>`, 
          `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
          `<img/src='stim/${scenario}/${scenario}_rule_B.png' style='max-width:100%'>`, 
        ]
        if (scenario == 'food' || scenario == 'activity'){
          pages.push(
            `<img/src='stim/${scenario}/${scenario}_rule_A.png' style='max-width:100%'>`, 
            `<img/src='stim/${scenario}/${scenario}_rule_C.png' style='max-width:100%'>`, 
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
          return [{prompt: "How many candies is Sally allowed to eat?", rows: 1, required: true}];
        } else if (scenario == 'bedtime'){
          return [{prompt: "When is Bobby's bedtime?", rows: 1, required: true}];  
        } else if (scenario == 'toy'){
          return [{prompt: "How many toys is Jordan allowed to get at the toy store?", rows: 1, required: true}]; 
        } else if (scenario == 'activity'){
          return [{prompt: "How many rounds of game is Sam allowed to play?", rows: 1, required: true}]
        }
      },
    },


    // instruction: what does the agent want 
    {
      type: jsPsychInstructions,
      show_clickable_nav: true, 
      allow_keys: false, 
      pages: function() {
        var scenario = jsPsych.timelineVariable('scenario');
        var ask_size = jsPsych.timelineVariable('ask_size')
        return [`<img/src='stim/${scenario}/${scenario}_${ask_size}ask.png' style='max-width:100%'>`]
      }
    },

    // instruction: interaction history (failed or none)
    {
      type: jsPsychInstructions,
      show_clickable_nav: true, 
      allow_keys: false, 
      pages: function() {
        var scenario = jsPsych.timelineVariable('scenario');
        var ask_size = jsPsych.timelineVariable('ask_size')
        var interaction_history = jsPsych.timelineVariable('interaction_history');
        var pages = [];
        if (interaction_history == "none"){
          pages.push(`<img/src='stim/${scenario}/${scenario}_nointeraction.png' style='max-width:100%'>`)
        } else {
          pages.push(
            `<img/src='stim/${scenario}/${scenario}_parent.png' style='max-width:100%'>`,
            `<img/src='stim/${scenario}/${scenario}_child_ask_parent_${ask_size}.png' style='max-width:100%'>`,
            `<img/src='stim/${scenario}/${scenario}_parent_deny.png' style='max-width:100%'>`,
          )
        }
        pages.push(`<img/src='stim/${scenario}/${scenario}_question.png' style='max-width:100%'>`);
        return pages;
      }
    },

    // main dv: negotiation vs direct
    {
      type: KiN_response, 
      trial: 'main_DV',
      ask_size: jsPsych.timelineVariable('ask_size'), 
      interaction_history:jsPsych.timelineVariable('interaction_history'),
      scenario: jsPsych.timelineVariable('scenario'), 
      prompts: jsPsych.timelineVariable('prompts')
    }, 

    // followup 1: likelihood follow up for request
    {

      type: jsPsychHtmlButtonResponse,
      stimulus: function(){
        var scenario= jsPsych.timelineVariable('scenario')
        var follow_up_1 = jsPsych.timelineVariable('prompts')[0]
        
        return `
          <span style="font-size: 2vw; font-weight:bold;">${follow_up_1}</span><br><br>
          <img style = 'width: 10vw;' src="stim/more-stim/${scenario}-agent.png"> 
            `
      },
      choices: [
        'stim/more-stim/yes.png',
        'stim/more-stim/maybe.png',
        'stim/more-stim/no.png'
      ],
      button_html: `
        <button class="jspsych-btn";padding:2vw;background:none;">
          <img src="%choice%" style="max-width:10vw;">
        </button>
      `, 
      margin_horizontal: '4vw', 
      enable_button_after : 12000, 

    }, 
    
    // followup 2: likelihood follow up for request
    {

      type: jsPsychHtmlButtonResponse,
      stimulus: function(){
        var scenario= jsPsych.timelineVariable('scenario')
        var follow_up_2 = jsPsych.timelineVariable('prompts')[1]
        
        return `
          <span style="font-size: 2vw; font-weight:bold;">${follow_up_2}</span><br><br>
          <img style = 'width: 10vw;' src="stim/more-stim/${scenario}-agent.png"> 
        `
      },
      choices: [
        'stim/more-stim/yes.png',
        'stim/more-stim/maybe.png',
        'stim/more-stim/no.png'
      ],
      button_html: `
        <button class="jspsych-btn";padding:2vw;background:none;">
          <img src="%choice%" style="max-width:10vw;">
        </button>
      `, 
      margin_horizontal: '4vw', 
      enable_button_after : 12000, 

    }, 

    // instruction: thank you slide 
    {
      type: jsPsychInstructions,
      show_clickable_nav: true, 
      allow_keys: false, 
      pages: function() {
        var scenario = jsPsych.timelineVariable('scenario');
        return [`<img/src='stim/${scenario}/${scenario}-thankyou.png' style='max-width:100%'>`,]
       
      }
    },
    

  ],
  timeline_variables: conditions
};

// datapipe 
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

// jsPsych.data.get().addToAll({participant_id: participant_code});

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "X1t4NyATuKeH",
  filename: filename,
  data_string: ()=>jsPsych.data.get().csv()
};

timeline.push(participant_id); 
timeline.push(warmup, warmup_wrong, intro_agents); 
timeline.push(procedure);
timeline.push(save_data); 



jsPsych.run(timeline);
