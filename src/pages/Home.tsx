import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Section from "../components/Section";
import ServicesList from "../components/ServicesList";
import StudioIntro from "../components/StudioIntro";
import ClientsTicker from "../components/ClientsTicker";
import FeaturedLabs from "../components/FeaturedLabs";

const Home: React.FC = () => {
  return (
    <>
      
      <Hero />
      

      <About />
      <ServicesList />
      <StudioIntro />
      <ClientsTicker />
      <FeaturedLabs />

      <Section theme="dark">
        <div className="text-center text-gray-400 py-40">
          [ More content coming soon ]
        </div>
      </Section>
    </>
  );
};

export default Home;
