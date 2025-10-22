import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

export default function ServicesGridSimple() {
  const [examples, setExamples] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,slug,thumbnail.id,hover_video.id,featured,category,category_rel.id,category_rel.name,category_rel.slug&filter[_or][0][featured][_eq]=true&filter[_or][1][featured][_eq]=1&sort=sort`
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

  if (!examples.length)
    return (
      <section className="py-20 bg-black text-white text-center">
        <h1 className="text-5xl font-bold mb-10">our services.</h1>
        <p className="text-gray-400 italic">Loading featured services...</p>
      </section>
    );

  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {examples.map((ex, i) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative cursor-pointer border border-white/20 overflow-hidden"
            style={{ borderRadius: 0 }}
            onClick={() => (window.location.href = `/work/${ex.slug}`)}
          >
            {ex.image ? (
              <img
                src={ex.image}
                alt={ex.title}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                {ex.title}
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-all duration-300" />
            <div className="absolute bottom-2 left-2 right-2 text-sm bg-black/60 px-2 py-1 text-center">
              {ex.category || ex.title}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
