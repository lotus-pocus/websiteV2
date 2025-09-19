// src/pages/WorkOverview.tsx
import { Link } from "react-router-dom";
import RelatedCard from "../components/RelatedCard";
import { services } from "../components/data/services"; // 👈 import your hardcoded list

const WorkOverview = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Our Work</h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {services.map((srv) => {
          // Turn the title into a slug (for /work/:category)
          const slug = srv.title.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link key={slug} to={`/work/${slug}`}>
              <RelatedCard
                title={srv.title}
                description={srv.description}
                thumbnail={srv.image}
                hoverVideo={srv.video}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WorkOverview;
