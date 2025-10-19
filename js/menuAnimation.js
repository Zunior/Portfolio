/**
 * Menu Animation Module
 * Handles SVG circular text animation on menu item hover
 */
const MenuAnimation = (function () {
  "use strict";

  // Track which menu items are currently animating
  const animatingItems = new Set();

  /**
   * Initialize menu hover animations
   */
  function init() {
    const menuItems = document.querySelectorAll(
      ".navbar-nav > li:nth-child(n + 2):nth-child(-n + 5)"
    );

    menuItems.forEach((menuItem) => {
      const svg = menuItem.querySelector("svg");
      const link = menuItem.querySelector("a");
      const span = link ? link.querySelector("span:first-child") : null;

      if (!svg || !span) return;

      // Add mouseenter event
      menuItem.addEventListener("mouseenter", function () {
        handleMenuHover(menuItem, svg, span);
      });
    });
  }

  /**
   * Handle menu item hover
   * @param {HTMLElement} menuItem - The menu list item
   * @param {SVGElement} svg - The SVG element
   * @param {HTMLElement} span - The span element with menu text
   */
  function handleMenuHover(menuItem, svg, span) {
    // If already animating, do nothing
    if (animatingItems.has(menuItem)) {
      return;
    }

    // Mark as animating
    animatingItems.add(menuItem);

    // Step 1: Hide the span (menu text) IMMEDIATELY
    span.style.visibility = "hidden";
    span.style.display = "none";

    // Step 2: Show the SVG IMMEDIATELY
    svg.style.visibility = "visible";
    svg.style.display = "block";

    // Step 3: Trigger the SVG animation by clicking it
    // The SVG has animate elements with begin="click"
    svg.dispatchEvent(new Event("click"));

    // Step 4: After animation completes (1s animation + 0.15s delay + buffer)
    setTimeout(() => {
      // Hide SVG
      svg.style.visibility = "hidden";
      svg.style.display = "none";

      // Show span
      span.style.visibility = "visible";
      span.style.display = "";

      // Remove from animating set
      animatingItems.delete(menuItem);
    }, 1300); // 1s + 0.15s + 0.15s buffer
  }

  return {
    init: init,
  };
})();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", MenuAnimation.init);
} else {
  MenuAnimation.init();
}
