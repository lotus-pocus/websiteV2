// src/App.tsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import WorkOverview from "./pages/WorkOverview";
import WorkDetail from "./pages/WorkDetail";
import Labs from "./pages/Labs";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";

import MobileMenu from "./components/MobileMenu";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="relative isolation-isolate">
      <MobileMenu isDark={true} />

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Work routes */}
        <Route path="/work" element={<WorkOverview />} />
        <Route path="/work/:category" element={<WorkDetail />} />

        {/* Other pages */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
