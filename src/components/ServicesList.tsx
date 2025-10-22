// src/components/ServicesList.tsx
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

  const fromLeft = ex.homepage_side === "left" || (!ex.homepage_side && index % 2 === 0);

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center justify-between gap-10 ${
        fromLeft ? "" : "lg:flex-row-reverse"
      }`}
      initial={{ opacity: 0, x: -200 }}
      animate={{
        opacity: inView ? 1 : 0,
        x: inView ? 0 : -200,
      }}
      transition={{
        duration: 1.2,
        ease: [0.33, 1, 0.68, 1],
        delay: index * 0.1,
      }}
    >
      {/* ---- Copy ---- */}
      <motion.div
        className={`flex-1 max-w-[600px] text-lg leading-relaxed ${
          fromLeft ? "text-left lg:pl-4" : "text-right lg:pr-4"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: index * 0.2 + 0.3,
        }}
      >
        <h2 className="text-4xl font-bold text-pink-400 mb-4">
          {ex.header_title}
        </h2>

        {ex.homepage_copy ? (
          <div className="prose prose-invert max-w-none">
            {parse(ex.homepage_copy)}
          </div>
        ) : (
          <p className="text-gray-400 italic">No homepage copy provided yet.</p>
        )}
      </motion.div>

      {/* ---- Card ---- */}
      <motion.div
        className="flex justify-center items-center flex-shrink-0"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -200 }}
        transition={{
          duration: 1.2,
          ease: [0.33, 1, 0.68, 1],
          delay: index * 0.2,
        }}
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
          `${base}/items/work_examples?fields=id,title,header_title,description,slug,thumbnail.id,hover_video.id,featured,homepage_copy,homepage_side&filter[_or][0][featured][_eq]=true&filter[_or][1][featured][_eq]=1&sort=sort`
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
      <section className="py-20 bg-black text-white text-center">
        <h1 className="text-5xl font-bold mb-10">our services.</h1>
        <p className="text-gray-400 italic">No featured services found.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Animated Section Title */}
        <motion.h1
          className="text-5xl font-bold mb-16 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.8 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {"our services".split("").map((char, i) => (
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
