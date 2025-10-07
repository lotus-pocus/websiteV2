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
  featured?: boolean | number;
  thumbnail?: { id: string };
  hover_video?: { id: string };
  category?: string;
  category_rel?: { id: number; name: string; slug: string };
};

const ServicesGrid = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // ✅ Accepts both boolean `true` and numeric `1` for featured
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,slug,thumbnail.id,hover_video.id,featured,category,category_rel.id,category_rel.name,category_rel.slug&filter[_or][0][featured][_eq]=true&filter[_or][1][featured][_eq]=1&sort=sort`
        );

        const data = await res.json();
        console.log("Fetched featured examples:", data?.data);

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
            category: item.category_rel?.name || item.category || "",
          })
        );

        setExamples(mapped);
        console.log("Mapped examples:", JSON.stringify(mapped, null, 2));

      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };

    fetchExamples();
  }, []);

  // 🩶 Optional: graceful empty state
  if (!examples.length) {
    return (
      <section className="py-20 bg-black text-white text-center">
        <h1 className="text-5xl font-bold mb-10">our services.</h1>
        <p className="text-gray-400 italic">No featured projects found.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-10 text-center">our services.</h1>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((ex) => (
            <ServiceCard
              key={ex.id}
              title={ex.title}
              description={ex.category || ""}
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
