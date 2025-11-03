// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Work from "./pages/Work";
import WorkDetail from "./pages/WorkDetail";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Interactive from "./pages/Interactive";

const App = () => {
  return (
    // 👇 Layout wraps ALL routes (so it never unmounts)
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:id" element={<LabDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/interactive" element={<Interactive />} />
      </Routes>
    </Layout>
  );
};

export default App;
