import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen welcome page before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
      navigate('/home');
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8"
        >
          Welcome to Career Atlas, your comprehensive career exploration and planning companion. This app helps you discover diverse career paths, assess your skills, explore career transitions, and build personalized roadmaps for your professional journey. Whether you're just starting out, looking to change careers, or planning your next move, Career Atlas provides the tools and insights you need to make informed decisions about your future.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
        >
          Get Started Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
