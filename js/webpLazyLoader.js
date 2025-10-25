/**
 * Enhanced WebP-Aware Lazy Loading System
 * Provides intelligent lazy loading with WebP support detection and error handling
 */

class WebPLazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px",
      threshold: 0.1,
      enableWebPDetection: true,
      enableErrorHandling: true,
      enablePerformanceLogging: false,
      ...options,
    };

    this.webpSupported = null;
    this.observer = null;
    this.loadedImages = new Set();
    this.failedImages = new Set();
    this.performanceMetrics = {
      totalImages: 0,
      webpLoaded: 0,
      fallbackLoaded: 0,
      loadErrors: 0,
      averageLoadTime: 0,
    };

    this.init();
  }

  /**
   * Initialize the lazy loader
   */
  async init() {
    console.log("[WebP Lazy Loader] Initializing...");

    // Detect WebP support
    if (this.options.enableWebPDetection) {
      this.webpSupported = await this.detectWebPSupport();
      console.log(
        `[WebP Lazy Loader] WebP Support: ${this.webpSupported ? "Yes" : "No"}`
      );
    }

    // Create intersection observer
    this.createObserver();

    // Find and observe images
    this.observeImages();

    // Log initialization complete
    console.log(
      `[WebP Lazy Loader] Initialized with ${this.performanceMetrics.totalImages} images`
    );
  }

  /**
   * Detect WebP support using canvas
   */
  detectWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Create intersection observer with enhanced options
   */
  createObserver() {
    if (!("IntersectionObserver" in window)) {
      console.warn(
        "[WebP Lazy Loader] IntersectionObserver not supported, falling back to native lazy loading"
      );
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold,
      }
    );
  }

  /**
   * Find and observe all lazy-loadable images
   */
  observeImages() {
    // Find all images with loading="lazy" attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Also find images within picture elements
    const pictureImages = document.querySelectorAll("picture img");

    // Combine both sets
    const allImages = new Set([...lazyImages, ...pictureImages]);

    allImages.forEach((img) => {
      if (this.observer) {
        // Use intersection observer if available
        this.observer.observe(img);
      } else {
        // Fallback to immediate loading if no observer support
        this.loadImage(img);
      }
      this.performanceMetrics.totalImages++;
    });
  }

  /**
   * Load an image with WebP awareness and error handling
   */
  async loadImage(img) {
    const startTime = performance.now();
    const imgSrc = img.src || img.dataset.src;

    if (this.loadedImages.has(imgSrc)) {
      return; // Already loaded
    }

    try {
      // Check if image is within a picture element
      const picture = img.closest("picture");

      if (picture) {
        await this.loadPictureElement(picture, img);
      } else {
        await this.loadSingleImage(img);
      }

      // Mark as loaded
      this.loadedImages.add(imgSrc);

      // Update performance metrics
      const loadTime = performance.now() - startTime;
      this.updatePerformanceMetrics(loadTime, img);

      // Log successful load
      if (this.options.enablePerformanceLogging) {
        console.log(
          `[WebP Lazy Loader] Loaded: ${imgSrc} (${loadTime.toFixed(2)}ms)`
        );
      }
    } catch (error) {
      this.handleLoadError(img, error);
    }
  }

  /**
   * Load image within picture element with WebP awareness
   */
  async loadPictureElement(picture, img) {
    const sources = picture.querySelectorAll("source");
    let imageLoaded = false;

    // Try WebP sources first if WebP is supported
    if (this.webpSupported) {
      for (const source of sources) {
        if (source.type === "image/webp") {
          try {
            await this.preloadImage(source.srcset);
            this.performanceMetrics.webpLoaded++;
            imageLoaded = true;
            break;
          } catch (error) {
            console.warn(
              `[WebP Lazy Loader] WebP source failed: ${source.srcset}`
            );
            continue;
          }
        }
      }
    }

    // If WebP failed or not supported, use fallback
    if (!imageLoaded) {
      // Browser will automatically select appropriate source
      await this.preloadImage(img.src);
      this.performanceMetrics.fallbackLoaded++;
    }

    // Add loaded class for CSS transitions
    img.classList.add("lazy-loaded");
    picture.classList.add("lazy-loaded");
  }

  /**
   * Load single image (not in picture element)
   */
  async loadSingleImage(img) {
    await this.preloadImage(img.src);
    img.classList.add("lazy-loaded");
    this.performanceMetrics.fallbackLoaded++;
  }

  /**
   * Preload image and return promise
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

      // Set timeout for slow loading images
      setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, 10000); // 10 second timeout

      img.src = src;
    });
  }

  /**
   * Handle image loading errors with fallback strategies
   */
  handleLoadError(img, error) {
    console.error(`[WebP Lazy Loader] Load error:`, error);

    this.failedImages.add(img.src);
    this.performanceMetrics.loadErrors++;

    // Try fallback strategies
    if (this.options.enableErrorHandling) {
      this.tryFallbackStrategies(img);
    }

    // Add error class for CSS styling
    img.classList.add("lazy-error");

    // Dispatch custom event for error handling
    img.dispatchEvent(
      new CustomEvent("lazyLoadError", {
        detail: { error, src: img.src },
      })
    );
  }

  /**
   * Try various fallback strategies for failed images
   */
  async tryFallbackStrategies(img) {
    const originalSrc = img.src;

    // Strategy 1: If WebP failed, try PNG/JPG equivalent
    if (originalSrc.includes(".webp")) {
      const fallbackSrc = originalSrc
        .replace(".webp", ".png")
        .replace(".webp", ".jpg");
      try {
        await this.preloadImage(fallbackSrc);
        img.src = fallbackSrc;
        console.log(`[WebP Lazy Loader] Fallback successful: ${fallbackSrc}`);
        return;
      } catch (fallbackError) {
        console.warn(`[WebP Lazy Loader] Fallback also failed: ${fallbackSrc}`);
      }
    }

    // Strategy 2: Check if image is in a picture element and try other sources
    const picture = img.closest("picture");
    if (picture) {
      const sources = picture.querySelectorAll("source");
      for (const source of sources) {
        if (source.srcset !== originalSrc) {
          try {
            await this.preloadImage(source.srcset);
            img.src = source.srcset;
            console.log(
              `[WebP Lazy Loader] Alternative source successful: ${source.srcset}`
            );
            return;
          } catch (altError) {
            continue;
          }
        }
      }
    }

    // Strategy 3: Show placeholder or hide image
    img.style.display = "none";
    console.warn(
      `[WebP Lazy Loader] All fallback strategies failed for: ${originalSrc}`
    );
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(loadTime, img) {
    const currentAverage = this.performanceMetrics.averageLoadTime;
    const totalLoaded =
      this.performanceMetrics.webpLoaded +
      this.performanceMetrics.fallbackLoaded;

    this.performanceMetrics.averageLoadTime =
      (currentAverage * (totalLoaded - 1) + loadTime) / totalLoaded;
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    const report = {
      ...this.performanceMetrics,
      webpSupportDetected: this.webpSupported,
      successRate:
        (
          ((this.performanceMetrics.totalImages -
            this.performanceMetrics.loadErrors) /
            this.performanceMetrics.totalImages) *
          100
        ).toFixed(2) + "%",
      webpUsageRate:
        (
          (this.performanceMetrics.webpLoaded /
            (this.performanceMetrics.webpLoaded +
              this.performanceMetrics.fallbackLoaded)) *
          100
        ).toFixed(2) + "%",
    };

    console.table(report);
    return report;
  }

  /**
   * Manually trigger loading of remaining images
   */
  loadAllRemaining() {
    const unloadedImages = document.querySelectorAll(
      'img[loading="lazy"]:not(.lazy-loaded)'
    );
    unloadedImages.forEach((img) => this.loadImage(img));
  }

  /**
   * Destroy the lazy loader and clean up
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.loadedImages.clear();
    this.failedImages.clear();
    console.log("[WebP Lazy Loader] Destroyed");
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize with enhanced options for WebP optimization
  window.webpLazyLoader = new WebPLazyLoader({
    rootMargin: "50px", // Load images 50px before they enter viewport
    threshold: 0.1,
    enableWebPDetection: true,
    enableErrorHandling: true,
    enablePerformanceLogging: false, // Set to true for debugging
  });

  // Expose performance report to global scope for debugging
  window.getWebPLazyLoadReport = () => {
    return window.webpLazyLoader.getPerformanceReport();
  };
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = WebPLazyLoader;
}
