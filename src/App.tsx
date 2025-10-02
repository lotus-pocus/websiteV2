// src/App.tsx
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Work from "./pages/Work";        // ⬅️ updated
import WorkDetail from "./pages/WorkDetail";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
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
        <Route path="/work" element={<Work />} />   {/* ⬅️ updated */}
        <Route path="/work/:slug" element={<WorkDetail />} />

        {/*Labs routes */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:id" element={<LabDetail />} />



        {/* Other pages */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
