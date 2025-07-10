// src/components/ServicesGrid.tsx
import ServiceCard from "./ServiceCard";
import { services } from "../components/data/services";
import type { Service } from "../components/data/services";



 // import the type

const ServicesGrid = () => {
  return (
    <section id="work" className="py-20 px-6 bg-black text-white">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold mb-4">What We Do</h2>
        <p className="text-xl text-white">
          We design and build interactive experiences that inform, engage, and impress.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
      {services.map((service: Service, i: number) => (
  <ServiceCard key={i} {...service} />
))}

      </div>
    </section>
  );
};

export default ServicesGrid;
