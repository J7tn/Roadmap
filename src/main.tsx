import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import './lib/dynamicI18n'; // Initialize dynamic i18n
import SplashScreenService from './services/splashScreenService';

// Temporarily disable Tempo devtools for mobile debugging
// import { TempoDevtools } from "tempo-devtools";
// TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Export splash screen service for use in components
export const splashScreenService = SplashScreenService.getInstance();

// Fallback: hide splash screen after maximum 5 seconds to prevent it from staying forever
setTimeout(() => {
  if (!splashScreenService.isSplashHidden()) {
    console.log('⏰ Fallback: hiding splash screen after timeout');
    splashScreenService.forceHide();
  }
}, 5000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
