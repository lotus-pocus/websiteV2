import { useEffect, useRef, useState } from "react";

type WorkExample = {
  id: number;
  title: string;
  description: string;
  image: string;
  video?: string;
};

const HorizontalScroll = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,thumbnail.id,hover_video.id&sort=sort`
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
        }));

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };

    fetchExamples();
  }, []);

  // Mouse-driven auto-scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      const { left, width } = container.getBoundingClientRect();
      const relX = clientX - left;

      // Center of container
      const center = width / 2;
      const distance = relX - center; // -ve = left, +ve = right
      const intensity = distance / (width / 2); // -1 to 1
      const speed = intensity * 50; // max ±50px per frame (much punchier!)

      cancelAnimationFrame(rafId);

      const step = () => {
        if (Math.abs(speed) > 0.5) {
          container.scrollLeft += speed;
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseEnter = (id: number) => {
    const timer = setTimeout(() => setExpandedId(id), 1000); // expand after 2s
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoverTimer(null);
    setExpandedId(null);
  };

  return (
    <section id="work" className="w-full bg-black text-white py-10">
      <div
        ref={containerRef}
        className="flex overflow-x-scroll no-scrollbar gap-6 px-6"
      >
        {examples.map((ex) => {
          const isExpanded = expandedId === ex.id;
          return (
            <div
              key={ex.id}
              className={`relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-700 ease-out
                ${isExpanded ? "w-[55vw]" : "w-[18vw]"} h-[75vh]`}
              onMouseEnter={() => handleMouseEnter(ex.id)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={ex.image}
                alt={ex.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out
                  ${isExpanded ? "scale-110" : "scale-100"}`}
              />
              <div
                className={`absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-500
                ${isExpanded ? "opacity-100" : "opacity-0"}`}
              >
                <h3 className="text-3xl font-bold mb-4">{ex.title}</h3>
                <p className="text-lg">{ex.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HorizontalScroll;
