// src/components/VideoModal.tsx
import { useEffect } from "react";

interface VideoModalProps {
  src: string | null;
  onClose: () => void;
}

const VideoModal = ({ src, onClose }: VideoModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose} // 👈 close when clicking backdrop
    >
      {/* Stop propagation so clicking inside the video doesn’t close */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // 👈 only block inner clicks
      >
        <button
          className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
          onClick={onClose}
        >
          ✕
        </button>
        <video
          src={src}
          autoPlay
          controls
          className="max-w-[90vw] max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
};

export default VideoModal;
