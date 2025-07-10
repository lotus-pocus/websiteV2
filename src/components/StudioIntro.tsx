import { motion } from "framer-motion";

const PunchWord = ({ children }: { children: string }) => (
  <motion.span
    className="inline-block font-semibold text-pink-600 cursor-pointer"
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.3 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    viewport={{ once: true, amount: 0.8 }}
  >
    {children}
  </motion.span>
);

const SpinInWord = ({ children }: { children: string }) => (
  <motion.span
    className="inline-block text-pink-600 font-semibold cursor-pointer"
    initial={{ rotate: -360, scale: 0, opacity: 0 }}
    whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
    whileHover={{
      rotate: 360,
      scale: 1.2,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 15,
      duration: 0.6,
    }}
    viewport={{ once: true, amount: 0.6 }}
  >
    {children}
  </motion.span>
);


const StudioIntro = () => {
  return (
    <div className="pt-5 max-w-3xl mx-auto mb-16 px-4 text-lg leading-relaxed text-gray-700">
      <p className="mb-4">
        We’re a creative studio with <strong>25 years of experience</strong> crafting visual stories, games, and interactions that{" "}
        <PunchWord>engage</PunchWord>, <PunchWord>educate</PunchWord>, and <PunchWord>inspire</PunchWord>.
      </p>
      <p className="mb-4">
        Over the years, we’ve evolved from animation and graphics into <strong>cutting-edge immersive experiences</strong> from VR training tools to retail interactive games and WebGL-powered B2B platforms.
      </p>
      <p className="mb-4">
        We’re <strong>not a big agency</strong>. And that’s a good thing. It means no red tape, no silos... just{" "}
        <SpinInWord>creative agility</SpinInWord> and a team that’s deeply invested in your outcome.
      </p>
      <p>
        Whether it’s a tight turnaround or a technically demanding concept, we bring the experience and energy to{" "}
        <strong>make it work and make it matter!</strong>
      </p>
    </div>
  );
};

export default StudioIntro;
