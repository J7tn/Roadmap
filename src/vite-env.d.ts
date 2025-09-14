/// <reference types="vite/client" />

declare global {
  interface Window {
    Capacitor?: any;
  }
  
  namespace NodeJS {
    interface Global {
      Capacitor?: any;
    }
  }
}