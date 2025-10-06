import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AboutHeaderGame from "../components/about/AboutHeaderGame";

/* ---------- Types ---------- */
type TeamMember = {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  photo?: {
    id: string;
    filename_download: string;
  };
};

type AboutData = {
  id: number;
  title?: string;
  intro_text?: string;
  team_members?: TeamMember[];
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const base = import.meta.env.VITE_DIRECTUS_URL;

  /* ---------- Fetch Data from Directus ---------- */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(
          `${base}/items/about_page?fields=*,team_members.*,team_members.photo.id,team_members.photo.filename_download`
        );
        const data = await res.json();
        setAbout(data.data[0]);
      } catch (error) {
        console.error("Error fetching About Page:", error);
      }
    };
    fetchAbout();
  }, [base]);

  /* ---------- Loading ---------- */
  if (!about) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-gray-400 font-['Sixtyfour'] animate-pulse">
            Loading About Page...
          </p>
        </div>
      </Layout>
    );
  }

  /* ---------- Render ---------- */
  return (
    <Layout>
      <div className="min-h-screen bg-black text-white no-global-link">
        {/* Arcade Header Game */}
        <AboutHeaderGame />

        {/* Dynamic Intro Section (from Directus) */}
        <section className="p-10 max-w-3xl mx-auto text-lg leading-relaxed text-center">
          {about.title && (
            <h1 className="text-4xl sm:text-5xl font-['Sixtyfour'] mb-4 text-pink-400 drop-shadow-[0_0_10px_#ff00ff]">
              {about.title}
            </h1>
          )}

          {about.intro_text && (
            <p
              className="mb-4 text-gray-300"
              dangerouslySetInnerHTML={{ __html: about.intro_text }}
            />
          )}

          {/* Glowing hardcoded email (keep this only) */}
          <address className="not-italic mt-4">
            <a
              href="mailto:hello@gamoola.com"
              className="inline-block text-pink-400 underline decoration-pink-400 hover:text-white hover:decoration-white transition-colors duration-300 drop-shadow-[0_0_6px_#ff00ff]"
            >
              hello@gamoola.com
            </a>
          </address>
        </section>

        {/* Team Members Section */}
        {about.team_members && about.team_members.length > 0 && (
          <section className="p-10 max-w-6xl mx-auto flex flex-col gap-16">
            {about.team_members.map((member, index) => (
              <div
                key={member.id}
                className={`flex flex-col md:flex-row items-center md:items-start gap-8 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                } hover:scale-[1.02] transition-transform duration-300`}
              >
                {/* Larger square photo */}
                {member.photo && (
                  <div className="relative w-64 h-64 md:w-80 md:h-80 border-2 border-pink-400 shadow-[0_0_25px_#ff00ff60] overflow-hidden shrink-0">
                    <img
                      src={`${base}/assets/${member.photo.id}?width=600&quality=90`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Text content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-['Sixtyfour'] text-2xl text-pink-400 drop-shadow-[0_0_6px_#ff00ff] mb-1">
                    {member.name}
                  </h3>

                  {member.role && (
                    <p className="text-sm text-gray-400 mb-3">{member.role}</p>
                  )}

                  {member.bio && (
                    <p
                      className="text-sm text-gray-300 leading-relaxed max-w-xl"
                      dangerouslySetInnerHTML={{ __html: member.bio }}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
