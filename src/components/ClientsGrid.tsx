import { useEffect, useState } from "react";

type DirectusFile = {
  id: string;
  filename_download: string;
};

type Client = {
  id: number;
  name: string;
  logo?: DirectusFile;
};

type SiteSettings = {
  client_logo_background_color?: string;
  client_logo_scale?: number;
};

const ClientsGrid = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const base = import.meta.env.VITE_DIRECTUS_URL as string;

    // Fetch client logos
    const fetchClients = async () => {
      try {
        const res = await fetch(
          `${base}/items/clients?fields=id,name,logo.id,logo.filename_download`
        );
        const data = await res.json();
        setClients(data.data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };

    // Fetch site settings (singleton)
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${base}/items/site_settings?fields=client_logo_background_color,client_logo_scale`
        );
        const data = await res.json();
        setSettings(data.data?.[0] || {});
      } catch (err) {
        console.error("Failed to fetch site settings:", err);
      }
    };

    fetchClients();
    fetchSettings();
  }, []);

  // Base logo height (in px)
  const BASE_HEIGHT = 48;

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: settings?.client_logo_background_color || "transparent",
      }}
    >
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Trusted by</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
        {clients.map((client) =>
          client.logo ? (
            <div key={client.id} className="flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_DIRECTUS_URL}/assets/${client.logo.id}`}
                alt={client.name}
                style={{
                  height: `${BASE_HEIGHT * (settings?.client_logo_scale || 1)}px`,
                }}
                className="object-contain"
              />
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default ClientsGrid;
