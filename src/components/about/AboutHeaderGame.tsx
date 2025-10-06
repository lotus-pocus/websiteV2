import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Maximize2, Minimize2 } from "lucide-react";

/* ---------- Particle burst ---------- */
class ParticleBurst {
  points: THREE.Points;
  life = 1;
  constructor(position: THREE.Vector3, color = 0xffffff) {
    const count = 40;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 0.6;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size: 0.06,
      transparent: true,
      opacity: 1,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.position.copy(position);
  }
}

/* ---------- Game Scene ---------- */
function GameScene({
  scoreRef,
  onGameOver,
  startFlag,
  onReadyText,
  autoFire = false,
  touchMove = false,
  isFullscreen = false,
}: {
  scoreRef: React.MutableRefObject<number>;
  onGameOver: () => void;
  startFlag: boolean;
  onReadyText: (t: string | null) => void;
  autoFire?: boolean;
  touchMove?: boolean;
  isFullscreen?: boolean;
}) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const player = useRef<THREE.Mesh>(null);
  const bullets = useRef<THREE.Mesh[]>([]);
  const asteroids = useRef<THREE.Mesh[]>([]);
  const bursts = useRef<ParticleBurst[]>([]);
  const ready = useRef(true);
  const spawnTimer = useRef(0);
  const fireTimer = useRef(0);
  const gameOverTriggered = useRef(false);

  // Preload sounds
  const shootSound = useRef<HTMLAudioElement>();
  const hitSound = useRef<HTMLAudioElement>();
  const gameOverSound = useRef<HTMLAudioElement>();

  useEffect(() => {
    shootSound.current = new Audio("/sfx/shoot.mp3");
    hitSound.current = new Audio("/sfx/hit.mp3");
    gameOverSound.current = new Audio("/sfx/gameover.mp3");
  }, []);

  /* READY→GO sequence */
  useEffect(() => {
    gameOverTriggered.current = false;
    ready.current = true;
    onReadyText("READY");
    const t1 = setTimeout(() => onReadyText("GO!"), 1500);
    const t2 = setTimeout(() => {
      ready.current = false;
      onReadyText(null);
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [startFlag, onReadyText]);

  const shoot = () => {
    if (ready.current || !player.current || !group.current) return;
    shootSound.current?.cloneNode(true).play();
    const bullet = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xff0055 })
    );
    bullet.position.copy(player.current.position);
    group.current.add(bullet);
    bullets.current.push(bullet);
  };

  /* controls */
  useEffect(() => {
    const touch = (e: TouchEvent) => {
      if (!touchMove) return;
      const x = (e.touches[0].clientX / window.innerWidth) * 10 - 5;
      if (player.current) player.current.position.x = x;
    };
    const key = (e: KeyboardEvent) => {
      if ([" ", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      if (!player.current) return;
      if (e.key === "ArrowLeft") player.current.position.x -= 0.4;
      if (e.key === "ArrowRight") player.current.position.x += 0.4;
      if (e.key === " ") shoot();
    };
    window.addEventListener("touchmove", touch);
    window.addEventListener("keydown", key, { passive: false });
    return () => {
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("keydown", key);
    };
  }, [touchMove]);

  /* create player */
  useEffect(() => {
    if (!group.current) return;
    const ship = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ffcc })
    );
    ship.position.set(0, -3, 0);
    group.current.add(ship);
    player.current = ship;
  }, []);

  /* frame loop */
  useFrame((_, delta) => {
    if (!group.current) return;

    if (autoFire && !ready.current) {
      fireTimer.current += delta;
      if (fireTimer.current > 0.3) {
        fireTimer.current = 0;
        shoot();
      }
    }

    // Spawn asteroids
    if (!ready.current) {
      spawnTimer.current += delta;
      if (spawnTimer.current > 1) {
        spawnTimer.current = 0;

        const vFOV = (camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
        const widthFactor = isFullscreen ? 0.8 : 0.6;
        const width = height * camera.aspect * widthFactor;
        const x = THREE.MathUtils.randFloatSpread(width);

        const size = 0.3 + Math.random() * 0.5;
        let color = 0x00ccff;
        let health = 3;
        if (size < 0.4) {
          color = 0xff00ff;
          health = 1;
        } else if (size < 0.55) {
          color = 0x00ff99;
          health = 2;
        }

        const a = new THREE.Mesh(
          new THREE.DodecahedronGeometry(size, 0),
          new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.9,
          })
        );
        a.position.set(x, 5 + Math.random() * 2, 0);
        (a as any).health = health;
        (a as any).baseColor = color;
        group.current!.add(a);
        asteroids.current.push(a);
      }
    }

    // Move bullets
    bullets.current = bullets.current.filter((b) => {
      b.position.y += 10 * delta;
      if (b.position.y > 6) {
        group.current!.remove(b);
        return false;
      }
      return true;
    });

    // Move asteroids
    asteroids.current = asteroids.current.filter((a) => {
      a.position.y -= 0.8 * delta;
      if (a.position.y < -5 && !gameOverTriggered.current) {
        gameOverTriggered.current = true;
        gameOverSound.current?.play();
        onGameOver();
        return false;
      }
      return true;
    });

    // Bullet ↔ Asteroid
    for (let i = bullets.current.length - 1; i >= 0; i--) {
      const b = bullets.current[i];
      for (let j = asteroids.current.length - 1; j >= 0; j--) {
        const a = asteroids.current[j];
        if (b.position.distanceTo(a.position) < 0.5) {
          const data = a as any;
          data.health -= 1;
          (a.material as THREE.MeshBasicMaterial).color.set(0xffffff);
          setTimeout(() => {
            (a.material as THREE.MeshBasicMaterial).color.set(data.baseColor);
          }, 80);
          hitSound.current?.cloneNode(true).play();
          const burst = new ParticleBurst(a.position.clone(), data.baseColor);
          group.current!.add(burst.points);
          bursts.current.push(burst);
          group.current!.remove(b);
          bullets.current.splice(i, 1);
          if (data.health <= 0) {
            group.current!.remove(a);
            asteroids.current.splice(j, 1);
            scoreRef.current += 100;
          } else a.scale.multiplyScalar(0.9);
          break;
        }
      }
    }

    // Ship ↔ Asteroid
    if (player.current && !gameOverTriggered.current) {
      for (let j = 0; j < asteroids.current.length; j++) {
        const a = asteroids.current[j];
        if (player.current.position.distanceTo(a.position) < 0.6) {
          gameOverTriggered.current = true;
          const burst = new ParticleBurst(player.current.position.clone(), 0xff0055);
          group.current.add(burst.points);
          bursts.current.push(burst);
          group.current.remove(player.current);
          gameOverSound.current?.play();
          onGameOver();
          break;
        }
      }
    }

    // Animate bursts
    bursts.current = bursts.current.filter((b) => {
      b.life -= delta;
      (b.points.material as THREE.PointsMaterial).opacity = Math.max(b.life, 0);
      b.points.position.y += delta * 0.5;
      if (b.life <= 0) {
        group.current!.remove(b.points);
        return false;
      }
      return true;
    });
  });

  return <group ref={group} />;
}

