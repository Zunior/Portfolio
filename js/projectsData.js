/**
 * Projects Data Manager
 * Contains all project information and handles dynamic project list generation
 */
const ProjectsData = (function () {
  // Project data array - each object represents one project
  const projectsData = [
    {
      id: "csharp-news",
      technology: {
        name: "C#",
        icon: "assets/csharp.png",
        iconWebp: "assets/csharp.webp",
        iconMobileWebp: "assets/csharp-mobile.webp",
        alt: "C# Programming Language - Desktop Application Development",
      },
      video: {
        vimeoId: "198974802",
        title: "C# News Application Demo",
      },
      github: {
        url: "https://github.com/Zunior/WinApp_Vesti/",
        alt: "View C# News Application on GitHub",
      },
      screenshots: {
        front: {
          src: "assets/Video/kratki/vesti/csharpcode.png",
          srcWebp: "assets/Video/kratki/vesti/csharpcode.webp",
          srcMobileWebp: "assets/Video/kratki/vesti/csharpcode-mobile.webp",
          alt: "C# News Application - Source Code Preview",
          onclick:
            "initProjects(function() { showProject('xaml');openModal();currentSlide(1) });",
        },
        back: {
          src: "assets/Video/kratki/vesti/vesti.png",
          srcWebp: "assets/Video/kratki/vesti/vesti.webp",
          srcMobileWebp: "assets/Video/kratki/vesti/vesti-mobile.webp",
          alt: "C# News Application - User Interface Preview",
          onclick:
            "initProjects(function() { showProject('xaml');openModal();currentSlide(1) });",
        },
      },
    },
    {
      id: "sql-vbnet",
      technology: {
        name: "SQL & VB.NET",
        icon: "assets/sqlvbnet.png",
        iconWebp: "assets/sqlvbnet.webp",
        iconMobileWebp: "assets/sqlvbnet-mobile.webp",
        alt: "SQL Server and VB.NET - Database Development",
      },
      video: null, // No video for this project
      staticImage: {
        src: "assets/razno.jpg",
        alt: "Mixed Projects Presentation - Various Technologies",
      },
      github: {
        url: "#",
        alt: "GitHub Repository (Private Project)",
        onclick: "return false;",
      },
      screenshots: {
        front: {
          src: "assets/npslika.jpg",
          alt: "Animacija teksta",
          isStatic: true, // No flip animation
        },
        back: {
          src: "assets/npslika.jpg",
          alt: "Animacija teksta",
          isStatic: true,
        },
      },
    },
    {
      id: "cpp-millionaire",
      technology: {
        name: "C++",
        icon: "assets/cplusplus.png",
        iconWebp: "assets/cplusplus.webp",
        iconMobileWebp: "assets/cplusplus-mobile.webp",
        alt: "C++ Programming Language - System Programming",
      },
      video: {
        vimeoId: "219826438",
        title: "C++ Millionaire Game Demo",
      },
      github: {
        url: "https://github.com/Zunior/Milioner",
        alt: "View C++ Millionaire Game on GitHub",
      },
      screenshots: {
        front: {
          src: "assets/Video/kratki/milioner/pocetna.png",
          srcWebp: "assets/Video/kratki/milioner/pocetna.webp",
          srcMobileWebp: "assets/Video/kratki/milioner/pocetna-mobile.webp",
          alt: "C++ Millionaire Game - Main Menu Preview",
        },
        back: {
          src: "assets/Video/kratki/milioner/krajnja.png",
          srcWebp: "assets/Video/kratki/milioner/krajnja.webp",
          srcMobileWebp: "assets/Video/kratki/milioner/krajnja-mobile.webp",
          alt: "C++ Millionaire Game - Final Screen Preview",
        },
      },
    },
    {
      id: "java-healthcare",
      technology: {
        name: "Java",
        icon: "assets/java.png",
        iconWebp: "assets/java.webp",
        iconMobileWebp: "assets/java-mobile.webp",
        alt: "Java Programming Language - Enterprise Backend Development",
      },
      video: {
        vimeoId: "209355763",
        title: "Java Healthcare System Demo",
      },
      github: {
        url: "https://github.com/Zunior/Zdravstvo",
        alt: "View Java Healthcare System on GitHub",
      },
      screenshots: {
        front: {
          src: "assets/Video/kratki/zdravstvo/javacode.png",
          srcWebp: "assets/Video/kratki/zdravstvo/javacode.webp",
          srcMobileWebp: "assets/Video/kratki/zdravstvo/javacode-mobile.webp",
          alt: "Java Healthcare System - Source Code Preview",
          onclick:
            "initProjects(function() { showProject('jsp');openModal();currentSlide(1) });",
        },
        back: {
          src: "assets/Video/kratki/zdravstvo/login.png",
          srcWebp: "assets/Video/kratki/zdravstvo/login.webp",
          srcMobileWebp: "assets/Video/kratki/zdravstvo/login-mobile.webp",
          alt: "Java Healthcare System - Login Interface Preview",
          onclick:
            "initProjects(function() { showProject('jsp');openModal();currentSlide(1) });",
        },
      },
    },
    {
      id: "html5-portfolio",
      technology: {
        name: "HTML5, CSS3, jQuery",
        icon: "assets/hcq.png",
        iconWebp: "assets/hcq.webp",
        iconMobileWebp: "assets/hcq-mobile.webp",
        alt: "HTML5, CSS3, and jQuery - Frontend Web Development",
      },
      video: null,
      staticImage: {
        src: "assets/Video/kratki/HTML/glavnazavideo.png",
        srcWebp: "assets/Video/kratki/HTML/glavnazavideo.webp",
        srcMobileWebp: "assets/Video/kratki/HTML/glavnazavideo-mobile.webp",
        alt: "HTML5 Portfolio Website - Homepage Preview",
      },
      github: {
        url: "https://github.com/Zunior/Portfolio",
        alt: "View on GitHub",
      },
      screenshots: {
        front: {
          src: "assets/Video/kratki/HTML/pocetna.png",
          srcWebp: "assets/Video/kratki/HTML/pocetna.webp",
          srcMobileWebp: "assets/Video/kratki/HTML/pocetna-mobile.webp",
          alt: "HTML5 Portfolio Website - Start Screen Preview",
          isStatic: true,
        },
        back: {
          src: "assets/Video/kratki/HTML/krajnja.png",
          srcWebp: "assets/Video/kratki/HTML/krajnja.webp",
          srcMobileWebp: "assets/Video/kratki/HTML/krajnja-mobile.webp",
          alt: "HTML5 Portfolio Website - Final Screen Preview",
          isStatic: true,
        },
      },
    },
    {
      id: "new-project",
      technology: {
        name: "New Project",
        icon: "assets/newproject.jpg",
        alt: "New Technology Project",
      },
      video: null,
      staticImage: {
        src: "assets/razno.jpg",
        alt: "Project Preview",
      },
      github: {
        url: "https://github.com/Zunior",
        alt: "View on GitHub",
      },
      screenshots: {
        front: {
          src: "assets/npslika.jpg",
          alt: "Animacija teksta",
          isStatic: true,
        },
        back: {
          src: "assets/npslika.jpg",
          alt: "Animacija teksta",
          isStatic: true,
        },
      },
    },
  ];

  /**
   * Generate picture element with WebP support and responsive images
   */
  function generatePictureElement(
    imageData,
    className = "",
    additionalAttributes = ""
  ) {
    if (!imageData) return "";

    const {
      src,
      srcWebp,
      srcMobileWebp,
      alt,
      onclick = "",
      width = "180",
      height = "135",
    } = imageData;

    let pictureHTML = "<picture>";

    // Mobile WebP source
    if (srcMobileWebp) {
      pictureHTML += `
        <source media="(max-width: 767px)" srcset="${srcMobileWebp}" type="image/webp">`;
    }

    // Mobile fallback
    if (srcMobileWebp) {
      pictureHTML += `
        <source media="(max-width: 767px)" srcset="${src}">`;
    }

    // Desktop WebP source
    if (srcWebp) {
      pictureHTML += `
        <source srcset="${srcWebp}" type="image/webp">`;
    }

    // Default image with all attributes
    const onclickAttr = onclick ? `onclick="${onclick}"` : "";
    pictureHTML += `
      <img class="${className}" loading="lazy" src="${src}" alt="${alt}" 
           width="${width}" height="${height}" ${onclickAttr} ${additionalAttributes} />
    </picture>`;

    return pictureHTML;
  }

  /**
   * Generate technology icon picture element
   */
  function generateTechnologyIcon(technology) {
    return generatePictureElement(
      {
        src: technology.icon,
        srcWebp: technology.iconWebp,
        srcMobileWebp: technology.iconMobileWebp,
        alt: technology.alt,
      },
      "tehnologija",
      'width="180" height="180"'
    );
  }

  /**
   * Generate video iframe or static image
   */
  function generateMediaElement(project) {
    if (project.video) {
      return `<iframe src="https://player.vimeo.com/video/${project.video.vimeoId}" 
                      height="120" width="220" frameborder="0" 
                      webkitallowfullscreen mozallowfullscreen allowfullscreen
                      title="${project.video.title}"></iframe>`;
    } else if (project.staticImage) {
      // Check if it has WebP versions
      if (project.staticImage.srcWebp) {
        return generatePictureElement(
          project.staticImage,
          "project-screenshot hover-shadow cursor"
        );
      } else {
        return `<img class="project-screenshot hover-shadow cursor" loading="lazy"
                     src="${project.staticImage.src}" alt="${project.staticImage.alt}"
                     width="180" height="135" />`;
      }
    }
    return "";
  }

  /**
   * Generate GitHub link
   */
  function generateGithubLink(github) {
    const onclickAttr = github.onclick ? `onclick="${github.onclick}"` : "";
    return `
      <a href="${github.url}" target="_blank" rel="noopener noreferrer" ${onclickAttr}>
        <picture>
          <source srcset="assets/git.webp" type="image/webp">
          <img class="github-icon" alt="${github.alt}" loading="lazy" 
               src="assets/git.png" style="height: 100%;" />
        </picture>
      </a>`;
  }

  /**
   * Generate flip container for project screenshots
   */
  function generateFlipContainer(screenshots) {
    if (screenshots.front.isStatic) {
      // Static image without flip animation
      return `
        <div class="flip-container">
          <div class="flipper">
            <div class="front">
              <img id="animimg" loading="lazy" class="tehnologija hover-shadow cursor"
                   style="width: 180px;" src="${screenshots.front.src}"
                   alt="${screenshots.front.alt}" />
            </div>
            <div class="back">
              <img id="animimg" loading="lazy" class="tehnologija hover-shadow cursor"
                   style="width: 180px;" src="${screenshots.back.src}"
                   alt="${screenshots.back.alt}" />
            </div>
          </div>
        </div>`;
    } else {
      // Flip container with picture elements
      return `
        <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
          <div class="flipper">
            <div class="front">
              ${generatePictureElement(
                screenshots.front,
                "project-screenshot hover-shadow cursor"
              )}
            </div>
            <div class="back">
              ${generatePictureElement(
                screenshots.back,
                "project-screenshot hover-shadow cursor"
              )}
            </div>
          </div>
        </div>`;
    }
  }

  /**
   * Generate a single project row HTML
   */
  function generateProjectRow(project) {
    return `
      <div class="row donja_crta">
        <div class="dvojka">
          <div class="redjanje">
            ${generateTechnologyIcon(project.technology)}
          </div>
          <div class="redjanje1">
            ${generateMediaElement(project)}
          </div>
        </div>
        <div class="dvojka">
          <div class="redjanje" id="proba">
            ${generateGithubLink(project.github)}
          </div>
          <div class="redjanje1">
            ${generateFlipContainer(project.screenshots)}
          </div>
        </div>
      </div>`;
  }

  /**
   * Generate all projects HTML
   */
  function generateProjectsHTML() {
    return projectsData.map((project) => generateProjectRow(project)).join("");
  }

  /**
   * Render projects into the container
   */
  function renderProjects() {
    const projectsContainer = document.querySelector("#projekti .social1");
    if (!projectsContainer) {
      console.error("Projects container not found");
      return;
    }

    // Generate and insert the projects HTML
    projectsContainer.innerHTML = generateProjectsHTML();

    console.log("Dynamic projects rendered successfully");
  }

  /**
   * Initialize projects when DOM is ready
   */
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderProjects);
    } else {
      renderProjects();
    }
  }

  // Public API
  return {
    init: init,
    renderProjects: renderProjects,
    getProjectsData: () => projectsData,
    generateProjectsHTML: generateProjectsHTML,
  };
})();

// Auto-initialize when script loads
ProjectsData.init();
