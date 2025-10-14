// src/App.tsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Work from "./pages/Work";
import WorkDetail from "./pages/WorkDetail";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Interactive from "./pages/Interactive"; // 👈 new page import

import MobileMenu from "./components/MobileMenu";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="relative isolation-isolate">
      {/* Burger menu overlay (appears on all pages) */}
      <MobileMenu isDark={true} />

      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Work routes */}
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />

        {/* Labs routes */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:id" element={<LabDetail />} />

        {/* Interactive (iframe fullscreen experience) */}
        <Route path="/interactive" element={<Interactive />} />

        {/* Other pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
