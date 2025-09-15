import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const StatusBarComponent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to update status bar
  const updateStatusBar = useCallback(async () => {
    try {
      // Check if we're running on a native platform
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        console.log('Updating status bar for', isDarkMode ? 'dark' : 'light', 'mode');
        
        // Initial setup
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.show();
        
        // Set status bar style based on theme
        await StatusBar.setStyle({ 
          style: isDarkMode ? Style.Dark : Style.Light 
        });
        
        // Set status bar background color to match app background
        await StatusBar.setBackgroundColor({ 
          color: isDarkMode ? '#000000' : '#ffffff' 
        });
        
        console.log('Status bar successfully updated for', isDarkMode ? 'dark' : 'light', 'mode');
        setIsInitialized(true);
      }
    } catch (error) {
      // Silently handle status bar errors (might not be available on web)
      console.log('Status bar not available or failed to update:', error);
    }
  }, [isDarkMode]);

  // Wait for home page to finish loading before initializing status bar
  useEffect(() => {
    const waitForHomePageLoad = async () => {
      // Only initialize on home page
      if (location.pathname === '/home') {
        console.log('Waiting for home page to finish loading...');
        
        // Wait for the app content to be marked as loaded
        const waitForAppContent = () => {
          return new Promise<void>((resolve) => {
            const checkAppContent = () => {
              const appContent = document.getElementById('app-content');
              if (appContent && appContent.classList.contains('loaded')) {
                console.log('Home page finished loading, initializing status bar');
                resolve();
              } else {
                // Check again in 100ms
                setTimeout(checkAppContent, 100);
              }
            };
            checkAppContent();
          });
        };

        try {
          await waitForAppContent();
          // Add a small delay to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 200));
          await updateStatusBar();
        } catch (error) {
          console.log('Failed to wait for home page load, initializing status bar anyway:', error);
          // Fallback: initialize after a delay
          setTimeout(updateStatusBar, 1000);
        }
      }
    };

    waitForHomePageLoad();
  }, [location.pathname, updateStatusBar]); // Include updateStatusBar in dependencies

  // Update status bar when theme changes (after initial load)
  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(updateStatusBar, 100);
      return () => clearTimeout(timer);
    }
  }, [isDarkMode, isInitialized]);

  return null; // This component doesn't render anything
};

export default StatusBarComponent;
