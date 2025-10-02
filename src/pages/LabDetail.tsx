// src/pages/LabDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";

type Lab = {
  id: number;
  title: string;
  description?: string;
  thumbnail?: { id: string };
  hover_video?: { id: string };
};

const LabDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const base = import.meta.env.VITE_DIRECTUS_URL as string;
        const res = await fetch(
          `${base}/items/labs/${id}?fields=id,title,description,thumbnail.id,hover_video.id`
        );
        const data = await res.json();
        setLab(data?.data || null);
      } catch (err) {
        console.error("Failed to fetch lab detail:", err);
      }
    };

    if (id) fetchLab();
  }, [id]);

  if (!lab) {
    return <p className="text-gray-400">Loading lab…</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <Link
        to="/labs"
        className="mb-6 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        ← Back to Labs
      </Link>

      <h1 className="text-4xl font-bold mb-6">{lab.title}</h1>

      {lab.thumbnail && (
        <img
          src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${lab.thumbnail.id}`}
          alt={lab.title}
          className="w-full max-w-2xl mb-6 rounded"
        />
      )}

      {lab.description && (
        <div className="prose prose-invert max-w-2xl">
          {parse(lab.description)}
        </div>
      )}
    </div>
  );
};

export default LabDetail;
