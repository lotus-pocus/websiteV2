import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type WorkExample = {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: string;
  video?: string;
  category?: string;
};

export default function ServicesScrollLock() {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const activeIndex = useRef(0);

  const setCardRef = useCallback(
    (i: number): React.RefCallback<HTMLDivElement> =>
      (el) => {
        if (el) cardsRef.current[i] = el;
      },
    []
  );

  /* ---------- 1️⃣ Fetch data from Directus ---------- */
  useLayoutEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,description,slug,thumbnail.id,hover_video.id,featured,category,category_rel.id,category_rel.name,category_rel.slug&filter[_or][0][featured][_eq]=true&filter[_or][1][featured][_eq]=1&sort=sort`
        );
        const data = await res.json();

        const mapped: WorkExample[] = (data.data || []).map((item: any) => ({
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
        }));

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch work examples:", err);
      }
    };
    fetchExamples();
  }, []);

  /* ---------- 2️⃣ Letter-by-letter title animation ---------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = titleWrapperRef.current;
      if (!wrapper) return;

      const letters = wrapper.querySelectorAll(".letter");
      gsap.set(letters, { opacity: 0, y: -60, rotateX: 45 });

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 80%",
        end: "bottom top",
        toggleActions: "restart none none reset", // replays on scroll back
        onEnter: () => {
          gsap.to(letters, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: "back.out(1.7)",
            stagger: 0.08,
            duration: 0.6,
          });
        },
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  /* ---------- 3️⃣ Scroll logic for pinned services cards ---------- */
  useLayoutEffect(() => {
    if (!examples.length) return;

    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || cards.length !== examples.length) return;

    const total = examples.length;
    const radiusX = 700;
    const radiusY = 250;
    const scrollPerCard = 800;
    const totalScroll = scrollPerCard * (total - 1);

    const basePositions = Array.from({ length: total }, (_, i) => {
      const angle = (-110 + (220 * i) / (total - 1)) * (Math.PI / 180);
      const x = Math.sin(angle) * radiusX;
      const y = Math.cos(angle) * radiusY - 60;
      return { x, y };
    });

    // Initial positions
    cards.forEach((card, i) => {
      const { x, y } = basePositions[i];
      gsap.set(card, {
        x,
        y,
        scale: i === 0 ? 2.1 : 1,
        zIndex: i === 0 ? 10 : 1,
        opacity: 1,
      });
    });

    // Fade-in to prevent jump
    gsap.set(section, { opacity: 0 });
    gsap.to(section, {
      opacity: 1,
      duration: 0.5,
      delay: 0.2,
      ease: "power2.out",
    });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top+=250 top", // delay pin start to avoid snap
      end: `+=${totalScroll}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,
      onUpdate: (self) => {
        const index = Math.round(self.progress * (total - 1));
        if (index === activeIndex.current) return;

        const prev = activeIndex.current;
        const next = index;
        activeIndex.current = index;

        const prevPos = basePositions[prev];
        const prevEl = cards[prev];
        const nextEl = cards[next];
        if (!prevEl || !nextEl) return;

        gsap.to(prevEl, {
          x: prevPos.x,
          y: prevPos.y,
          scale: 1,
          zIndex: 1,
          duration: 0.6,
          ease: "power2.inOut",
        });

        gsap.to(nextEl, {
          x: 0,
          y: 0,
          scale: 2.1,
          zIndex: 10,
          duration: 0.8,
          ease: "power2.inOut",
        });
      },
    });

    return () => st.kill();
  }, [examples]);

  /* ---------- 4️⃣ Render ---------- */
  if (!examples.length)
    return (
      <section className="h-[100vh] bg-black flex items-center justify-center text-white">
        <p>Loading services...</p>
      </section>
    );

  return (
    <>
      {/* 🔹 Title Section (separate from pinned area) */}
      <section
        ref={titleWrapperRef}
        className="relative bg-black min-h-[40vh] flex items-center justify-center text-center overflow-hidden"
      >
        <h2 className="text-6xl font-bold text-white tracking-tight flex justify-center gap-1">
          {"our services.".split("").map((char, i) => (
            <span
              key={i}
              className={`letter inline-block ${
                char === " " ? "w-3" : ""
              } ${char === "." ? "text-pink-500" : ""}`}
              style={{ transformOrigin: "center bottom" }}
            >
              {char}
            </span>
          ))}
        </h2>
      </section>

      {/* 🔹 Pinned Services Section */}
      <section
        ref={sectionRef}
        className="relative h-[100vh] bg-black flex items-center justify-center overflow-hidden"
        style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
      >
        <div className="relative w-full max-w-[1900px] h-[700px] flex items-center justify-center">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.id}
              ref={setCardRef(i)}
              className="absolute flex items-center justify-center text-white font-bold shadow-lg cursor-pointer border border-white/20 overflow-hidden group"
              style={{
                width: 280,
                height: 160, // rectangular shape
                borderRadius: 0, // sharp corners
                transform: `scale(${i === 0 ? 2.1 : 1})`,
                zIndex: i === 0 ? 10 : 1,
              }}
              onClick={() => (window.location.href = `/work/${ex.slug}`)}
            >
              {ex.image ? (
                <img
                  src={ex.image}
                  alt={ex.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  {ex.title}
                </div>
              )}

              {ex.video && (
                <video
                  className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  src={ex.video}
                  muted
                  loop
                  autoPlay
                />
              )}

              {/* Overlay background */}
              <div className="absolute inset-0 bg-black/20 opacity-100 group-hover:bg-black/40 transition-all duration-300" />

              {/* Overlay tag */}
              <div className="absolute bottom-2 left-2 right-2 text-sm font-normal bg-black/60 px-2 py-1 text-white text-center pointer-events-none select-none">
                {ex.category || ex.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
