import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FLOWERS = [
  "redflower.png",
  "blueflower.png",
  "pinkflower.png",
  "yellowflower.png",
  "butterfly.png",
  "bee.png",
  "leaves.png",
];

type Flower = {
  id: number;
  x: number;
  y: number;
  image: string;
};

type FlowerTrailProps = {
  cursor: { x: number; y: number };
};

export default function FlowerTrail({ cursor }: FlowerTrailProps) {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    let idCounter = 0;
    let lastTime = 0;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 80) return;
      lastTime = now;

      const flower: Flower = {
        id: idCounter++,
        x: e.clientX,
        y: e.clientY,
        image: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
      };

      setFlowers((prev) => [...prev, flower]);

      setTimeout(() => {
        setFlowers((prev) => prev.filter((f) => f.id !== flower.id));
      }, 20000);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {flowers.map((flower) => {
        // Vector away from cursor if close
        const dx = flower.x - cursor.x;
        const dy = flower.y - cursor.y;
        const repelDistance = Math.sqrt(dx * dx + dy * dy);
        const repel = repelDistance < 300;

        const angle = Math.random() * 2 * Math.PI;
        const driftDistance = Math.random() * 200 + 100;
        const offsetX = repel ? dx * 2 : Math.cos(angle) * driftDistance;
        const offsetY = repel ? dy * 2 : Math.sin(angle) * driftDistance;

        return (
          <motion.img
            key={flower.id}
            src={`/flowers/${flower.image}`}
            className="fixed w-8 h-8 pointer-events-none z-[10000] select-none"
            style={{
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              x: flower.x,
              y: flower.y,
              scale: 0.3,
              opacity: 1,
              rotate: Math.random() * 720 - 360, // Starts somewhere between -360 and +360
            }}
            animate={{
              x: flower.x + offsetX,
              y: flower.y + offsetY,
              scale: 3,
              opacity: 0,
              rotate: Math.random() * 1080 + 360,
            }}
            transition={{
              x: { duration: 5 },
              y: { duration: 5 },
              scale: { duration: 5 },
              rotate: { duration: 5 },
              opacity: { delay: 4.5, duration: 2 }, // fade out later
            }}
          />
        );
      })}
    </>
  );
}
