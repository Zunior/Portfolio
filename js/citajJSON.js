/**
 * Website Gallery Manager
 * Manages website portfolio items with carousel functionality
 * Uses IIFE pattern to avoid global variable pollution
 */
const WebsiteGallery = (function () {
  // Private variables
  let websitesData = null;
  let designItems = [];
  let generalItems = [];
  let designCounter = 1;
  let generalCounter = 1;
  let maxDesign = 0;
  let maxGeneral = 0;
  let currentDesign = 0;
  let currentGeneral = 0;

  // Cache DOM elements for better performance
  let cachedElements = {
    designElement: null,
    generalElement: null,
  };

  /**
   * Initialize cached elements
   */
  function initCachedElements() {
    cachedElements.designElement = document.getElementById("srednjiD");
    cachedElements.generalElement = document.getElementById("srednjiO");
  }

  /**
   * Initialize the gallery by loading website data (modern async version)
   */
  async function init() {
    try {
      websitesData = await Utils.loadJSONAsync("sajtovi.json");

      // Load design items
      if (websitesData.web_dizajn) {
        for (let i in websitesData.web_dizajn) {
          designItems.push([
            websitesData.web_dizajn[i].slika,
            websitesData.web_dizajn[i].link,
          ]);
          maxDesign++;
        }
      }

      // Load general items
      if (websitesData.opšte) {
        for (let i in websitesData.opšte) {
          generalItems.push([
            websitesData.opšte[i].slika,
            websitesData.opšte[i].link,
          ]);
          maxGeneral++;
        }
      }

      console.log("Website gallery data loaded successfully");
    } catch (error) {
      console.error("Failed to initialize website gallery:", error);
      // Fallback to empty arrays so the gallery still functions
      designItems = [];
      generalItems = [];
      maxDesign = 0;
      maxGeneral = 0;
    }
  }

  /**
   * Initialize the gallery (legacy callback version for backward compatibility)
   */
  function initLegacy() {
    Utils.loadJSON("sajtovi.json", function (response) {
      if (!response) {
        console.error("Failed to load sajtovi.json");
        return;
      }

      try {
        websitesData = JSON.parse(response);

        // Load design items
        if (websitesData.web_dizajn) {
          for (let i in websitesData.web_dizajn) {
            designItems.push([
              websitesData.web_dizajn[i].slika,
              websitesData.web_dizajn[i].link,
            ]);
            maxDesign++;
          }
        }

        // Load general items
        if (websitesData.opšte) {
          for (let i in websitesData.opšte) {
            generalItems.push([
              websitesData.opšte[i].slika,
              websitesData.opšte[i].link,
            ]);
            maxGeneral++;
          }
        }
      } catch (error) {
        console.error("Error parsing sajtovi.json:", error);
      }
    });
  }

  /**
   * Update image element with new background and link
   * @param {HTMLElement} element - The image element to update
   * @param {Array} item - Array containing [imageUrl, linkUrl]
   */
  function updateImageElement(element, item) {
    if (!element || !item) return;

    element.style.background =
      "-webkit-radial-gradient(center center, ellipse cover, rgba(0,0,0,0) 30%,rgba(255,255,255,1) 70%), url('" +
      item[0] +
      "')";
    element.style.backgroundSize = "cover";
    element.href = item[1];
  }

  /**
   * Navigate to next design item
   */
  function nextDesignItem() {
    designCounter++;
    if (!cachedElements.designElement) initCachedElements();
    if (!cachedElements.designElement) return;

    if (designCounter <= maxDesign) {
      currentDesign = designCounter;
    } else {
      currentDesign = designCounter = 1;
    }

    // Use requestAnimationFrame for smooth updates
    Utils.requestAnimFrame(() => {
      updateImageElement(
        cachedElements.designElement,
        designItems[currentDesign - 1]
      );
    });
  }

  /**
   * Navigate to previous design item
   */
  function previousDesignItem() {
    designCounter--;
    if (!cachedElements.designElement) initCachedElements();
    if (!cachedElements.designElement) return;

    if (designCounter >= 1) {
      currentDesign = designCounter;
    } else {
      currentDesign = designCounter = maxDesign;
    }

    // Use requestAnimationFrame for smooth updates
    Utils.requestAnimFrame(() => {
      updateImageElement(
        cachedElements.designElement,
        designItems[currentDesign - 1]
      );
    });
  }

  /**
   * Navigate to next general item
   */
  function nextGeneralItem() {
    generalCounter++;
    if (!cachedElements.generalElement) initCachedElements();
    if (!cachedElements.generalElement) return;

    if (generalCounter <= maxGeneral) {
      currentGeneral = generalCounter;
    } else {
      currentGeneral = generalCounter = 1;
    }

    // Use requestAnimationFrame for smooth updates
    Utils.requestAnimFrame(() => {
      updateImageElement(
        cachedElements.generalElement,
        generalItems[currentGeneral - 1]
      );
    });
  }

  /**
   * Navigate to previous general item
   */
  function previousGeneralItem() {
    generalCounter--;
    if (!cachedElements.generalElement) initCachedElements();
    if (!cachedElements.generalElement) return;

    if (generalCounter >= 1) {
      currentGeneral = generalCounter;
    } else {
      currentGeneral = generalCounter = maxGeneral;
    }

    // Use requestAnimationFrame for smooth updates
    Utils.requestAnimFrame(() => {
      updateImageElement(
        cachedElements.generalElement,
        generalItems[currentGeneral - 1]
      );
    });
  }

  /**
   * Start the gallery - show first items
   */
  function start() {
    nextDesignItem();
    nextGeneralItem();
  }

  /**
   * Initialize and start the gallery (modern async version)
   */
  async function initAndStart() {
    await init();
    start();
  }

  // Public API
  return {
    init: init,
    initLegacy: initLegacy,
    initAndStart: initAndStart,
    start: start,
    nextDesignItem: nextDesignItem,
    previousDesignItem: previousDesignItem,
    nextGeneralItem: nextGeneralItem,
    previousGeneralItem: previousGeneralItem,
  };
})();

// Initialize gallery using modern async pattern
(async function () {
  try {
    await WebsiteGallery.init();
  } catch (error) {
    console.error("Gallery initialization failed, using legacy fallback");
    WebsiteGallery.initLegacy();
  }
})();

// Start on window load
window.addEventListener("load", function () {
  WebsiteGallery.start();
});

// Expose functions globally for onclick handlers (backward compatibility)
window.dPromeniNaDesno = WebsiteGallery.nextDesignItem;
window.dPromeniNaLevo = WebsiteGallery.previousDesignItem;
window.oPromeniNaDesno = WebsiteGallery.nextGeneralItem;
window.oPromeniNaLevo = WebsiteGallery.previousGeneralItem;
