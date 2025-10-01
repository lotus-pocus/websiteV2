// src/types/work.ts

export type DirectusFile = {
  id: string;
  filename_download: string;
  type: string;
};

export type Tag = {
  id: number;
  name: string;
  slug?: string;
};

export type WorkExample = {
  id: number;
  title: string;
  description: string;
  slug: string;
  category?: string | null;   // ✅ allow null here
  thumbnail?: { id: string };
  hover_video?: { id: string };
  hover_background_color?: string;
  hover_text_color?: string;
  tags?: { tags_id: Tag }[];
};




export type WorkBlock = {
  id: number;
  type: "copy" | "video" | "image";
  copy?: string;
  layout?: string;
  media?: { directus_files_id: DirectusFile }[];
  work_example_id?: {
    id?: number;
    title?: string;
    category?: string;
    tags?: { tags_id: Tag }[];
  };
};
