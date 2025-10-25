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

  // Scroll stop detection
  let scrollTimeout;

  /**
   * Handle scroll events for UI animations
   */
  function handleScroll() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return;

    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // Use requestAnimationFrame for smooth animations
    Utils.requestAnimFrame(() => {
      // Hide menu immediately while scrolling (any direction)
      hideUIElements();
    });

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Show menu when scrolling stops (after 150ms of no scroll)
    scrollTimeout = setTimeout(() => {
      Utils.requestAnimFrame(() => {
        showUIElements();
      });
    }, 150);

    lastScrollTop = currentScroll;
  }

  /**
   * Set visibility state of start box
   * @param {number} state - 1 for hidden, 2 for visible
   */
  function setStartBoxState(state) {
    if (!elements.startBox) {
      elements.startBox = document.getElementById("start");
    }
    if (!elements.startBox) return;

    // Use requestAnimationFrame for smooth state changes
    Utils.requestAnimFrame(() => {
      if (state === 1) {
        elements.startBox.style.visibility = "hidden";
      } else if (state === 2) {
        elements.startBox.style.visibility = "visible";
      }
    });
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
    if (!elements.startBox) {
      elements.startBox = document.getElementById("start");
    }
    if (!elements.startBox) return;

    // Use requestAnimationFrame for smooth repositioning
    Utils.requestAnimFrame(() => {
      const rect = elements.startBox.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      elements.startBox.style.visibility = "visible";
      elements.startBox.style.top = window.innerHeight / 2 - height / 2 + "px";
      elements.startBox.style.left = window.innerWidth / 2 - width / 2 + "px";
    });
  }

  /**
   * Initialize the application (modern async version)
   */
  async function init() {
    cacheElements();
    handleResize();
    initFlickerAnimation();

    // Show UI elements initially (menu should be visible on page load)
    showUIElements();

    // Pre-load projects data using modern async pattern
    try {
      if (typeof ProjectModal !== "undefined" && ProjectModal.initProjects) {
        await ProjectModal.initProjects();
        console.log("Projects data loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load projects data:", error);
    }
  }

  /**
   * Initialize the application (legacy version for backward compatibility)
   */
  function initLegacy() {
    cacheElements();
    handleResize();
    initFlickerAnimation();

    // Show UI elements initially (menu should be visible on page load)
    showUIElements();

    // Pre-load projects data (with delay to ensure ProjectModal is loaded)
    setTimeout(function () {
      if (
        typeof ProjectModal !== "undefined" &&
        ProjectModal.initProjectsLegacy
      ) {
        ProjectModal.initProjectsLegacy(function () {
          console.log("Projects data loaded successfully");
        });
      }
    }, 100);
  }

  /**
   * Start the application (modern async version)
   */
  async function start() {
    // Small delay to ensure DOM is fully ready
    await new Promise((resolve) => setTimeout(resolve, 50));
    await init();
  }

  /**
   * Start the application (legacy version)
   */
  function startLegacy() {
    // Small delay to ensure DOM is fully ready
    setTimeout(function () {
      initLegacy();
    }, 50);
  }

  // Set up event listeners with performance optimizations
  window.addEventListener("load", async function () {
    try {
      await start();
    } catch (error) {
      console.error(
        "Modern app initialization failed, using legacy fallback:",
        error
      );
      startLegacy();
    }
  });

  window.addEventListener("resize", Utils.debounce(handleResize, 250));
  window.addEventListener("scroll", Utils.throttle(handleScroll, 16), {
    passive: true,
  }); // 60fps throttling

  // Public API
  return {
    init: init,
    initLegacy: initLegacy,
    start: start,
    startLegacy: startLegacy,
    handleResize: handleResize,
  };
})();

// Expose for backward compatibility
window.init = App.initLegacy; // Keep legacy for onclick handlers
window.handleResize = App.handleResize;
