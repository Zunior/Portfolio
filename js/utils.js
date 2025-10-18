/**
 * Utility functions for the portfolio application
 */

const Utils = {
  /**
   * Load JSON file using XMLHttpRequest
   * @param {string} file - Path to JSON file
   * @param {function} callback - Callback function to handle response
   */
  loadJSON: function (file, callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4) {
        if (xobj.status == "200") {
          callback(xobj.responseText);
        } else {
          console.error(`Failed to load ${file}: ${xobj.status}`);
        }
      }
    };
    xobj.send(null);
  },

  /**
   * Show loading indicator
   */
  showLoader: function () {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block";
  },

  /**
   * Hide loading indicator
   */
  hideLoader: function () {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  },
};
