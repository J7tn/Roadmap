import React, { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useTheme } from '@/contexts/ThemeContext';

const StatusBarComponent: React.FC = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const setStatusBarStyle = async () => {
      try {
        // Check if we're running on a native platform
        if (typeof window !== 'undefined' && window.Capacitor) {
          // Set status bar style based on theme
          await StatusBar.setStyle({ 
            style: isDarkMode ? Style.Dark : Style.Light 
          });
          
          // Set status bar background color
          await StatusBar.setBackgroundColor({ 
            color: isDarkMode ? '#1f2937' : '#ffffff' 
          });
          
          // Force show the status bar
          await StatusBar.show();
          
          console.log('Status bar updated for', isDarkMode ? 'dark' : 'light', 'mode');
        }
      } catch (error) {
        // Silently handle status bar errors (might not be available on web)
        console.log('Status bar not available or failed to update:', error);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(setStatusBarStyle, 100);
    
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  return null; // This component doesn't render anything
};

export default StatusBarComponent;
