// initialization 
var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
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
  const scenarios = ["food", "bedtime", "activity", "toy"]; 
  const ask_size = ["small", "large"];
  const interaction_history = ["none", "failed"];

  const rand = arr => arr[Math.floor(Math.random() * arr.length)];

  const exp_conditions = [];

  for (let i = 0; i < scenarios.length; i++) {
    exp_conditions.push([
      scenarios[i],
      rand(ask_size),
      rand(interaction_history)
    ]);
  }
  return exp_conditions;
}

const experiment_conditions = shuffle(condition_randomization())

const scenario_code = {food: 1,bedtime: 2,activity: 3,toy: 4};
const ask_size_code = {small: 1,large: 2};
const interaction_history_code = {none: 1,failed: 2};
const condition_codes = experiment_conditions.map(([s, a, h]) => `${scenario_code[s]}.${ask_size_code[a]}.${interaction_history_code[h]}`);


var timeline;

/*  */
function stimset(condition){
  var stimset_images = [(condition[0]+"-background"), (condition[0]+"-1"), (condition[0]+"-2")]

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

var procedure = {
  timeline: [start, scenario, response, thankyou],
  timeline_variables: [
    {start: [condition_codes[0]], pages: stimset(experiment_conditions[0])[0], scenario: experiment_conditions[0][0], ask_size: experiment_conditions[0][1], interaction_history: experiment_conditions[0][2], thankyou: stimset(experiment_conditions[0])[1]},   
    {start: [condition_codes[1]], pages: stimset(experiment_conditions[1])[0], scenario: experiment_conditions[1][0], ask_size: experiment_conditions[1][1], interaction_history: experiment_conditions[1][2], thankyou: stimset(experiment_conditions[1])[1]},   
    {start: [condition_codes[2]], pages: stimset(experiment_conditions[2])[0], scenario: experiment_conditions[2][0], ask_size: experiment_conditions[2][1], interaction_history: experiment_conditions[2][2], thankyou: stimset(experiment_conditions[2])[1]},   
    {start: [condition_codes[3]], pages: stimset(experiment_conditions[3])[0], scenario: experiment_conditions[3][0], ask_size: experiment_conditions[3][1], interaction_history: experiment_conditions[3][2], thankyou: stimset(experiment_conditions[3])[1]},   
  ]
}

var exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false, 
  delay_after: 0, 
  
}; 


timeline = [ 
  fullscreen,
  participant_id, 
  intro_agents,
  procedure,
  exit_fullscreen
]


jsPsych.run(timeline);

