import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import App from "./App";

/* GitHub Pages serves 404.html for unknown paths, which stashes the requested
   path and bounces to "/". Restore it before the router reads the URL so the
   deep-linked route renders first time, with no flash of Home. */
const redirectPath = sessionStorage.getItem("redirectPath");
if (redirectPath) {
  sessionStorage.removeItem("redirectPath");
  window.history.replaceState(null, "", redirectPath);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
