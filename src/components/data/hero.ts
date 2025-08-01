// src/data/hero.ts

export async function fetchHeroSection() {
  const token = import.meta.env.VITE_DIRECTUS_TOKEN;
  const response = await fetch('http://localhost:8055/items/hero_section?fields=video.filename_disk,video.type,video.title', {
    headers: {
      Authorization: `Bearer ${token}`, // replace or load from env if needed
    },
  });

  if (!response.ok) throw new Error('Failed to fetch hero section');

  const json = await response.json();
  return json.data;
}
