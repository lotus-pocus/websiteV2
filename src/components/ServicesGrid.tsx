// src/components/ServicesGrid.tsx
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

type WorkExample = {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: string;
  video?: string;
  category?: string;
};

type DirectusWorkExample = {
  id: number;
  title: string;
  description: string;
  slug: string;
  featured?: boolean;
  thumbnail?: { id: string };
  hover_video?: { id: string };
  // old static dropdown
  category?: string;
  // new relational field
  category_rel?: { id: number; name: string; slug: string };
};

const ServicesGrid = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,slug,thumbnail.id,hover_video.id,featured,category,category_rel.id,category_rel.name,category_rel.slug&filter[featured][_eq]=true&sort=sort`
        );
        const data = await res.json();

        const mapped: WorkExample[] = (data.data || []).map(
          (item: DirectusWorkExample) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            slug: item.slug,
            image: item.thumbnail?.id
              ? `${base}/assets/${item.thumbnail.id}`
              : "",
            video: item.hover_video?.id
              ? `${base}/assets/${item.hover_video.id}`
              : undefined,
            // 👇 prefer new relational field, fallback to old dropdown
            category: item.category_rel?.name || item.category || "",
          })
        );

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };

    fetchExamples();
  }, []);

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Services</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex) => (
            <ServiceCard
              key={ex.id}
              title={ex.title}
              description={ex.category || ""} // 👈 will now show "VR Experiences"
              image={ex.image}
              video={ex.video}
              link={`/work/${ex.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
