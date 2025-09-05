import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that automatically scrolls to the top of the page
 * whenever the route changes
 */
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
