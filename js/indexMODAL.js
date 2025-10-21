/**
 * Project Modal Manager
 * Handles project modal display and navigation
 * Uses module pattern to avoid global pollution
 */
const ProjectModal = (function () {
  // Private variables
  let projectsData = null;
  let slideIndex = 1;

  // Cache DOM elements for better performance
  let cachedElements = {
    modal: null,
    modalContent: null,
    captionText: null,
  };

  /**
   * Initialize cached elements
   */
  function initCachedElements() {
    cachedElements.modal = document.getElementById("myModal");
    cachedElements.modalContent = document.getElementById("dintekst");
    cachedElements.captionText = document.getElementById("caption");
  }

  /**
   * Open the modal
   */
  function openModal() {
    if (!cachedElements.modal) initCachedElements();
    if (cachedElements.modal) {
      cachedElements.modal.style.display = "block";
    }
  }

  /**
   * Close the modal
   */
  function closeModal() {
    if (!cachedElements.modal) initCachedElements();
    if (cachedElements.modal) {
      cachedElements.modal.style.display = "none";
    }
  }

  /**
   * Navigate slides by n positions
   * @param {number} n - Number of positions to move (positive or negative)
   */
  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  /**
   * Jump to specific slide
   * @param {number} n - Slide number to show
   */
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  /**
   * Display the specified slide
   * @param {number} n - Slide number to display
   */
  function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");

    if (slides.length === 0) return;

    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    // Use requestAnimationFrame for smooth transitions
    Utils.requestAnimFrame(() => {
      // Hide all slides
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      // Show current slide
      if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
      }
    });
  }

  /**
   * Initialize projects data
   * @param {Function} callback - Callback function to execute after loading
   */
  function initProjects(callback) {
    // If data already exists, just run callback
    if (projectsData) {
      if (typeof callback === "function") {
        callback();
      }
      return;
    }

    // Load projects data
    Utils.loadJSON("projekti.json", function (response) {
      try {
        projectsData = JSON.parse(response);
        if (typeof callback === "function") {
          callback();
        }
      } catch (error) {
        console.error("Error parsing projects data:", error);
      }
    });
  }

  /**
   * Display project modal for specific type
   * @param {string} type - Project type (e.g., 'xaml', 'jsp')
   */
  function showProject(type) {
    if (!projectsData || !projectsData[type]) {
      console.error("Project type not found:", type);
      return;
    }

    let html = "";
    const project = projectsData[type];

    // Build HTML for each project item
    for (let item in project) {
      const projectItem = project[item];

      html += '<div class="mySlides">';
      html +=
        '<div class="row" id="naslov"><p>' +
        projectItem.imeKoda +
        '</p><span class="close cursor" onclick="ProjectModal.closeModal()">&times;</span></div>';
      html += '<div class="row" id="preglednired">';
      html += '<div class="col-md-7" id="modalkodovi">';

      // Add code sections
      if (projectItem.ceo_kod) {
        for (let codeSection in projectItem.ceo_kod) {
          html += "<div>" + projectItem.ceo_kod[codeSection].ime + "<br>";
          html += projectItem.ceo_kod[codeSection].kod;
          html += "</div>";
        }
      }

      html += "</div>";
      html += '<div class="col-md-5" id="modalslika">';
      html +=
        '<img class="img-responsive" id="slikica" src="' +
        projectItem.slika +
        '" alt="animacija">';
      html += "</div>";
      html += "</div>";
      html += "</div>";
      html +=
        '<a class="prev" onclick="ProjectModal.plusSlides(-1)">&#10094;</a>';
      html +=
        '<a class="next" onclick="ProjectModal.plusSlides(1)">&#10095;</a>';
    }

    // Insert HTML into modal using cached element
    if (!cachedElements.modalContent) initCachedElements();
    if (cachedElements.modalContent) {
      cachedElements.modalContent.innerHTML = html;
    }
  }

  // Initialize on load
  showSlides(slideIndex);

  // Public API
  return {
    openModal: openModal,
    closeModal: closeModal,
    plusSlides: plusSlides,
    currentSlide: currentSlide,
    showSlides: showSlides,
    initProjects: initProjects,
    showProject: showProject,
  };
})();

// Expose globally for backward compatibility with onclick handlers
window.openModal = ProjectModal.openModal;
window.closeModal = ProjectModal.closeModal;
window.plusSlides = ProjectModal.plusSlides;
window.currentSlide = ProjectModal.currentSlide;
window.initProjekti = ProjectModal.initProjects;
window.proj = ProjectModal.showProject;
