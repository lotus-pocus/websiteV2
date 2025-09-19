import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WorkOverview from "./pages/WorkOverview";   // 👈 new
import WorkDetail from "./pages/WorkDetail";       // 👈 new
import Labs from "./pages/Labs";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import MobileMenu from "./components/MobileMenu";
import ScrollToHash from "./components/ScrollToHash";
import WorkRedirect from "./components/WorkRedirect"; // 👈 new

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="relative isolation-isolate">
      <MobileMenu isDark={true} />
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/work"
          element={
            <>
              <WorkRedirect />   {/* 👈 converts /work#foo → /work/foo */}
              <WorkOverview />   {/* 👈 overview grid */}
            </>
          }
        />
        <Route path="/work/:category" element={<WorkDetail />} /> {/* 👈 detail view */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
