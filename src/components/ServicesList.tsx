import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ServiceCard from "./ServiceCard";
import parse from "html-react-parser";

/* ---------- Types ---------- */
type WorkExample = {
  id: number;
  title: string;
  header_title?: string;
  description: string;
  slug: string;
  image: string;
  video?: string;
  homepage_copy?: string;
  homepage_side?: "left" | "right";
  homepage_background_color?: string;
  homepage_text_color?: string;
};

type DirectusWorkExample = {
  id: number;
  title: string;
  header_title?: string;
  description: string;
  slug: string;
  featured?: boolean | number;
  thumbnail?: { id: string };
  hover_video?: { id: string };
  homepage_copy?: string;
  homepage_side?: "left" | "right";
  homepage_background_color?: string;
  homepage_text_color?: string;
};

/* ---------- Child Component ---------- */
const AnimatedServiceBlock = ({
  ex,
  index,
}: {
  ex: WorkExample;
  index: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, margin: "-20% 0px -20% 0px" });
  const fromLeft =
    ex.homepage_side === "left" || (!ex.homepage_side && index % 2 === 0);

  return (
    <motion.div
      ref={ref}
      className={`relative flex flex-col lg:flex-row items-center justify-between gap-10 rounded-3xl overflow-hidden ${
        fromLeft ? "" : "lg:flex-row-reverse"
      }`}
      style={{
        backgroundColor: ex.homepage_background_color || "#000000",
        color: ex.homepage_text_color || "#ffffff",
        padding: "5rem 3rem",
        transition: "background-color 0.6s ease, color 0.6s ease",
      }}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.33, 1, 0.68, 1],
        delay: index * 0.1,
      }}
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* ---- Copy ---- */}
      <motion.div
        className={`flex-1 max-w-[600px] text-lg leading-relaxed ${
          fromLeft ? "text-left lg:pl-4" : "text-right lg:pr-4"
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: index * 0.2 + 0.3,
        }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <h2 className="text-4xl font-bold mb-4 text-pink-400 drop-shadow-[0_0_10px_#ff00aa60]">
          {ex.header_title}
        </h2>

        {ex.homepage_copy ? (
          <div
            className="prose max-w-none"
            style={{
              color: ex.homepage_text_color || "#ffffff",
            }}
          >
            {parse(ex.homepage_copy)}
          </div>
        ) : (
          <p className="text-gray-400 italic">No homepage copy provided yet.</p>
        )}
      </motion.div>

      {/* ---- Card ---- */}
      <motion.div
        className="flex justify-center items-center flex-shrink-0"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.33, 1, 0.68, 1],
          delay: index * 0.15,
        }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <ServiceCard
          title={ex.title}
          description={ex.description}
          image={ex.image}
          video={ex.video}
          link={`/work/${ex.slug}`}
        />
      </motion.div>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */
const ServicesList = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/work_examples?fields=id,title,header_title,description,slug,thumbnail.id,hover_video.id,featured,homepage_copy,homepage_side,homepage_background_color,homepage_text_color&filter[_or][0][featured][_eq]=true&filter[_or][1][featured][_eq]=1&sort=sort`
        );
        const data = await res.json();

        const mapped: WorkExample[] = (data.data || []).map(
          (item: DirectusWorkExample) => ({
            id: item.id,
            title: item.title,
            header_title: item.header_title || item.title,
            description: item.description,
            slug: item.slug,
            image: item.thumbnail?.id
              ? `${base}/assets/${item.thumbnail.id}`
              : "",
            video: item.hover_video?.id
              ? `${base}/assets/${item.hover_video.id}`
              : undefined,
            homepage_copy: item.homepage_copy || "",
            homepage_side: item.homepage_side || undefined,
            homepage_background_color:
              item.homepage_background_color || "#000000",
            homepage_text_color: item.homepage_text_color || "#ffffff",
          })
        );

        setExamples(mapped);
      } catch (err) {
        console.error("Failed to fetch featured services:", err);
      }
    };

    fetchExamples();
  }, []);

  if (!examples.length) {
    return (
      <section
        className="py-20 text-white"
        style={{
          backgroundColor: "#000000",
          clipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 100%)",
          WebkitClipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 100%)",
          marginTop: "0", // ✅ prevent double overlap
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1 className="text-5xl font-bold mb-10">our services.</h1>
        <p className="text-gray-400 italic">No featured services found.</p>
      </section>
    );
  }

  return (
    <section
      className="py-20 text-white"
      style={{
        backgroundColor: "#000000",
        clipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 100%)",
        WebkitClipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 100%)",
        marginTop: "0", // ✅ prevent double overlap
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="container mx-auto px-6">
        <motion.h1
          className="text-5xl font-bold mb-16 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {"our services.".split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: -50, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{
                duration: 0.45,
                ease: [0.65, 0, 0.35, 1],
              }}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <div className="flex flex-col gap-24">
          {examples.map((ex, i) => (
            <AnimatedServiceBlock key={ex.id} ex={ex} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
