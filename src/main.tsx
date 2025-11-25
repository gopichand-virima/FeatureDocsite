
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getAvailablePaths } from "./content/contentLoader";

// Handle redirect from 404.html for GitHub Pages
// This ensures React Router can handle the deep URL
// This MUST run synchronously before React renders to ensure correct URL is available
(function() {
  if (sessionStorage.redirect) {
    try {
      const redirectUrl = new URL(sessionStorage.redirect);
      const redirectPath = redirectUrl.pathname;
      // Update the browser URL to the original path (without triggering a reload)
      // This allows React Router to handle the route correctly
      if (window.location.pathname !== redirectPath) {
        window.history.replaceState(null, '', redirectPath + redirectUrl.search + redirectUrl.hash);
      }
      // Clear the redirect flag after using it
      delete sessionStorage.redirect;
    } catch (e) {
      // If URL parsing fails, just clear the redirect
      console.warn('Failed to handle redirect:', e);
      delete sessionStorage.redirect;
    }
  }
  
  // Verify content is loaded on app initialization
  const availablePaths = getAvailablePaths();
  console.log(`[App Init] Content paths available: ${availablePaths.length}`);
  if (availablePaths.length === 0) {
    console.error('[App Init] CRITICAL: No content paths available! Content may not be loading correctly.');
  }
})();

createRoot(document.getElementById("root")!).render(
  <App />
);
  