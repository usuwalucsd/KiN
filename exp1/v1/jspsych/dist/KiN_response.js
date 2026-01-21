var KiN_response = (function (jspsych) {
  "use strict";

  const info = {
    name: "KiN_response",
    version: "0.0.1", 
    parameters: {
      scenario: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
      ask_size: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
      interaction_history: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
    },
  };

  /**
   * **{packageName}**
   *
   * {description}
   *
   * @author Urvi Suwal
   */
  class KiNResponse{
    constructor(jsPsych) { 
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      
      let [left_button, right_button] = Math.random() < 0.5 ? ["circle", "square"] : ["square", "circle"];
     
      let direct_response = "stim/responses/"+ trial.scenario + "-direct-" + trial.ask_size + ".png"
      let negotiation_response = "stim/responses/"+ trial.scenario + "-negotiate-" + trial.ask_size + ".png"
     
      let [left_response, right_response] = Math.random() < 0.5 ? [direct_response, negotiation_response] : [negotiation_response, direct_response]


      var button_pressed; 
      var response_pressed;

      display_element.innerHTML = '<div style="position: relative; width: 100%; padding-top: 20%;">' + 

        '<img id="left-img" src="' + left_response + '" style="width:25%; position:absolute; left:20%; top:0; border:2px solid black; border-radius:30px; display:none;">' + 

        '<img id="center-img" src="stim/more-stim/' + trial.scenario + '-agent.png"' + 'style="width:18%; display:block; margin: 0 auto;">' + 

        '<img id="right-img" src="' + right_response + '" style="width:25%; position:absolute; right:20%; top:0; border:2px solid black; border-radius:30px; display:none;">' + 
        
        '</div>' + 
        
        '<div style="margin-top: 20px; text-align: center;">' +  
          '<img id="left-btn" src="stim/more-stim/'+ left_button +'.png" style="width:10%; cursor:pointer; margin-right: 8%;">' + 
          '<img id="right-btn" src="stim/more-stim/'+right_button+'.png" style="width:10%; cursor:pointer;">' + 
         '</div>' + 
         '<button id="next-btn" class="jspsych-btn"">Next</button>'

      document.getElementById('left-btn').addEventListener('click', () => {
        document.getElementById('left-img').style.display = 'block';
        document.getElementById('right-img').style.display = 'none';
        button_pressed = left_button
        response_pressed = left_response
      });

      document.getElementById('right-btn').addEventListener('click', () => {
        document.getElementById('right-img').style.display = 'block';
        document.getElementById('left-img').style.display = 'none';
        button_pressed = right_button
        response_pressed = right_response

      });

      document.getElementById('next-btn').addEventListener('click', () => {
      var trial_data = {
        scenario: trial.scenario, 
        ask_size: trial.ask_size, 
        interaction_history: trial.interaction_history, 
        button_pressed: button_pressed,
        response: response_pressed
      };

      this.jsPsych.finishTrial(trial_data); // use the captured `plugin` variable
  });


      
    }
  }
  KiNResponse.info = info;

  return KiNResponse;
})(jsPsychModule);