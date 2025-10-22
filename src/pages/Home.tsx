// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import About from "../components/About";
import Section from "../components/Section";
// import GameTrail from "../components/GameTrail";
import ServicesList from "../components/ServicesList"; // 👈 updated import
import StudioIntro from "../components/StudioIntro";
import ClientsTicker from "../components/ClientsTicker";
import FeaturedLabs from "../components/FeaturedLabs";

const Home: React.FC = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <Layout>
      {/* <GameTrail cursor={cursor} /> */}

      {/* Hero Section */}
      <Section theme="dark" paddingClass="p-0 m-0">
        <Hero />
      </Section>

      {/* About Section */}
      <About />

      {/* Updated Alternating Services Layout */}
      <ServicesList />

      {/* Studio Intro */}
      <StudioIntro />

      {/* Client Logos */}
      <ClientsTicker />

      {/* Featured Labs */}
      <FeaturedLabs />

      {/* Placeholder section */}
      <Section theme="dark">
        <div className="text-center text-gray-400 py-40">
          [ More content coming soon ]
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
