import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import About from "../components/About";
import Section from "../components/Section";
// import GameTrail from "../components/GameTrail";
import ServicesGrid from "../components/ServicesGrid";
import StudioIntro from "../components/StudioIntro";

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

      <Section theme="dark" paddingClass="p-0 m-0">
        <Hero />
      </Section>

      <Section theme="light" paddingClass="pb-0">
        <About />
      </Section>

      <Section theme="light" paddingClass="pt-4 pb-20" id="services">
        <ServicesGrid />
      </Section>

      {/* Add more sections here as needed */}
      <Section theme="light">
        <StudioIntro />
        <div className="text-center text-gray-400 py-40">
          [ More content coming soon ]
        </div>
      </Section>

      <Section theme="dark">
        <div className="text-center text-gray-400 py-40">
          [ More content coming soon ]
        </div>
      </Section>
    </Layout>
  );
};

export default Home;
