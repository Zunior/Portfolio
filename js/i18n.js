// This function runs when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    // Find the language toggle checkbox by its ID
    const langToggle = document.getElementById('language-toggle');

    // --- Sync Toggle with Saved Language on Page Load ---
    // Check if a language is already saved in local storage
    const savedLang = localStorage.getItem('language') || 'sr'; // Default to Serbian

    // Set the initial state of the toggle based on the saved language
    langToggle.checked = (savedLang === 'sr');

    // Load the content for the initial language
    loadLanguage(savedLang);

    // --- Add Event Listener to Handle Clicks ---
    langToggle.addEventListener('change', () => {
        let lang;
        // Check if the toggle is "on" (checked) or "off"
        if (langToggle.checked) {
            lang = 'sr'; // Checked is Serbian
        } else {
            lang = 'en'; // Unchecked is English
        }

        // Save the new choice to local storage
        localStorage.setItem('language', lang);

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
        .then(response => response.json())
        .then(data => {
            for (const key in data) {
                const element = document.getElementById(key) || document.querySelector(`[data-content-key="${key}"]`) || document.querySelector(`#${key}`);
                if (element) {
                    element.textContent = data[key];
                }
            }
        })
        .catch(error => console.error(`Error loading language file: ${lang}.json`, error));
}