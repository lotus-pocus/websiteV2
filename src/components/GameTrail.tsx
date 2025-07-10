import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GAMES = [
  "android.png",
  "alien.png",
  "star.png",
  "vr.png",
  "joystick.png",
  "controller.png",
  "heart.png",
];

type Game = {
  id: number;
  x: number;
  y: number;
  image: string;
};

type GameTrailProps = {
  cursor: { x: number; y: number };
};

export default function GameTrail({ cursor }: GameTrailProps) {
  const [games, setGames] = useState<Game[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idCounterRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < 500) return;
      lastTimeRef.current = now;

      const game: Game = {
        id: idCounterRef.current++,
        x: e.clientX,
        y: e.clientY,
        image: GAMES[Math.floor(Math.random() * GAMES.length)],
      };

      setGames((prev) => [...prev, game]);

      // 🔉 Softer sound effect on spawn
      if (audioRef.current) {
        audioRef.current.volume = 0.2; // reduce volume to 20%
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setTimeout(() => {
        setGames((prev) => prev.filter((f) => f.id !== game.id));
      }, 20000);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {games.map((game) => {
        const dx = game.x - cursor.x;
        const dy = game.y - cursor.y;
        const repelDistance = Math.sqrt(dx * dx + dy * dy);
        const repel = repelDistance < 300;

        const angle = Math.random() * 2 * Math.PI;
        const driftDistance = Math.random() * 200 + 100;
        const offsetX = repel ? dx * 2 : Math.cos(angle) * driftDistance;
        const offsetY = repel ? dy * 2 : Math.sin(angle) * driftDistance;

        return (
          <motion.img
            key={game.id}
            src={`/games/${game.image}`}
            className="fixed w-8 h-8 pointer-events-none z-[10000] select-none"
            style={{
              left: 0,
              top: 0,
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              x: game.x,
              y: game.y,
              scale: 0.3,
              opacity: 1,
              rotate: Math.random() * 720 - 360,
            }}
            animate={{
              x: game.x + offsetX,
              y: game.y + offsetY,
              scale: 3,
              opacity: 0,
              rotate: Math.random() * 1080 + 360,
            }}
            transition={{
              x: { duration: 5 },
              y: { duration: 5 },
              scale: { duration: 5 },
              rotate: { duration: 5 },
              opacity: { delay: 4.5, duration: 2 },
            }}
          />
        );
      })}
      {/* <audio ref={audioRef} src="/sfx/blip.mp3" preload="auto" /> */}
    </>
  );
}
