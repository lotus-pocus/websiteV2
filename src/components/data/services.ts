// src/components/data/services.ts  ← if that's the actual path
export type Service = {
  title: string;
  description: string;
  image: string;
  video?: string;
  category: string;
};

const S3_BASE = "https://lotus-media-store.s3.eu-north-1.amazonaws.com/websiteV2/public";

export const services: Service[] = [
  {
    title: "VR Experiences",
    category: "VR Experiences",
    description: "From educational tools to training simulations and congress content, we build rich, headset-ready worlds.",
    image: `${S3_BASE}/images/bioscience_neutrophil.png`,
    video: `${S3_BASE}/videos/bioscience.mp4`,
  },
  {
    title: "AR Campaigns",
    category: "AR Campaigns",
    description: "Interactive AR for retail, marketing, and brand activations — delightful, dynamic, and always on-message.",
    image: `${S3_BASE}/images/AR.jpg`,
    video: `${S3_BASE}/videos/AR_video.mp4`,
  },
  {
    title: "Interactive Games",
    category: "Interactive Games",
    description: "We’ve built games using full-body sensors for retail and event spaces — intuitive, fun, and crowd-ready.",
    image: `${S3_BASE}/images/interactive.jpg`,
    video: `${S3_BASE}/videos/interactive_games.mp4`,
  },
  {
    title: "WebGL / WebGPU",
    category: "WebGL / WebGPU",
    description: "We create browser-native 3D experiences that bring products and ideas to life — no download needed.",
    image: `${S3_BASE}/images/webGL.jpg`,
    video: `${S3_BASE}/videos/webGL.mp4`,
  },
  {
    title: "Immersive Training",
    category: "Immersive Training",
    description: "Immersive training, a different way to engage and participate.",
    image: `${S3_BASE}/images/immersiveTraining.jpg`,
    video: `${S3_BASE}/videos/immersiveTraining.mp4`,
  },
  {
    title: "cgi, motion-graphics & video-editing",
    category: "cgi-motion-graphics-video-editing",
    description: "Beat the buzzer, Spin to Win, engaging and fun mobile or PC games designed to make you want to beat your score.",
    image: `${S3_BASE}/images/instantWin.png`,
    video: `${S3_BASE}/videos/instantWin.mp4`,
  },
];
