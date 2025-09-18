import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 100; // adjust to match your header height
const MAX_ATTEMPTS = 20;
const INTERVAL = 300; // ms

export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }

    const id = hash.replace("#", "");
    console.log("[ScrollToHash] Trying to scroll to:", id);

    const scrollToEl = () => {
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        console.log(
          "[ScrollToHash] Found element #" + id,
          "scrolling to:",
          y
        );
        window.scrollTo({ top: y, behavior: "smooth" });
        return true;
      }
      return false;
    };

    if (!scrollToEl()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (scrollToEl() || attempts > MAX_ATTEMPTS) {
          clearInterval(interval);
        } else {
          console.log("[ScrollToHash] Retrying... attempt", attempts);
        }
      }, INTERVAL);
    }
  }, [hash]);

  return null;
}
