// src/pages/Work.tsx
import { useEffect, useState } from "react";
import WorkFilterBar from "../components/work/WorkFilterBar";
import WorkGrid from "../components/work/WorkGrid";
import type { WorkExample, Tag } from "../../src/types/work";

const Work = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");

  // Fetch work_examples and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // work_examples — include slug now
        const exRes = await fetch(
          `${base}/items/work_examples?fields=id,title,slug,description,category,thumbnail.id,hover_video.id,hover_background_color,hover_text_color,tags.tags_id.*`
        );
        const exData = await exRes.json();
        setExamples(Array.isArray(exData.data) ? exData.data : []);

        // tags
        const tagsRes = await fetch(`${base}/items/tags?fields=id,name,slug`);
        const tagsData = await tagsRes.json();
        setAllTags(Array.isArray(tagsData.data) ? tagsData.data : []);
      } catch (err) {
        console.error("Failed to fetch work data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Our Work</h1>

      {/* Filter bar */}
      <WorkFilterBar
        allTags={allTags}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
      />

      {/* Thumbnail grid */}
      <WorkGrid examples={examples} activeTag={activeTag} />
    </div>
  );
};

export default Work;
