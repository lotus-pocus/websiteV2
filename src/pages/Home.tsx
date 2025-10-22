import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import About from "../components/About";
import Section from "../components/Section";
import StudioIntro from "../components/StudioIntro";
import ClientsGrid from "../components/ClientsGrid";
import FeaturedLabs from "../components/FeaturedLabs";
import ServicesTitle from "../components/ServicesTitle";
import ServicesGridSimple from "../components/ServicesGridSimple";

const Home: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <Layout>
      {/* ---------- HERO ---------- */}
      <Section theme="dark" paddingClass="p-0 m-0">
        <Hero />
      </Section>

      {/* ---------- ABOUT ---------- */}
      <About />

      {/* ---------- OUR SERVICES ---------- */}
      <ServicesTitle />
      <ServicesGridSimple />

      {/* ---------- STUDIO INTRO ---------- */}
      <StudioIntro />

      {/* ---------- CLIENTS ---------- */}
      <ClientsGrid />

      {/* ---------- FEATURED LABS ---------- */}
      <FeaturedLabs />

      {/* ---------- FOOTER PLACEHOLDER ---------- */}
      <Section theme="dark">
        <div className="text-center text-gray-400 py-40">
          [ More content coming soon ]
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
