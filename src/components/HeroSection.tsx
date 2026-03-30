import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        <img src={logo} alt="BOOMER OFF" className="h-24 md:h-32 mx-auto mb-8" />
        <h1 className="font-display text-4xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
          BOOMER OFF
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-foreground font-display tracking-wider">
          与时光重逢，发现日常惊喜。
        </p>
        <p className="mt-2 text-sm text-muted-foreground italic tracking-wide">
          Reunite with Time, Discover Everyday Surprises.
        </p>
        <p className="mt-8 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
          国内首家标准化中古杂货铺，为全年龄段的你，打造一个充满惊喜的宝藏世界。
        </p>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
