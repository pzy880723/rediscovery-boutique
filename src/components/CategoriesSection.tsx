import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const fallbackGradients = [
  { gradient: "from-rose-900/80 via-rose-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-rose-200 to-amber-100" },
  { gradient: "from-sky-900/80 via-slate-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-sky-200 to-slate-100" },
  { gradient: "from-amber-900/80 via-yellow-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-amber-200 to-orange-100" },
  { gradient: "from-stone-900/80 via-neutral-800/60 to-zinc-900/80", bg: "bg-gradient-to-br from-stone-300 to-neutral-200" },
  { gradient: "from-indigo-900/80 via-blue-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-indigo-200 to-blue-100" },
  { gradient: "from-pink-900/80 via-rose-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-pink-200 to-rose-100" },
  { gradient: "from-violet-900/80 via-purple-800/60 to-stone-900/80", bg: "bg-gradient-to-br from-violet-200 to-purple-100" },
];

type Category = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return (
    <section id="categories" className="bg-background">
      <div className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">取扱商品</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            时间的宝藏
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            在 BOOMER OFF，超过 30,000 件独一无二的商品每日更新，等待你的探索。
          </p>
        </motion.div>
      </div>

      {categories.map((cat, i) => {
        const fallback = fallbackGradients[i % fallbackGradients.length];
        const hasImage = !!cat.image_url;

        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className={`relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center ${!hasImage ? fallback.bg : ""}`}
            style={hasImage ? { backgroundImage: `url(${cat.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            <div className={`absolute inset-0 ${hasImage ? "bg-black/50" : `bg-gradient-to-t ${fallback.gradient}`}`} />

            <div className="relative z-10 text-center px-6 max-w-2xl">
              <p className="text-xs tracking-[0.3em] text-white/60 uppercase mb-3">
                {cat.subtitle}
              </p>
              <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                {cat.title}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                {cat.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default CategoriesSection;
