/**
 * Modern Async Helpers
 * Provides async/await wrappers for onclick handlers and legacy code
 */

/**
 * Modern async function to initialize projects and show specific project
 * Can be used in onclick handlers: onclick="showProjectModern('xaml')"
 * @param {string} type - Project type to display
 */
async function showProjectModern(type) {
  try {
    // Show loading state if needed
    console.log(`Loading project: ${type}`);

    // Initialize projects data if not already loaded
    if (typeof ProjectModal !== "undefined") {
      await ProjectModal.initProjects();
      await ProjectModal.showProject(type);
      ProjectModal.openModal();
      ProjectModal.currentSlide(1);
    } else {
      throw new Error("ProjectModal not available");
    }
  } catch (error) {
    console.error("Modern project loading failed, using fallback:", error);

    // Fallback to legacy callback method
    if (typeof window.initProjects === "function") {
      window.initProjects(function () {
        window.showProject(type);
        window.openModal();
        window.currentSlide(1);
      });
    }
  }
}

/**
 * Initialize all modern async functionality
 */
async function initModernHelpers() {
  try {
    // Pre-load all async data
    const promises = [];

    if (typeof ProjectModal !== "undefined") {
      promises.push(ProjectModal.initProjects());
    }

    if (typeof WebsiteGallery !== "undefined") {
      promises.push(WebsiteGallery.init());
    }

    await Promise.all(promises);
    console.log("All modern helpers initialized successfully");
  } catch (error) {
    console.error("Modern helpers initialization failed:", error);
  }
}

/**
 * Async wrapper for any function that needs error handling
 * @param {Function} asyncFn - Async function to wrap
 * @param {Function} fallbackFn - Fallback function if async fails
 */
function asyncWrapper(asyncFn, fallbackFn) {
  return async function (...args) {
    try {
      await asyncFn(...args);
    } catch (error) {
      console.error("Async operation failed, using fallback:", error);
      if (fallbackFn) {
        fallbackFn(...args);
      }
    }
  };
}

// Initialize modern helpers when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModernHelpers);
} else {
  initModernHelpers();
}

// Expose globally for onclick handlers
window.showProjectModern = showProjectModern;
window.asyncWrapper = asyncWrapper;
