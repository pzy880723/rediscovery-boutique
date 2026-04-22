import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl"
      >
        <p className="font-display text-2xl md:text-4xl text-white tracking-wider font-bold">
          虽古但新，信任可见。
        </p>
        <p className="mt-3 text-sm text-white/70 italic tracking-wide">
          Reunite with Time, Discover Everyday Surprises.
        </p>
        <p className="mt-8 text-sm md:text-base text-white/85 leading-relaxed max-w-lg mx-auto">
          国内首家标准化中古连锁店，为全年龄段的你，打造一个充满惊喜的宝藏世界。
        </p>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 z-10 text-white/60 hover:text-white transition-colors"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
