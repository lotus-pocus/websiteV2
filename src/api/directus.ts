const API_URL = 'http://localhost:8055';

export async function getHeroSection() {
  const res = await fetch(`${API_URL}/items/hero_section?fields=video,headline,subtext`);
  const json = await res.json();
  return json.data;
}
