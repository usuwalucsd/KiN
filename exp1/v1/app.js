
// cogs119 githubtesting
 
var jsPsych = initJsPsych({
  // on_finish: function() {
  //   jsPsych.data.displayData();
  // }
});

var participant_code = ''; 

var participant_id = {
  type: jsPsychSurveyText,
  questions: [
      {prompt: 'Participant ID', rows: 1, required: true}
  ], 
  on_finish: function(trial){
      participant_code = (trial.response["Q0"])
  }, 
};

// generic shuffling 
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function condition_randomization() {
  /* condition randomization 
  scenario, ask size, interaction history
  for each scenario, this function selects a manipulation for either parameters: ask size and interaction history
*/
  const scenarios = shuffle(["food", "bedtime", "activity", "toy"]);
  const ask_size_interaction_history = shuffle([
    ["small", "none"],
    ["small", "failed"],
    ["large", "none"],
    ["large", "failed"]
  ]);

  const exp_conditions = scenarios.map((scenario, i) => [
    scenario,
    ...ask_size_interaction_history[i]
  ]);

  return exp_conditions;
}

// all conditions 
const experiment_conditions = shuffle(condition_randomization())

// this is so that we know which manipulation for each scenario we are running 
const scenario_code = {food: 1,bedtime: 2,activity: 3,toy: 4};
const ask_size_code = {small: 1,large: 2};
const interaction_history_code = {none: 1,failed: 2};
/* condition codes 
array of numbers that indicates which manipulation we are running for each scenario 
numbers look like scenario.asksize.interactionhistory for eg. 1.2.1
they should be in the order of randomization based on experiment conditions
*/
const condition_codes = experiment_conditions.map(([s, a, h]) => `${scenario_code[s]}.${ask_size_code[a]}.${interaction_history_code[h]}`);


var timeline;

function stimset(condition){
  /*  
    helper function that returns the images that we will be using for each scenario 
    returns an array with two elements, first element is an array of slides for the scenario, second element is an array with one element which is a thank you slide
  */
  var stimset_images = [(condition[0]+"-background"), (condition[0]+"-1")]
  if (condition[1] == 'small'){
    stimset_images.push(condition[0]+"-small-ask")
  } else {
    stimset_images.push(condition[0]+"-big-ask")
  }

  if (condition[2] == 'failed') {
    stimset_images.push(condition[0]+"-parent")
    if (condition[1] == 'small'){
      stimset_images.push(condition[0]+"-parent-childspeak-smallask")
    } else {
      stimset_images.push(condition[0]+"-parent-childspeak-bigask")
    }
    stimset_images.push(condition[0]+"-parent-parentspeak")
  } else {
     stimset_images.push(condition[0]+"-3")
  }
  stimset_images.push(condition[0]+"-4")

  for (let i=0; i < stimset_images.length; i++){
    stimset_images[i] = '<img src="' + "stim/" + condition[0] + "/" + stimset_images[i] + '.png" '+ 'style="max-width:100%">'; 
  }

  var thank_you =[   '<img src="stim/' + condition[0] + '/' + condition[0] + '-thankyou.png" style="max-width:100%">']

  return [stimset_images, thank_you];
}


var timeline; 


var preload = {
    type: jsPsychPreload,
    auto_preload: true
    // images: allstims
}


var start = {
  type: jsPsychInstructions, 
  pages: jsPsych.timelineVariable("start"), 
  show_clickable_nav: true, 
  allow_keys: false,
}

var scenario = {
  type: jsPsychInstructions, 
  pages: jsPsych.timelineVariable('pages'),
  show_clickable_nav: true, 
  allow_keys: false, 
}

var response = {
  type: KiN_response, 
  scenario: jsPsych.timelineVariable("scenario"), 
  ask_size: jsPsych.timelineVariable("ask_size"),
  interaction_history: jsPsych.timelineVariable("interaction_history")
}

var thankyou = {
  type: jsPsychInstructions,
  pages: jsPsych.timelineVariable("thankyou"), 
  show_clickable_nav: true, 
  allow_keys: false, 
}
var fullscreen = {
  type: jsPsychFullscreen
}

var intro_agents = {
  type: jsPsychInstructions,
  pages: ["<img/src='stim/more-stim/agents.png' style='max-width:100%'>"],
  show_clickable_nav: true, 
  allow_keys: false, 
}


