import { useEffect, useState } from "react";

type DirectusFile = { id: string };
type Client = { id: number; name: string; logo?: DirectusFile };

export default function ClientsTicker() {
  const [clients, setClients] = useState<Client[]>([]);
  const [bgColor, setBgColor] = useState("#000000");
  const [headerColor, setHeaderColor] = useState("#ffffff");
  const [scale, setScale] = useState(1.5);

  const base = import.meta.env.VITE_DIRECTUS_URL as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🟢 Fetch clients
        const clientRes = await fetch(
          `${base}/items/clients?fields=id,name,logo.id`
        );
        const clientData = await clientRes.json();
        setClients(clientData.data || []);

        // 🎨 Fetch Site Settings (array format)
        const settingsRes = await fetch(
          `${base}/items/site_settings?fields=client_logo_background_color,client_logo_scale,client_logo_header_color`
        );
        const settingsData = await settingsRes.json();
        const record = settingsData.data?.[0];

        if (record) {
          if (record.client_logo_background_color)
            setBgColor(record.client_logo_background_color);
          if (record.client_logo_scale)
            setScale(Number(record.client_logo_scale));
          if (record.client_logo_header_color)
            setHeaderColor(record.client_logo_header_color);
          else {
            // auto-contrast fallback if no header color is set
            const bg = record.client_logo_background_color || "#000000";
            const isLight =
              parseInt(bg.replace("#", ""), 16) > 0xffffff / 2;
            setHeaderColor(isLight ? "#000000" : "#ffffff");
          }
        }
      } catch (err) {
        console.error("Failed to fetch clients or site settings:", err);
      }
    };

    fetchData();
  }, [base]);

  if (!clients.length) return null;

  const strip = [...clients, ...clients];

  return (
    <section
      className="relative overflow-hidden text-white transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <style>{`
        .marquee {
          display: inline-flex;
          gap: ${4 * scale}rem;
          align-items: center;
          width: max-content;
          will-change: transform;
        }
        .marquee-row {
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        /* 🐢 Slow, smooth scrolling */
        .marquee-anim-left  { animation: marquee-left 90s linear infinite; }
        .marquee-anim-right { animation: marquee-right 100s linear infinite; }
        @keyframes marquee-left  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        @media (prefers-reduced-motion: reduce) {
          .marquee-anim-left, .marquee-anim-right { animation: none; }
        }

        .logo-tile {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          transition: opacity .2s ease;
        }
        .logo-tile:hover { opacity: 1; }

        .logo-img {
          object-fit: contain;
          filter: drop-shadow(0 0 0 transparent);
          transition: filter .25s ease;
        }
        .logo-tile:hover .logo-img {
          filter: drop-shadow(0 0 6px #ff00aa);
        }
      `}</style>

      {/* 🏷️ Heading */}
      <h2
        className="text-3xl font-bold text-center mb-12 tracking-wide"
        style={{ color: headerColor }}
      >
        Trusted by
      </h2>

      {/* 🧩 Vertical gap scales with logo size */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${8 * scale}rem`,
        }}
      >
        {/* Row 1 */}
        <div className="marquee-row">
          <div className="marquee marquee-anim-left">
            {strip.map((c, i) => (
              <div
                key={`r1-${c.id}-${i}`}
                className="logo-tile"
                style={{
                  width: `${10 * scale}rem`,
                  height: `${5 * scale}rem`,
                }}
              >
                {c.logo?.id && (
                  <img
                    className="logo-img"
                    src={`${base}/assets/${c.logo.id}`}
                    alt={c.name}
                    loading="lazy"
                    style={{
                      width: `${8 * scale}rem`,
                      height: "auto",
                      maxHeight: `${3.5 * scale}rem`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="marquee-row">
          <div className="marquee marquee-anim-right">
            {strip.map((c, i) => (
              <div
                key={`r2-${c.id}-${i}`}
                className="logo-tile"
                style={{
                  width: `${10 * scale}rem`,
                  height: `${5 * scale}rem`,
                }}
              >
                {c.logo?.id && (
                  <img
                    className="logo-img"
                    src={`${base}/assets/${c.logo.id}`}
                    alt={c.name}
                    loading="lazy"
                    style={{
                      width: `${8 * scale}rem`,
                      height: "auto",
                      maxHeight: `${3.5 * scale}rem`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
