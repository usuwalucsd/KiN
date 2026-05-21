var negotiation_cover_story = (function (jspsych) {
  "use strict";

  const info = {
    name: "negotiation_cover_story",
    parameters: {
      slides: {
        type: jspsych.ParameterType.ARRAY,
        pretty_name: 'slides',
        default: [undefined],
        description: 'slide images'
      }, 
      background: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'background',
        default: 's',
        description: 'background image name'
      }   
    },
  };

  /**
   * Negotitation Cover Story Plugin
   
   * @author Urvi Suwal
   */
  class NegotiationCoverStory {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      const start_time = performance.now(); 
 
      var background = '<img src="stim/background.png" style="max-width: 99%; max-height: 99%;">'

      display_element.innerHTML = background;
      // const start_time = performance.now();
      
      // background image 
      // agent 
      // parent 
      // cloud bubble thing 
      //  

      // let html = `
      //   <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1vw;">`;

      // for (let i = 0; i < trial.images.images.length; i++) {
      //   html += `
      //     <button class="image-button" data-index="${i}" style="border: 3px solid white; padding: 0; background: none;">
      //       <img src="${trial.images.images[i]}" style="width: 10vw; height: 10vw; object-fit: cover;">
      //     </button>`;
      // }

      // html += `</div>
      //   <div style="margin-top: 2vh; text-align: center;">
      //     <button id="next-button" style="padding: 10px 20px; font-size: 1.2em;" disabled>Next</button>
      //   </div>
      // `;

      // display_element.innerHTML = html;

      // const buttons = display_element.querySelectorAll('.image-button');
      // const next_button = display_element.querySelector('#next-button');

      // buttons.forEach(btn => {
      //   btn.addEventListener('click', (e) => {
      //     const index = e.currentTarget.getAttribute('data-index');
      //     const selected_image = trial.images.images[index];
      //     const rt = performance.now() - start_time;

      //     // Visually highlight clicked image
      //     e.currentTarget.style.border = '3px solid red';

      //     // Prevent clicking this one again
      //     e.currentTarget.disabled = true;

      //     clicks.push({
      //       image: selected_image,
      //       rt: rt
      //     });

      //     if (clicks.length === 2) {
      //       // Disable all other buttons
      //       buttons.forEach(b => b.disabled = true);

      //       // Enable the next button
      //       next_button.disabled = false;
      //     }
      //   });
      // });

      // next_button.addEventListener('click', () => {
      //   if (clicks.length === 2) {
      //     this.jsPsych.finishTrial({
      //       selected_image_1: clicks[0].image,
      //       rt_1: clicks[0].rt,
      //       selected_image_2: clicks[1].image,
      //       rt_2: clicks[1].rt
      //     });
      //   }
      // });
    }
  }

  NegotiationCoverStory.info = info;

  return NegotiationCoverStory;
})(jsPsychModule);
