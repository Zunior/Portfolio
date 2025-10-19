/**
 * Main Application Controller
 * Handles page initialization, scroll effects, and animations
 * Uses module pattern to avoid global pollution
 */
const App = (function () {
  // Private variables
  let lastScrollTop = 0;
  const MOBILE_BREAKPOINT = 768;
  const SCROLL_OFFSET = 50;
  const FLICKER_MAX_COUNT = 40;

  // Cache DOM elements
  let elements = {
    menu: null,
    profile: null,
    footer: null,
    startBox: null,
  };

  /**
   * Cache DOM elements for better performance
   */
  function cacheElements() {
    elements.menu = document.getElementById("meni");
    elements.profile = document.getElementById("sasa");
    elements.footer = document.getElementById("foot");
    elements.startBox = document.getElementById("start");

    // Force menu to be visible on desktop (Bootstrap 5 fix)
    const navCollapse = document.getElementById("nav_traka");
    if (navCollapse && window.innerWidth > 768) {
      navCollapse.classList.add("show");
    }
  }

  /**
   * Get section position relative to viewport
   * @param {string} sectionId - ID of the section element
   * @returns {number} Position from top of page
   */
  function getSectionPosition(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return 0;
    return (
      window.pageYOffset + section.getBoundingClientRect().top - SCROLL_OFFSET
    );
  }

  /**
   * Toggle element classes for animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} removeClass - Class to remove
   * @param {string} addClass - Class to add
   */
  function toggleElementClass(element, removeClass, addClass) {
    if (!element) return;
    element.classList.remove(removeClass);
    element.classList.add(addClass);
  }

  /**
   * Show UI elements (menu, profile, footer)
   */
  function showUIElements() {
    toggleElementClass(elements.menu, "menuUp", "menuDown");
    toggleElementClass(elements.profile, "profileUp", "profileDown");
    toggleElementClass(elements.footer, "footerUp", "footerDown");
  }

  /**
   * Hide UI elements (menu, profile, footer)
   */
  function hideUIElements() {
    toggleElementClass(elements.menu, "menuDown", "menuUp");
    toggleElementClass(elements.profile, "profileDown", "profileUp");
    toggleElementClass(elements.footer, "footerDown", "footerUp");
  }

  /**
   * Handle scroll events for UI animations
   */
  function handleScroll() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;

    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Get section positions
    const aboutPos = getSectionPosition("omeni");
    const projectsPos = getSectionPosition("projekti");
    const contactPos = getSectionPosition("kontakt");

    // Check if we're at the bottom of the page
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = currentScroll + windowHeight >= documentHeight - 10;

    // Check if we're near a section or scrolling up
    const nearSection =
      Math.abs(currentScroll - aboutPos) < 5 ||
      Math.abs(currentScroll - projectsPos) < 5 ||
      Math.abs(currentScroll - contactPos) < 5;

    // Show menu when: scrolling up, near a section, or at bottom
    if (currentScroll < lastScrollTop || nearSection || isAtBottom) {
      showUIElements();
    } else {
      hideUIElements();
    }

    lastScrollTop = currentScroll;
  }

  /**
   * Set visibility state of start box
   * @param {number} state - 1 for hidden, 2 for visible
   */
  function setStartBoxState(state) {
    const startBox = document.getElementById("start");
    if (!startBox) return;

    if (state === 1) {
      startBox.style.visibility = "hidden";
    } else if (state === 2) {
      startBox.style.visibility = "visible";
    }
  }

  /**
   * Initialize flicker animation for start box
   */
  function initFlickerAnimation() {
    let counter = 0;

    const flicker = function () {
      counter++;
      const randomState = Math.floor(Math.random() * 2) + 1;
      setStartBoxState(randomState);

      const randomDelay = Math.round(Math.random() * 50) + 50;

      // Stop after max count and when visible
      if (counter > FLICKER_MAX_COUNT && randomState === 2) {
        return;
      }

      setTimeout(flicker, randomDelay);
    };

    flicker();
  }

  /**
   * Handle window resize - reposition start box
   */
  function handleResize() {
    const startBox = document.getElementById("start");
    if (!startBox) return;

    const rect = startBox.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    startBox.style.visibility = "visible";
    startBox.style.top = window.innerHeight / 2 - height / 2 + "px";
    startBox.style.left = window.innerWidth / 2 - width / 2 + "px";
  }

  /**
   * Initialize the application
   */
  function init() {
    cacheElements();
    handleResize();
    initFlickerAnimation();

    // Show UI elements initially (menu should be visible on page load)
    showUIElements();

    // Pre-load projects data (with delay to ensure ProjectModal is loaded)
    setTimeout(function () {
      if (typeof ProjectModal !== "undefined" && ProjectModal.initProjects) {
        ProjectModal.initProjects(function () {
          console.log("Projects data loaded successfully");
        });
      }
    }, 100);
  }

  /**
   * Start the application
   */
  function start() {
    // Small delay to ensure DOM is fully ready
    setTimeout(function () {
      init();
    }, 50);
  }

  // Set up event listeners
  window.addEventListener("load", start);
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, false);

  // Public API
  return {
    init: init,
    start: start,
    handleResize: handleResize,
  };
})();

// Expose for backward compatibility
window.init = App.init;
window.handleResize = App.handleResize;
