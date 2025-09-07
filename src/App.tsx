import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import WelcomePage from './pages/WelcomePage';
import Home from './components/home';
import SearchPage from './pages/SearchPage';
import AllJobsPage from './pages/AllJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CareerCategoriesPage from './pages/CareerCategoriesPage';
import MyCareerPathsPage from './pages/MyCareerPathsPage';
import MyBookmarksPage from './pages/MyBookmarksPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import SkillsAssessmentPage from './pages/SkillsAssessmentPage';
import CareerBranchingPage from './pages/CareerBranchingPage';
import CategoryCareersPage from './pages/CategoryCareersPage';
import { appStartupService } from './services/appStartupService';

function App() {
  // Initialize app startup service on app load
  useEffect(() => {
    appStartupService.initialize().catch(error => {
      console.warn('App startup initialization failed:', error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white app-content" id="app-content">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-lg">Loading...</p></div>}>
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/jobs" element={<AllJobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/categories" element={<CareerCategoriesPage />} />
            <Route path="/my-paths" element={<MyCareerPathsPage />} />
            <Route path="/bookmarks" element={<MyBookmarksPage />} />
            <Route path="/roadmap" element={<CareerRoadmapPage />} />
            <Route path="/skills" element={<SkillsAssessmentPage />} />
            <Route path="/branching" element={<CareerBranchingPage />} />
            <Route path="/category/:categoryId" element={<CategoryCareersPage />} />
          </Routes>
        </>
      </Suspense>
    </div>
  );
}

export default App;
