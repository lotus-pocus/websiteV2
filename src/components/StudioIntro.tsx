import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Section from "./Section";
import parse, { domToReact, Element } from "html-react-parser";

const PunchWord = ({ children, color }: { children: string; color: string }) => (
  <motion.span
    className="inline-block font-semibold cursor-pointer"
    style={{ color }}
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.3 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    viewport={{ once: true, amount: 0.8 }}
  >
    {children}
  </motion.span>
);

const SpinInWord = ({ children, color }: { children: string; color: string }) => (
  <motion.span
    className="inline-block font-semibold cursor-pointer"
    style={{ color }}
    initial={{ rotate: -360, scale: 0, opacity: 0 }}
    whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
    whileHover={{ rotate: 360, scale: 1.2 }}
    transition={{ type: "spring", stiffness: 300, damping: 15, duration: 0.6 }}
    viewport={{ once: true, amount: 0.6 }}
  >
    {children}
  </motion.span>
);

const StudioIntro = () => {
  const [copy, setCopy] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [highlightColor, setHighlightColor] = useState<string>("#ff0055");

  useEffect(() => {
    const fetchStudioIntro = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const token = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined;

        const res = await fetch(
          `${base}/items/studio_intro?fields=copy,background_color,text_color,highlight_color`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        if (!res.ok) throw new Error(`Directus error: ${res.status}`);
        const data = await res.json();
        const record = data?.data?.[0];

        if (record) {
          setCopy(record.copy || "");
          setBackgroundColor(record.background_color || "#ffffff");
          setTextColor(record.text_color || "#000000");
          setHighlightColor(record.highlight_color || "#ff0055");
        }
      } catch (err) {
        console.error("Failed to fetch StudioIntro:", err);
      }
    };

    fetchStudioIntro();
  }, []);

  return (
    <Section
      id="studio-intro"
      paddingClass="py-24"
      backgroundColor={backgroundColor}
      textColor={textColor}
    >
      {/* 👇 Inline CSS to remove default <mark> highlight */}
      <style>
        {`
          mark {
            background: none !important;
            color: inherit !important;
          }
        `}
      </style>

      <div className="max-w-3xl mx-auto px-4 text-lg leading-relaxed">
        {copy
          ? parse(copy, {
              replace: (domNode) => {
                if (domNode instanceof Element && domNode.name === "mark") {
                  const effect = domNode.attribs["data-effect"];
                  const content = domToReact(domNode.children);

                  if (effect === "punch") {
                    return (
                      <PunchWord color={highlightColor || "#ff0055"}>
                        {content}
                      </PunchWord>
                    );
                  }
                  if (effect === "spin") {
                    return (
                      <SpinInWord color={highlightColor || "#ff0055"}>
                        {content}
                      </SpinInWord>
                    );
                  }
                }
              },
            })
          : null}
      </div>
    </Section>
  );
};

export default StudioIntro;
