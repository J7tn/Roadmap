import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SplashScreen } from '@capacitor/splash-screen';

// Temporarily disable Tempo devtools for mobile debugging
// import { TempoDevtools } from "tempo-devtools";
// TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Hide splash screen when app is ready
const hideSplashScreen = async () => {
  try {
    await SplashScreen.hide();
  } catch (error) {
    // Silently handle splash screen errors
  }
};

// Hide splash screen after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideSplashScreen, 500);
});

// Also try hiding after a longer delay as fallback
setTimeout(hideSplashScreen, 2000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
