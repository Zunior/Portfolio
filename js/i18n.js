let currentTranslations = {};
// This function runs when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  // Find the language toggle checkbox by its ID using cached method
  const langToggle = Utils.getElement("language-toggle");

  // --- Sync Toggle with Saved Language on Page Load ---
  // Check if a language is already saved in local storage
  const savedLang = localStorage.getItem("language") || "sr"; // Default to Serbian

  // Set the initial state of the toggle based on the saved language
  langToggle.checked = savedLang === "sr";

  // Load the content for the initial language
  loadLanguage(savedLang);

  // --- Add Event Listener to Handle Clicks ---
  langToggle.addEventListener("change", () => {
    let lang;
    // Check if the toggle is "on" (checked) or "off"
    if (langToggle.checked) {
      lang = "sr"; // Checked is Serbian
    } else {
      lang = "en"; // Unchecked is English
    }

    // Save the new choice to local storage
    localStorage.setItem("language", lang);

    // Load the new language content
    loadLanguage(lang);
  });
});

/**
 * Fetches the language JSON file and updates the page content.
 * @param {string} lang - The language code (e.g., 'en', 'sr').
 */
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      currentTranslations = data;
      for (const key in data) {
        // Check if the key is for a placeholder
        if (key.endsWith("_placeholder")) {
          // Get the element ID by removing the suffix
          const elementId = key.replace("_placeholder", "");
          const element = Utils.getElement(elementId);

          if (element) {
            // Set the placeholder attribute instead of textContent
            element.placeholder = data[key];
          }
        } else {
          // This is the original logic for all other text elements
          const element = Utils.getElement(key);
          if (element) {
            element.textContent = data[key];
          }
        }
      }
      // Make menu items visible after loading translations
      makeMenuVisible();
    })
    .catch((error) => {
      console.error(`Error loading language file: ${lang}.json`, error);
      // Fallback: show menu items even if translation fails
      makeMenuVisible();
    });
}

/**
 * Makes menu items visible by ensuring span elements are shown
 */
// Cache menu spans for better performance
let cachedMenuSpans = null;

function makeMenuVisible() {
  // Cache menu spans on first call
  if (!cachedMenuSpans) {
    cachedMenuSpans = document.querySelectorAll(".navbar-nav > li > a > span");
  }

  // Use requestAnimationFrame for smooth visibility changes
  Utils.requestAnimFrame(() => {
    cachedMenuSpans.forEach((span) => {
      if (span.style.visibility !== "visible") {
        span.style.visibility = "visible";
      }
    });
  });
}
