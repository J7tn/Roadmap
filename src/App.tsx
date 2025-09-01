import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/MobileOptimizedHome";
import SearchPage from "./pages/SearchPage";
import AllJobsPage from "./pages/AllJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs" element={<AllJobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
