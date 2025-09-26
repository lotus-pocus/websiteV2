import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import VideoModal from "./VideoModal";

type WorkExample = {
  id: number;
  title: string;
  description: string;
  image: string;
  video?: string;
  category?: string;
};

type DirectusWorkExample = {
  id: number;
  title: string;
  description: string;
  thumbnail?: { id: string };
  hover_video?: { id: string };
  category?: string;
  featured?: boolean;
};

// ✅ normalize category → kebab-case
const toKebabCase = (str: string) =>
  str.toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");

const ServicesGrid = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // only fetch featured = true
        const res = await fetch(
          `${base}/items/work_examples?filter[featured][_eq]=true&fields=id,title,description,thumbnail.id,hover_video.id,category,featured&sort=sort`
        );
        const data = await res.json();

        const mapped: WorkExample[] = data.data.map(
          (item: DirectusWorkExample) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.thumbnail?.id
              ? `${base}/assets/${item.thumbnail.id}`
              : "",
            video: item.hover_video?.id
              ? `${base}/assets/${item.hover_video.id}`
              : undefined,
            category: item.category,
          })
        );

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };

    fetchExamples();
  }, []);

  // ✅ safe navigation → go to /work/:category
  const handleNavigate = (category?: string) => {
    if (!category) return;
    const slug = toKebabCase(category);
    navigate(`/work/${slug}`);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-20 px-6 bg-black text-white"
    >
      <audio ref={audioRef} preload="auto" />

      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold mb-4">What We Do</h2>
        <p className="text-xl text-white">
          We design and build interactive experiences that inform, engage, and
          impress.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
        {examples.map((ex) => (
          <div key={ex.id}>
            {ex.category ? (
              <div onClick={() => handleNavigate(ex.category)}>
                <ServiceCard
                  title={ex.title}
                  description={ex.description}
                  image={ex.image}
                  video={ex.video}
                />
              </div>
            ) : (
              <div onClick={() => ex.video && setActiveVideo(ex.video)}>
                <ServiceCard
                  title={ex.title}
                  description={ex.description}
                  image={ex.image}
                  video={ex.video}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
};

export default ServicesGrid;
