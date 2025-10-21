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

  // Cache DOM elements for better performance
  _cachedElements: {},

  /**
   * Get cached DOM element or query and cache it
   * @param {string} id - Element ID
   * @returns {HTMLElement|null} The DOM element
   */
  getElement: function (id) {
    if (!this._cachedElements[id]) {
      this._cachedElements[id] = document.getElementById(id);
    }
    return this._cachedElements[id];
  },

  /**
   * Show loading indicator
   */
  showLoader: function () {
    const loader = this.getElement("loader");
    if (loader) loader.style.display = "block";
  },

  /**
   * Hide loading indicator
   */
  hideLoader: function () {
    const loader = this.getElement("loader");
    if (loader) loader.style.display = "none";
  },

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately
   * @returns {Function} Debounced function
   */
  debounce: function (func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle: function (func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Request animation frame with fallback
   * @param {Function} callback - Function to execute
   */
  requestAnimFrame: function (callback) {
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    return raf(callback);
  },
};
