// src/pages/Interactive.tsx
import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import AsteroidGHeader from "../components/AsteroidGHeader";

const Interactive = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 🔒 Lock page scroll so wheel only affects iframe
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      if (iframeRef.current) {
        e.preventDefault();
        iframeRef.current.contentWindow?.scrollBy(0, e.deltaY);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalOverflow;
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <Layout>
      <div className="relative w-full bg-black text-white overflow-hidden flex flex-col">
        {/* 🔝 Header (fixed 80 px) */}
        <div className="flex-shrink-0">
          <AsteroidGHeader />
        </div>

        {/* 🎮 Iframe fills space between header & footer with extra breathing room */}
        <div
          className="flex-grow overflow-hidden"
          style={{
            height: "calc(100vh - 60px - 110px)", // 80 header + 130 footer space
            marginTop: "80px",                    // push iframe slightly down
            marginBottom: "0px",                 // spacing above footer
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://www.gamoola.com/gamoola/desktop/"
            title="Gamoola Interactive Showcase"
            className={`w-full h-full border-0 transition-opacity duration-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            allow="fullscreen; autoplay; xr-spatial-tracking; camera; microphone"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Interactive;
