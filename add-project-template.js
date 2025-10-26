/**
 * Project Template Generator
 * Use this template to easily add new projects to the dynamic system
 */

// Copy this template and modify the values for your new project
const newProjectTemplate = {
  id: "your-project-id", // Unique identifier (lowercase, hyphens)
  technology: {
    name: "Technology Name", // e.g., 'React', 'Python', 'Node.js'
    icon: "assets/your-tech-icon.png",
    iconWebp: "assets/your-tech-icon.webp", // optional but recommended
    iconMobileWebp: "assets/your-tech-icon-mobile.webp", // optional but recommended
    alt: "Technology description for accessibility",
  },

  // Choose ONE of the following for the media section:

  // Option 1: Video (Vimeo)
  video: {
    vimeoId: "123456789", // Just the number from the Vimeo URL
    title: "Descriptive video title",
  },

  // Option 2: Static Image
  // video: null,
  // staticImage: {
  //   src: 'assets/your-preview-image.jpg',
  //   srcWebp: 'assets/your-preview-image.webp', // optional but recommended
  //   srcMobileWebp: 'assets/your-preview-image-mobile.webp', // optional but recommended
  //   alt: 'Preview image description'
  // },

  github: {
    url: "https://github.com/yourusername/your-repo",
    alt: "View Your Project on GitHub",
    // Add this line for private/disabled repos: onclick: 'return false;'
  },

  screenshots: {
    front: {
      src: "assets/your-front-screenshot.png",
      srcWebp: "assets/your-front-screenshot.webp", // optional but recommended
      srcMobileWebp: "assets/your-front-screenshot-mobile.webp", // optional but recommended
      alt: "Front screenshot description",
      // Add onclick for modal integration: onclick: "initProjects(function() { showProject('your-modal-id');openModal();currentSlide(1) });"
      // Add this for static images without flip: isStatic: true
    },
    back: {
      src: "assets/your-back-screenshot.png",
      srcWebp: "assets/your-back-screenshot.webp", // optional but recommended
      srcMobileWebp: "assets/your-back-screenshot-mobile.webp", // optional but recommended
      alt: "Back screenshot description",
      // Same options as front screenshot
    },
  },
};

/**
 * Steps to add a new project:
 *
 * 1. Copy the template above
 * 2. Modify all the values for your project
 * 3. Prepare your image assets:
 *    - Technology icon (180x180px recommended)
 *    - Screenshots (180x135px recommended)
 *    - Create WebP versions for better performance
 *    - Create mobile versions (smaller file sizes)
 *
 * 4. Open js/projectsData.js
 * 5. Add your project object to the projectsData array
 * 6. Test using test-dynamic-projects.html
 *
 * Image Optimization Tips:
 * - Use WebP format for better compression
 * - Create mobile variants with smaller dimensions
 * - Optimize file sizes while maintaining quality
 * - Use descriptive alt texts for accessibility
 *
 * Modal Integration:
 * - If your project has modal content, add the onclick handler
 * - Make sure the modal content exists in projekti.json
 * - Test the modal functionality after adding
 */

// Example of a complete project entry:
const exampleProject = {
  id: "react-dashboard",
  technology: {
    name: "React",
    icon: "assets/react.png",
    iconWebp: "assets/react.webp",
    iconMobileWebp: "assets/react-mobile.webp",
    alt: "React JavaScript Library - Frontend Development",
  },
  video: {
    vimeoId: "987654321",
    title: "React Dashboard Demo",
  },
  github: {
    url: "https://github.com/yourusername/react-dashboard",
    alt: "View React Dashboard on GitHub",
  },
  screenshots: {
    front: {
      src: "assets/Video/kratki/react/dashboard-main.png",
      srcWebp: "assets/Video/kratki/react/dashboard-main.webp",
      srcMobileWebp: "assets/Video/kratki/react/dashboard-main-mobile.webp",
      alt: "React Dashboard - Main Interface",
      onclick:
        "initProjects(function() { showProject('react');openModal();currentSlide(1) });",
    },
    back: {
      src: "assets/Video/kratki/react/dashboard-charts.png",
      srcWebp: "assets/Video/kratki/react/dashboard-charts.webp",
      srcMobileWebp: "assets/Video/kratki/react/dashboard-charts-mobile.webp",
      alt: "React Dashboard - Charts View",
      onclick:
        "initProjects(function() { showProject('react');openModal();currentSlide(1) });",
    },
  },
};