/* ---------- Overlays ---------- */
function ReadyOverlay({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
      <h2 className="text-6xl sm:text-7xl font-['Sixtyfour'] text-white animate-pulse">{text}</h2>
    </div>
  );
}

function GameOverOverlay({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 bg-black/70">
      <h2 className="text-5xl sm:text-6xl font-['Sixtyfour'] text-red-500 mb-6 animate-pulse">
        GAME OVER
      </h2>
      <button
        onClick={onRestart}
        className="px-6 py-2 border border-white text-white font-['Sixtyfour'] text-xs sm:text-sm hover:bg-white hover:text-black transition-all"
      >
        RESTART
      </button>
    </div>
  );
}

/* ---------- Wrapper ---------- */
export default function AboutHeaderGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [readyText, setReadyText] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scoreRef = useRef(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setIsMobile(window.innerWidth < 768), []);

  // Score loop
  useEffect(() => {
    let id: number;
    const loop = () => {
      setScore(scoreRef.current);
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(id);
  }, []);

  const startGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setPlaying(true);
    setCanvasKey((k) => k + 1);
  };

  const restartGame = () => {
    // Update high score if current score is greater
    if (scoreRef.current > highScore) setHighScore(scoreRef.current);
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setCanvasKey((k) => k + 1);
  };

  const toggleFullscreen = async () => {
    const el = gameContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <section className="relative w-full bg-black text-white overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Sixtyfour&display=swap" rel="stylesheet" />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_3px]" />

      <div
        ref={gameContainerRef}
        className="relative w-full h-[220px] sm:h-[280px] flex flex-col items-center justify-center text-center"
      >
        {!playing && (
          <div className="flex flex-col items-center select-none">
            <h2
              onClick={startGame}
              className="text-4xl sm:text-7xl font-['Sixtyfour'] text-pink-500 hover:text-white cursor-pointer drop-shadow-[0_0_10px_#ff00ff] transition-all animate-pulse"
            >
              ▶ PLAY
            </h2>
            <p className="mt-3 text-yellow-400 font-['Sixtyfour'] text-xs sm:text-sm animate-pulse">
              INSERT COIN 💰
            </p>
            {!isMobile && (
              <p className="mt-2 text-gray-400 font-['Sixtyfour'] text-[10px] sm:text-xs">
                Use ← → arrow keys to move | SPACEBAR to fire
              </p>
            )}
          </div>
        )}

        {playing && (
          <>
            <Canvas key={canvasKey} camera={{ position: [0, 0, 8], fov: 75 }}>
              <color attach="background" args={["#000000"]} />
              <ambientLight intensity={1} />
              <GameScene
                scoreRef={scoreRef}
                onGameOver={() => setGameOver(true)}
                startFlag={canvasKey}
                onReadyText={setReadyText}
                autoFire={isMobile}
                touchMove={isMobile}
                isFullscreen={isFullscreen}
              />
            </Canvas>

            {readyText && <ReadyOverlay text={readyText} />}
            {gameOver && <GameOverOverlay onRestart={restartGame} />}

            {/* SCORE + HIGH SCORE */}
            <div className="absolute top-3 right-16 sm:right-20 z-10 font-['Sixtyfour'] text-xs sm:text-sm animate-pulse text-pink-500 drop-shadow-[0_0_5px_#ff00ff] flex gap-3">
              <div className="bg-black/60 px-2 py-1 rounded border border-pink-400 shadow-[0_0_15px_#ff00ff]">
                SCORE: {score}
              </div>
              <div className="bg-black/60 px-2 py-1 rounded border border-cyan-400 shadow-[0_0_15px_#00ffff]">
                HIGH: {highScore}
              </div>
            </div>

            {/* FULLSCREEN ICON - bottom-right */}
            <div className="absolute bottom-3 right-3 z-10 text-right">
              <button
                onClick={toggleFullscreen}
                className="p-1 bg-black/60 rounded border border-white hover:bg-white hover:text-black transition"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              {isFullscreen && (
                <p className="mt-1 text-[10px] sm:text-xs text-gray-400 font-['Sixtyfour'] opacity-70 text-right">
                  Press ESC or click icon to exit
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="w-full border-t border-white opacity-70" />

      
    </section>
  );
}
