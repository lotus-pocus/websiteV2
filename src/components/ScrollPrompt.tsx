import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ScrollPrompt = () => {
  const handleScroll = () => {
  const target = document.getElementById("services");
  if (target) {
    const yOffset = 200; // Adjust this value (in pixels) to scroll further
    const y =
      target.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [10, 0, 10] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-center my-16"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="inline-flex flex-col items-center cursor-pointer group relative z-10"
        onClick={handleScroll} // ✅ Add this line
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-2"
        >
          <ChevronDown className="w-8 h-8 text-pink-500 group-hover:text-yellow-400 transition-colors duration-300" />
        </motion.div>

        <span className="text-sm font-medium tracking-widest bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-transparent bg-clip-text">
          Scroll to explore
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ScrollPrompt;
