import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

// helper to turn category into safe HTML id
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/[^\w-]+/g, ""); // remove weird chars

const ServicesGrid = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,thumbnail.id,hover_video.id,category&sort=sort`
        );
        const data = await res.json();

        const mapped: WorkExample[] = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.thumbnail?.id ? `${base}/assets/${item.thumbnail.id}` : "",
          video: item.hover_video?.id
            ? `${base}/assets/${item.hover_video.id}`
            : undefined,
          category: item.category,
        }));

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };

    const fetchSound = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/sound_effects?filter[name][_eq]=WazzupMan&fields=file.id,volume`
        );
        const data = await res.json();
        const record = data?.data?.[0];
        const fileId = record?.file?.id;
        const volume = record?.volume ?? 1.0;

        if (fileId && audioRef.current) {
          audioRef.current.src = `${base}/assets/${fileId}`;
          audioRef.current.volume = Math.max(0, Math.min(volume, 1.0));
        }
      } catch (err) {
        console.error("Failed to fetch scroll sound:", err);
      }
    };

    fetchExamples();
    fetchSound();
  }, []);

  // unlock audio on first click
  useEffect(() => {
    const unlock = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            audioRef.current?.pause();
            audioRef.current.currentTime = 0;
          })
          .catch(() => {});
      }
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  // play sound on scroll into view
  useEffect(() => {
    if (!sectionRef.current || !audioRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

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
              <Link to={`/work#${slugify(ex.category)}`}>
                <ServiceCard
                  title={ex.title}
                  description={ex.description}
                  image={ex.image}
                  video={ex.video}
                />
              </Link>
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
