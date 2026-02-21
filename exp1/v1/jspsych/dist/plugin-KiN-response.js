// pilot 1.2 modification 
// displaying two prompts with agent in the middle

var KiN_response = (function (jspsych) {
  "use strict";

  const info = {
    name: "KiN_response",
    version: "1.2", 
    parameters: {
      scenario: {
        type: jspsych.ParameterType.STRING,
        default: undefined,
      },
      ask_size: {
        type: jspsych.ParameterType.STRING,
        default: '',
      },
      interaction_history: {
        type: jspsych.ParameterType.STRING,
        default: '',
      },
      prompts: {
        type: jspsych.ParameterType.ARRAY,
        default: [], 
      }, 
      trial: {
        type: jspsych.ParameterType.STRING,
        default: "", 
      },

    },
  };

  /**
   * KiN button response: displaying two prompts (direct vs negotiating) with a hidden button for experimenters
   *
   * @author Urvi Suwal
   */
  class KiNResponse{
    constructor(jsPsych) { 
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      let button_pressed = null;
      let response_pressed = null;
      var buttons; 
      if(trial.trial == 'attention_check_asksize'){
        buttons = jsPsych.randomization.repeat(["alot", "alittle"], 1)
        display_element.innerHTML += `
          <style>
            .imagebutton {
              width: 25vw;
              border: 0.7vw solid white; 

            }
            .secretbutton {
              width: 30vw;
            }
            .imagebutton.selected {
              border: 0.7vw solid green;
            }
          </style>
        `
        display_element.innerHTML += `
          <div style="display: flex; align-items: center; gap: 5vw;">

            <div>
              <img class="secretbutton" src="stim/more-stim/${trial.scenario}_agent_${trial.ask_size}ask.png" id="secret-button" />
            </div>

            <div>
              <img class="imagebutton" src="stim/more-stim/${buttons[0]}.png" id="left-button" />
              <br>
              <img class="imagebutton" src="stim/more-stim/${buttons[1]}.png" id="right-button" />
            </div>

            </div>
            <div style="text-align:center;">
              <button id="next-btn" class="jspsych-btn">&#8594;</button>
            </div>        
          `;
      } 

      if (trial.trial == "main_dv"){
        buttons = jsPsych.randomization.repeat(trial.prompts, 1);
        display_element.innerHTML = `
          <style>
            .container {
              display: flex; 
              justify-content: center; 
              align-items: center; 
              gap: 5vw; 
            }

            .box {
              width: 20vw; 
              height: 15vw;
              background-color: powderblue;
              border-radius: 2vw; 
              border: 1vw solid white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              text-align: center; 
              padding: 1.5vw; 
              box-sizing: content-box; 
              font-size: 2vw;
              font-weight: bold;
              line-height: 2.5vw;
            }
            .box.selected {
              border: 1vw solid green;
            }

            .center-img {
              width: 15vw;
              padding-top: 15vw;
            }
          </style>`
        
        
        display_element.innerHTML +=  `
          <div class="container">
            <div class="box" id="left-button">${buttons[0]}</div>
              <img class="center-img" id="secret-button" src="stim/more-stim/${trial.scenario}-agent.png">
            <div class="box" id="right-button">${buttons[1]}</div>
          </div>

          <div style="text-align:center; margin-top:5vw;">
            <button id="next-btn" class="jspsych-btn">&#8594;</button>
          </div>`;
    }
      
     

      
      const leftButton = document.getElementById('left-button');
      const rightButton = document.getElementById('right-button');
      const secretButton = document.getElementById('secret-button');
      var choicemade = false; 
      var secretbutton_pressed = false; 

      function clearSelection() {
        leftButton.classList.remove('selected');
        rightButton.classList.remove('selected');
      }

      leftButton.addEventListener('click', () => {
        choicemade = true;
        clearSelection();
        leftButton.classList.add('selected');

        button_pressed = "left";
        response_pressed = buttons[0];
      });

      rightButton.addEventListener('click', () => {
        choicemade = true;
        clearSelection();
        rightButton.classList.add('selected');

        button_pressed = "right";
        response_pressed = buttons[1];
      });

      secretButton.addEventListener('click', () => {
        secretbutton_pressed = true; 
      })
      
      document.getElementById('next-btn').addEventListener('click', () => {
         var trial_data = {
          scenario: trial.scenario, 
          ask_size: trial.ask_size, 
          interaction_history: trial.interaction_history, 
          buttons: buttons, 
          button_pressed: button_pressed,
          response: response_pressed
        };

        if (secretbutton_pressed & choicemade){
           this.jsPsych.finishTrial(trial_data);
        }
       

       
    }); 


}



  }
  KiNResponse.info = info;

  return KiNResponse;
})(jsPsychModule);