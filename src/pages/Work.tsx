// src/pages/Work.tsx
import { useEffect, useState } from "react";
import WorkFilterBar from "../components/work/WorkFilterBar";
import WorkGrid from "../components/work/WorkGrid";
import type { WorkExample, Tag } from ".././types/work";

const Work = () => {
  const [examples, setExamples] = useState<WorkExample[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;

        // work_examples
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

  // ✅ Filter by search term
  const searchedExamples = examples.filter((ex) => {
    const term = searchTerm.toLowerCase();
    return (
      ex.title?.toLowerCase().includes(term) ||
      ex.description?.toLowerCase().includes(term) ||
      ex.tags?.some((t) =>
        t.tags_id?.name?.toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* ✅ Title + Search inline, responsive */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 pr-16">
        {/* 👈 pr-16 ensures nothing sits under the burger (right-6 + ~40px button) */}
        <h1 className="text-3xl md:text-4xl font-bold">our work.</h1>

        <input
          type="text"
          placeholder="Search projects..."
          className="w-full md:w-80 lg:w-96 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Tag Filter */}
      <WorkFilterBar
        allTags={allTags}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
      />

      {/* ✅ Grid (search + tag combined) */}
      <WorkGrid examples={searchedExamples} activeTag={activeTag} />
    </div>
  );
};

export default Work;