var dv_small_ask = {
  type: jsPsychHtmlButtonResponse,
  stimulus: jsPsych.timelineVariable("agentprompt1"), 
  choices: ['<img src="stim/more-stim/yes.png" style="max-width:10%">', '<img src="stim/more-stim/maybe.png" style="max-width:10%">', '<img src="stim/more-stim/no.png" style="max-width:10%">'],
}

var dv_big_ask = {
  type: jsPsychHtmlButtonResponse,
  stimulus: jsPsych.timelineVariable("agentprompt2"), 
  choices: ['<img src="stim/more-stim/yes.png" style="max-width:10%">', '<img src="stim/more-stim/maybe.png" style="max-width:10%">', '<img src="stim/more-stim/no.png" style="max-width:10%">'],
}

// var dv_test = {
//   type: jsPsychHtmlButtonResponse,
//   // stimulus: '<img src="stim/more-stim/food-agent.png" style="max-width:10%"><img src="stim/responses/food-direct-small.png" style="max-width:20%">',
//   choices: ['<img src="stim/more-stim/yes.png" style="max-width:10%">', '<img src="stim/more-stim/maybe.png" style="max-width:10%">', '<img src="stim/more-stim/no.png" style="max-width:10%">'],
// }

var procedure = {
  timeline: [start, scenario, response, dv_small_ask, dv_big_ask, thankyou],
  timeline_variables: [
    {start: [condition_codes[0]], pages: stimset(experiment_conditions[0])[0], scenario: experiment_conditions[0][0], ask_size: experiment_conditions[0][1], interaction_history: experiment_conditions[0][2], thankyou: stimset(experiment_conditions[0])[1], 
      agentprompt1: '<img src="stim/more-stim/'+experiment_conditions[0][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[0][0]+'-direct-'+experiment_conditions[0][1]+'.png" style="max-width:20%">',
      agentprompt2: '<img src="stim/more-stim/'+experiment_conditions[0][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[0][0]+'-negotiate-'+experiment_conditions[0][1]+'.png" style="max-width:20%">',
    },   
   
    {start: [condition_codes[1]], pages: stimset(experiment_conditions[1])[0], scenario: experiment_conditions[1][0], ask_size: experiment_conditions[1][1], interaction_history: experiment_conditions[1][2], thankyou: stimset(experiment_conditions[1])[1],
      agentprompt1: '<img src="stim/more-stim/'+experiment_conditions[1][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[1][0]+'-direct-'+experiment_conditions[1][1]+'.png" style="max-width:20%">',
      agentprompt2: '<img src="stim/more-stim/'+experiment_conditions[1][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[1][0]+'-negotiate-'+experiment_conditions[1][1]+'.png" style="max-width:20%">',
    },   
    {start: [condition_codes[2]], pages: stimset(experiment_conditions[2])[0], scenario: experiment_conditions[2][0], ask_size: experiment_conditions[2][1], interaction_history: experiment_conditions[2][2], thankyou: stimset(experiment_conditions[2])[1], 
      agentprompt1: '<img src="stim/more-stim/'+experiment_conditions[2][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[2][0]+'-direct-'+experiment_conditions[2][1]+'.png" style="max-width:20%">',
      agentprompt2: '<img src="stim/more-stim/'+experiment_conditions[2][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[2][0]+'-negotiate-'+experiment_conditions[2][1]+'.png" style="max-width:20%">',

    },   
    {start: [condition_codes[3]], pages: stimset(experiment_conditions[3])[0], scenario: experiment_conditions[3][0], ask_size: experiment_conditions[3][1], interaction_history: experiment_conditions[3][2], thankyou: stimset(experiment_conditions[3])[1], 
            agentprompt1: '<img src="stim/more-stim/'+experiment_conditions[3][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[3][0]+'-direct-'+experiment_conditions[3][1]+'.png" style="max-width:20%">',
      agentprompt2: '<img src="stim/more-stim/'+experiment_conditions[3][0]+'-agent.png" style="max-width:10%"><img src="stim/responses/'+experiment_conditions[3][0]+'-negotiate-'+experiment_conditions[3][1]+'.png" style="max-width:20%">',

    },   
  ]
}

var exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false, 
  delay_after: 0, 
  
}; 


// datapipe 
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

jsPsych.data.get().addToAll({participant_id: participant_code});

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "X1t4NyATuKeH",
  filename: filename,
  data_string: ()=>jsPsych.data.get().csv()
};


// timeline 
timeline = [ 
  fullscreen,
  preload, 
  participant_id, 
  intro_agents,
  procedure,
  save_data,
  exit_fullscreen, 
]


jsPsych.run(timeline);

