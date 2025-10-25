/**
 * WebP Performance Monitoring System
 * Tracks Core Web Vitals, file size savings, bandwidth usage, and WebP optimization metrics
 */

class WebPPerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      enableCoreWebVitals: true,
      enableFileSizeTracking: true,
      enableBandwidthMonitoring: true,
      enableErrorTracking: true,
      enableRealUserMetrics: true,
      reportingInterval: 30000, // 30 seconds
      maxReports: 100,
      ...options,
    };

    this.metrics = {
      // Core Web Vitals
      coreWebVitals: {
        lcp: { values: [], current: null },
        fid: { values: [], current: null },
        cls: { values: [], current: null },
        fcp: { values: [], current: null },
        ttfb: { values: [], current: null },
      },

      // WebP Optimization Metrics
      webpOptimization: {
        totalImages: 0,
        webpSupported: null,
        webpLoaded: 0,
        fallbackLoaded: 0,
        loadErrors: 0,
        totalBandwidthSaved: 0,
        averageLoadTime: 0,
        loadTimes: [],
      },

      // File Size Tracking
      fileSizes: {
        originalTotal: 0,
        optimizedTotal: 0,
        savings: 0,
        savingsPercentage: 0,
      },

      // Network Performance
      network: {
        connectionType: null,
        effectiveType: null,
        downlink: null,
        rtt: null,
        saveData: false,
      },

      // Error Tracking
      errors: {
        webpLoadFailures: [],
        fallbackFailures: [],
        totalErrors: 0,
      },

      // Real User Metrics
      userMetrics: {
        sessionStart: Date.now(),
        pageViews: 0,
        interactions: 0,
        bounceRate: 0,
      },
    };

    this.observers = new Map();
    this.reportingTimer = null;
    this.isInitialized = false;

    this.init();
  }

  /**
   * Initialize the performance monitoring system
   */
  async init() {
    console.log("[WebP Performance Monitor] Initializing...");

    try {
      // Initialize Core Web Vitals monitoring
      if (this.options.enableCoreWebVitals) {
        await this.initCoreWebVitals();
      }

      // Initialize file size tracking
      if (this.options.enableFileSizeTracking) {
        this.initFileSizeTracking();
      }

      // Initialize bandwidth monitoring
      if (this.options.enableBandwidthMonitoring) {
        this.initBandwidthMonitoring();
      }

      // Initialize error tracking
      if (this.options.enableErrorTracking) {
        this.initErrorTracking();
      }

      // Initialize network information
      this.initNetworkInfo();

      // Start periodic reporting
      this.startPeriodicReporting();

      this.isInitialized = true;
      console.log("[WebP Performance Monitor] Initialized successfully");

      // Dispatch initialization event
      window.dispatchEvent(
        new CustomEvent("webpPerformanceMonitorReady", {
          detail: { monitor: this },
        })
      );
    } catch (error) {
      console.error("[WebP Performance Monitor] Initialization failed:", error);
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  async initCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          this.metrics.coreWebVitals.lcp.current = lastEntry.startTime;
          this.metrics.coreWebVitals.lcp.values.push({
            value: lastEntry.startTime,
            timestamp: Date.now(),
            element: lastEntry.element?.tagName || "unknown",
          });

          console.log(
            `[WebP Performance Monitor] LCP: ${lastEntry.startTime.toFixed(
              2
            )}ms`
          );
        });

        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.set("lcp", lcpObserver);
      } catch (error) {
        console.warn("[WebP Performance Monitor] LCP observer failed:", error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.coreWebVitals.fid.current =
              entry.processingStart - entry.startTime;
            this.metrics.coreWebVitals.fid.values.push({
              value: entry.processingStart - entry.startTime,
              timestamp: Date.now(),
              eventType: entry.name,
            });

            console.log(
              `[WebP Performance Monitor] FID: ${(
                entry.processingStart - entry.startTime
              ).toFixed(2)}ms`
            );
          });
        });

        fidObserver.observe({ entryTypes: ["first-input"] });
        this.observers.set("fid", fidObserver);
      } catch (error) {
        console.warn("[WebP Performance Monitor] FID observer failed:", error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();

          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          this.metrics.coreWebVitals.cls.current = clsValue;
          this.metrics.coreWebVitals.cls.values.push({
            value: clsValue,
            timestamp: Date.now(),
            entries: entries.length,
          });

          console.log(`[WebP Performance Monitor] CLS: ${clsValue.toFixed(4)}`);
        });

        clsObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.set("cls", clsObserver);
      } catch (error) {
        console.warn("[WebP Performance Monitor] CLS observer failed:", error);
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === "first-contentful-paint") {
              this.metrics.coreWebVitals.fcp.current = entry.startTime;
              this.metrics.coreWebVitals.fcp.values.push({
                value: entry.startTime,
                timestamp: Date.now(),
              });

              console.log(
                `[WebP Performance Monitor] FCP: ${entry.startTime.toFixed(
                  2
                )}ms`
              );
            }
          });
        });

        fcpObserver.observe({ entryTypes: ["paint"] });
        this.observers.set("fcp", fcpObserver);
      } catch (error) {
        console.warn("[WebP Performance Monitor] FCP observer failed:", error);
      }
    }

    // Time to First Byte (TTFB)
    if (performance.timing) {
      const ttfb =
        performance.timing.responseStart - performance.timing.requestStart;
      this.metrics.coreWebVitals.ttfb.current = ttfb;
      this.metrics.coreWebVitals.ttfb.values.push({
        value: ttfb,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Initialize file size tracking
   */
  initFileSizeTracking() {
    // Define expected file sizes (in KB) for comparison
    const expectedFileSizes = {
      // Hero image
      "sasa.jpg": 150,
      "sasa.webp": 100,
      "sasa-mobile.webp": 50,

      // Technology icons
      "java.png": 6.54,
      "java.webp": 3.96,
      "java-mobile.webp": 1.25,
      "csharp.png": 4.6,
      "csharp.webp": 3.62,
      "csharp-mobile.webp": 1.17,
      "cplusplus.png": 25.44,
      "cplusplus.webp": 3.19,
      "cplusplus-mobile.webp": 1.33,
      "hcq.png": 8.52,
      "hcq.webp": 7.39,
      "hcq-mobile.webp": 1.63,
      "sqlvbnet.png": 60.22,
      "sqlvbnet.webp": 8.36,
      "sqlvbnet-mobile.webp": 1.57,

      // Decorative images
      "fg_charisma.jpg": 4.35,
      "fg_charisma.webp": 2.6,
      "fg_perception.jpg": 5.1,
      "fg_perception.webp": 3.1,
      "fg_strength.jpg": 5.89,
      "fg_strength.webp": 3.5,
      "git.png": 7.75,
      "git.webp": 4.7,
      "bachelorhat.png": 50.88,
      "bachelorhat.webp": 30.5,
    };

    // Calculate total expected savings
    let originalTotal = 0;
    let optimizedTotal = 0;

    Object.entries(expectedFileSizes).forEach(([filename, size]) => {
      if (filename.includes(".webp")) {
        optimizedTotal += size;
      } else {
        originalTotal += size;
      }
    });

    this.metrics.fileSizes.originalTotal = originalTotal;
    this.metrics.fileSizes.optimizedTotal = optimizedTotal;
    this.metrics.fileSizes.savings = originalTotal - optimizedTotal;
    this.metrics.fileSizes.savingsPercentage =
      ((originalTotal - optimizedTotal) / originalTotal) * 100;

    console.log(
      `[WebP Performance Monitor] Expected bandwidth savings: ${this.metrics.fileSizes.savings.toFixed(
        2
      )}KB (${this.metrics.fileSizes.savingsPercentage.toFixed(1)}%)`
    );
  }

  /**
   * Initialize bandwidth monitoring
   */
  initBandwidthMonitoring() {
    // Monitor resource loading
    if ("PerformanceObserver" in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          entries.forEach((entry) => {
            if (
              entry.initiatorType === "img" ||
              entry.name.includes(".webp") ||
              entry.name.includes(".png") ||
              entry.name.includes(".jpg")
            ) {
              this.trackImageLoad(entry);
            }
          });
        });

        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.set("resource", resourceObserver);
      } catch (error) {
        console.warn(
          "[WebP Performance Monitor] Resource observer failed:",
          error
        );
      }
    }
  }

  /**
   * Track individual image load performance
   */
  trackImageLoad(entry) {
    const isWebP = entry.name.includes(".webp");
    const loadTime = entry.responseEnd - entry.startTime;
    const transferSize = entry.transferSize || 0;

    this.metrics.webpOptimization.totalImages++;
    this.metrics.webpOptimization.loadTimes.push(loadTime);

    if (isWebP) {
      this.metrics.webpOptimization.webpLoaded++;
    } else {
      this.metrics.webpOptimization.fallbackLoaded++;
    }

    // Calculate average load time
    const totalLoadTime = this.metrics.webpOptimization.loadTimes.reduce(
      (sum, time) => sum + time,
      0
    );
    this.metrics.webpOptimization.averageLoadTime =
      totalLoadTime / this.metrics.webpOptimization.loadTimes.length;

    // Estimate bandwidth saved (rough calculation)
    if (isWebP && transferSize > 0) {
      const estimatedOriginalSize = transferSize * 1.4; // Assume 40% savings
      this.metrics.webpOptimization.totalBandwidthSaved +=
        estimatedOriginalSize - transferSize;
    }

    console.log(
      `[WebP Performance Monitor] Image loaded: ${entry.name
        .split("/")
        .pop()} (${loadTime.toFixed(2)}ms, ${(transferSize / 1024).toFixed(
        2
      )}KB)`
    );
  }

  /**
   * Initialize error tracking
   */
  initErrorTracking() {
    // Listen for image load errors
    document.addEventListener(
      "error",
      (event) => {
        if (event.target.tagName === "IMG") {
          this.trackImageError(event.target);
        }
      },
      true
    );

    // Listen for custom lazy load errors
    document.addEventListener("lazyLoadError", (event) => {
      this.trackLazyLoadError(event.detail);
    });

    // Listen for general JavaScript errors
    window.addEventListener("error", (event) => {
      if (
        event.filename &&
        (event.filename.includes("webp") || event.message.includes("webp"))
      ) {
        this.trackWebPError(event);
      }
    });
  }

  /**
   * Track image loading errors
   */
  trackImageError(img) {
    const isWebP = img.src.includes(".webp");
    const error = {
      src: img.src,
      alt: img.alt,
      isWebP: isWebP,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    if (isWebP) {
      this.metrics.errors.webpLoadFailures.push(error);
    } else {
      this.metrics.errors.fallbackFailures.push(error);
    }

    this.metrics.errors.totalErrors++;
    this.metrics.webpOptimization.loadErrors++;

    console.error(`[WebP Performance Monitor] Image load error:`, error);
  }

  /**
   * Track lazy loading errors
   */
  trackLazyLoadError(detail) {
    const error = {
      ...detail,
      timestamp: Date.now(),
      type: "lazy-load-error",
    };

    this.metrics.errors.webpLoadFailures.push(error);
    this.metrics.errors.totalErrors++;

    console.error(`[WebP Performance Monitor] Lazy load error:`, error);
  }

  /**
   * Track WebP-related JavaScript errors
   */
  trackWebPError(event) {
    const error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now(),
      type: "webp-js-error",
    };

    this.metrics.errors.webpLoadFailures.push(error);
    this.metrics.errors.totalErrors++;

    console.error(`[WebP Performance Monitor] WebP JS error:`, error);
  }

  /**
   * Initialize network information
   */
  initNetworkInfo() {
    if ("connection" in navigator) {
      const connection = navigator.connection;

      this.metrics.network = {
        connectionType: connection.type || "unknown",
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };

      // Listen for network changes
      connection.addEventListener("change", () => {
        this.metrics.network = {
          connectionType: connection.type || "unknown",
          effectiveType: connection.effectiveType || "unknown",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        };

        console.log(
          "[WebP Performance Monitor] Network changed:",
          this.metrics.network
        );
      });
    }
  }

  /**
   * Start periodic reporting
   */
  startPeriodicReporting() {
    if (this.options.reportingInterval > 0) {
      this.reportingTimer = setInterval(() => {
        this.generateReport();
      }, this.options.reportingInterval);
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      session: {
        duration: Date.now() - this.metrics.userMetrics.sessionStart,
        pageViews: this.metrics.userMetrics.pageViews,
        interactions: this.metrics.userMetrics.interactions,
      },
      coreWebVitals: {
        lcp: this.metrics.coreWebVitals.lcp.current,
        fid: this.metrics.coreWebVitals.fid.current,
        cls: this.metrics.coreWebVitals.cls.current,
        fcp: this.metrics.coreWebVitals.fcp.current,
        ttfb: this.metrics.coreWebVitals.ttfb.current,
      },
      webpOptimization: {
        ...this.metrics.webpOptimization,
        webpUsageRate:
          (this.metrics.webpOptimization.webpLoaded /
            (this.metrics.webpOptimization.webpLoaded +
              this.metrics.webpOptimization.fallbackLoaded)) *
          100,
        errorRate:
          (this.metrics.webpOptimization.loadErrors /
            this.metrics.webpOptimization.totalImages) *
          100,
      },
      fileSizes: this.metrics.fileSizes,
      network: this.metrics.network,
      errors: {
        totalErrors: this.metrics.errors.totalErrors,
        webpFailures: this.metrics.errors.webpLoadFailures.length,
        fallbackFailures: this.metrics.errors.fallbackFailures.length,
      },
      performance: {
        navigationTiming: performance.timing
          ? {
              domContentLoaded:
                performance.timing.domContentLoadedEventEnd -
                performance.timing.navigationStart,
              loadComplete:
                performance.timing.loadEventEnd -
                performance.timing.navigationStart,
              firstByte:
                performance.timing.responseStart -
                performance.timing.navigationStart,
            }
          : null,
        memory: performance.memory
          ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            }
          : null,
      },
    };

    // Store report
    this.storeReport(report);

    // Log summary
    console.log("[WebP Performance Monitor] Performance Report:", {
      LCP: report.coreWebVitals.lcp
        ? `${report.coreWebVitals.lcp.toFixed(2)}ms`
        : "N/A",
      CLS: report.coreWebVitals.cls
        ? report.coreWebVitals.cls.toFixed(4)
        : "N/A",
      WebPUsage: `${report.webpOptimization.webpUsageRate.toFixed(1)}%`,
      BandwidthSaved: `${report.webpOptimization.totalBandwidthSaved.toFixed(
        2
      )}KB`,
      ErrorRate: `${report.webpOptimization.errorRate.toFixed(1)}%`,
    });

    return report;
  }

  /**
   * Store performance report
   */
  storeReport(report) {
    try {
      const reports = JSON.parse(
        localStorage.getItem("webpPerformanceReports") || "[]"
      );
      reports.push(report);

      // Keep only the latest reports
      if (reports.length > this.options.maxReports) {
        reports.splice(0, reports.length - this.options.maxReports);
      }

      localStorage.setItem("webpPerformanceReports", JSON.stringify(reports));
    } catch (error) {
      console.warn("[WebP Performance Monitor] Failed to store report:", error);
    }
  }

  /**
   * Get stored performance reports
   */
  getStoredReports() {
    try {
      return JSON.parse(localStorage.getItem("webpPerformanceReports") || "[]");
    } catch (error) {
      console.warn(
        "[WebP Performance Monitor] Failed to retrieve reports:",
        error
      );
      return [];
    }
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const reports = this.getStoredReports();
    if (reports.length === 0) return null;

    const latest = reports[reports.length - 1];
    const summary = {
      coreWebVitals: {
        lcp: {
          value: latest.coreWebVitals.lcp,
          rating: this.rateLCP(latest.coreWebVitals.lcp),
        },
        fid: {
          value: latest.coreWebVitals.fid,
          rating: this.rateFID(latest.coreWebVitals.fid),
        },
        cls: {
          value: latest.coreWebVitals.cls,
          rating: this.rateCLS(latest.coreWebVitals.cls),
        },
      },
      webpOptimization: {
        usage: latest.webpOptimization.webpUsageRate,
        bandwidthSaved: latest.webpOptimization.totalBandwidthSaved,
        errorRate: latest.webpOptimization.errorRate,
        averageLoadTime: latest.webpOptimization.averageLoadTime,
      },
      overallRating: this.calculateOverallRating(latest),
    };

    return summary;
  }

  /**
   * Rate Core Web Vitals metrics
   */
  rateLCP(lcp) {
    if (!lcp) return "unknown";
    if (lcp <= 2500) return "good";
    if (lcp <= 4000) return "needs-improvement";
    return "poor";
  }

  rateFID(fid) {
    if (!fid) return "unknown";
    if (fid <= 100) return "good";
    if (fid <= 300) return "needs-improvement";
    return "poor";
  }

  rateCLS(cls) {
    if (cls === null || cls === undefined) return "unknown";
    if (cls <= 0.1) return "good";
    if (cls <= 0.25) return "needs-improvement";
    return "poor";
  }

  /**
   * Calculate overall performance rating
   */
  calculateOverallRating(report) {
    const ratings = [
      this.rateLCP(report.coreWebVitals.lcp),
      this.rateFID(report.coreWebVitals.fid),
      this.rateCLS(report.coreWebVitals.cls),
    ].filter((rating) => rating !== "unknown");

    if (ratings.length === 0) return "unknown";

    const goodCount = ratings.filter((r) => r === "good").length;
    const poorCount = ratings.filter((r) => r === "poor").length;

    if (goodCount === ratings.length) return "excellent";
    if (poorCount === 0) return "good";
    if (poorCount <= ratings.length / 2) return "needs-improvement";
    return "poor";
  }

  /**
   * Export performance data
   */
  exportData() {
    const data = {
      currentMetrics: this.getCurrentMetrics(),
      storedReports: this.getStoredReports(),
      summary: this.getPerformanceSummary(),
      exportTimestamp: new Date().toISOString(),
    };

    return data;
  }

  /**
   * Clear stored data
   */
  clearData() {
    localStorage.removeItem("webpPerformanceReports");
    console.log("[WebP Performance Monitor] Data cleared");
  }

  /**
   * Destroy the monitor and clean up
   */
  destroy() {
    // Clear observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();

    // Clear reporting timer
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }

    console.log("[WebP Performance Monitor] Destroyed");
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize performance monitor
  window.webpPerformanceMonitor = new WebPPerformanceMonitor({
    enableCoreWebVitals: true,
    enableFileSizeTracking: true,
    enableBandwidthMonitoring: true,
    enableErrorTracking: true,
    enableRealUserMetrics: true,
    reportingInterval: 30000, // Report every 30 seconds
    maxReports: 50,
  });

  // Expose global functions for debugging
  window.getWebPPerformanceReport = () => {
    return window.webpPerformanceMonitor.generateReport();
  };

  window.getWebPPerformanceSummary = () => {
    return window.webpPerformanceMonitor.getPerformanceSummary();
  };

  window.exportWebPPerformanceData = () => {
    return window.webpPerformanceMonitor.exportData();
  };
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = WebPPerformanceMonitor;
}
