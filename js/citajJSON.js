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

  /**
   * Initialize the gallery by loading website data
   */
  function init() {
    Utils.loadJSON("sajtovi.json", function (response) {
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
    const imageElement = document.getElementById("srednjiD");
    if (!imageElement) return;

    if (designCounter <= maxDesign) {
      currentDesign = designCounter;
    } else {
      currentDesign = designCounter = 1;
    }

    updateImageElement(imageElement, designItems[currentDesign - 1]);
  }

  /**
   * Navigate to previous design item
   */
  function previousDesignItem() {
    designCounter--;
    const imageElement = document.getElementById("srednjiD");
    if (!imageElement) return;

    if (designCounter >= 1) {
      currentDesign = designCounter;
    } else {
      currentDesign = designCounter = maxDesign;
    }

    updateImageElement(imageElement, designItems[currentDesign - 1]);
  }

  /**
   * Navigate to next general item
   */
  function nextGeneralItem() {
    generalCounter++;
    const imageElement = document.getElementById("srednjiO");
    if (!imageElement) return;

    if (generalCounter <= maxGeneral) {
      currentGeneral = generalCounter;
    } else {
      currentGeneral = generalCounter = 1;
    }

    updateImageElement(imageElement, generalItems[currentGeneral - 1]);
  }

  /**
   * Navigate to previous general item
   */
  function previousGeneralItem() {
    generalCounter--;
    const imageElement = document.getElementById("srednjiO");
    if (!imageElement) return;

    if (generalCounter >= 1) {
      currentGeneral = generalCounter;
    } else {
      currentGeneral = generalCounter = maxGeneral;
    }

    updateImageElement(imageElement, generalItems[currentGeneral - 1]);
  }

  /**
   * Start the gallery - show first items
   */
  function start() {
    nextDesignItem();
    nextGeneralItem();
  }

  // Public API
  return {
    init: init,
    start: start,
    nextDesignItem: nextDesignItem,
    previousDesignItem: previousDesignItem,
    nextGeneralItem: nextGeneralItem,
    previousGeneralItem: previousGeneralItem,
  };
})();

// Initialize gallery
WebsiteGallery.init();

// Start on window load
window.addEventListener("load", function () {
  WebsiteGallery.start();
});

// Expose functions globally for onclick handlers (backward compatibility)
window.dPromeniNaDesno = WebsiteGallery.nextDesignItem;
window.dPromeniNaLevo = WebsiteGallery.previousDesignItem;
window.oPromeniNaDesno = WebsiteGallery.nextGeneralItem;
window.oPromeniNaLevo = WebsiteGallery.previousGeneralItem;
