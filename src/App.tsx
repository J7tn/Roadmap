import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SearchPage from "./pages/SearchPage";
import AllJobsPage from "./pages/AllJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import CareerCategoriesPage from "./pages/CareerCategoriesPage";
import MyCareerPathsPage from "./pages/MyCareerPathsPage";

import SkillsAssessmentPage from "./pages/SkillsAssessmentPage";
import CareerBranchingPage from "./pages/CareerBranchingPage";
import CategoryCareersPage from "./pages/CategoryCareersPage";
import WelcomePage from "./pages/WelcomePage";
import ScrollToTop from "./components/ScrollToTop";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
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

          <Route path="/skills" element={<SkillsAssessmentPage />} />
          <Route path="/branching" element={<CareerBranchingPage />} />
          <Route path="/category/:categoryId" element={<CategoryCareersPage />} />
        </Routes>
        {/* Temporarily disable Tempo routes for mobile debugging */}
        {/* {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)} */}
      </>
    </Suspense>
  );
}

export default App;
