/**
 * Utility functions for the portfolio application
 */

const Utils = {
  /**
   * Load JSON file using XMLHttpRequest (callback version for backward compatibility)
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
          callback(null);
        }
      }
    };
    xobj.send(null);
  },

  /**
   * Load JSON file using modern async/await pattern
   * @param {string} file - Path to JSON file
   * @returns {Promise<Object>} Promise that resolves to parsed JSON data
   */
  loadJSONAsync: async function (file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error(`Failed to load ${file}:`, error);
      throw error;
    }
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
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    return raf(callback);
  },

  /**
   * Modern async wrapper for project initialization and display
   * @param {string} type - Project type to show
   */
  showProjectAsync: async function (type) {
    try {
      if (typeof ProjectModal !== "undefined") {
        await ProjectModal.initProjects();
        await ProjectModal.showProject(type);
        ProjectModal.openModal();
        ProjectModal.currentSlide(1);
      }
    } catch (error) {
      console.error("Failed to show project:", error);
      // Fallback to legacy method
      if (
        typeof window.initProjects === "function" &&
        typeof window.showProject === "function"
      ) {
        window.initProjects(function () {
          window.showProject(type);
          window.openModal();
          window.currentSlide(1);
        });
      }
    }
  },

  /**
   * Create a promise that resolves after a delay
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after delay
   */
  delay: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
