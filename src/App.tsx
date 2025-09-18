import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Labs from "./pages/Labs";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import MobileMenu from "./components/MobileMenu";
import ScrollToHash from "./components/ScrollToHash"; // 👈 add this

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className="relative isolation-isolate">
      <MobileMenu isDark={true} />
      <ScrollToHash /> {/* 👈 mount it once */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
