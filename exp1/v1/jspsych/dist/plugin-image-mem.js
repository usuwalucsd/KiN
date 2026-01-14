var image_memorability = (function (jspsych) {
  "use strict";

  const info = {
    name: "image_memorability",
    parameters: {
      images: {
        type: jspsych.ParameterType.ARRAY,
        pretty_name: 'images',
        default: [undefined],
        description: 'image names'
      },
      target: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'target',
        default: false,
        description: 'whether the set images are target or not'
      },
      trial_info: {
        type:jspsych.ParameterType.STRING, 
        pretty_name: "trial_info", 
        default: "", 
        description: "information about which set of images (for example: high objective, low subjective)"
      }
    },
  };

  /**
   * **Pointer Screen Plugin**
   *
   * For the motion tracking pointing task 
   *
   * @author Urvi Suwal
   */
  class ImageMemorability {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      var trial_data = {
        images: JSON.stringify(trial.images), 
        trial_info: trial.trial_info, 
        target: trial.target
      }
      display_element.innerHTML = "<img id='slideshow' style='width: 40vw; height: 40vw; object-fit: cover;' src='" + trial.target + "'>";

      var imagePaths = trial.images; // Concatenate the target images to the images array

      let currentIndex = 0;
      const imageElement = document.getElementById('slideshow');

      function showNextImage() {
        if (currentIndex < imagePaths.length) {
          imageElement.src = imagePaths[currentIndex];
          currentIndex++;
        } else {
          clearInterval(slideshowInterval);
          jsPsych.finishTrial(trial_data); // End the trial if using jsPsych
        }
      }

      var showtime = 1000
      if (trial.target){
        showtime = 2000
      }
      // Set the interval to change image every 500 ms
      const slideshowInterval = setInterval(showNextImage, showtime);

      // Initial display
      showNextImage();
    }
  }
  ImageMemorability.info = info;

  return ImageMemorability;
})(jsPsychModule);
