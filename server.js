const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const app = express();
const PORT = 8000;

// Create livereload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "."));

// Add livereload middleware
app.use(connectLivereload());

// Security headers middleware
app.use((req, res, next) => {
  // X-Frame-Options header (proper way to set it)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
});

// Serve static files
app.use(
  express.static(".", {
    // Set proper MIME types for WebP images
    setHeaders: (res, path) => {
      if (path.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      }
    },
  })
);

// Start server
app.listen(PORT, () => {
  console.log("========================================");
  console.log("   Portfolio - Development Server");
  console.log("   with LIVE RELOAD & Security Headers");
  console.log("========================================");
  console.log("");
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log("");
  console.log("Features:");
  console.log("  - Auto-refresh on file changes");
  console.log("  - Proper security headers");
  console.log("  - WebP MIME type support");
  console.log("");
  console.log("Press Ctrl+C to stop the server");
  console.log("========================================");
});

// Refresh browser on file changes
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
