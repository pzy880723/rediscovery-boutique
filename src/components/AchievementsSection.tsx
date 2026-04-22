import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Achievement = {
  id: string;
  label: string;
  value: string;
  sublabel: string | null;
};

const AchievementsSection = () => {
  const [items, setItems] = useState<Achievement[]>([]);

  useEffect(() => {
    supabase
      .from("achievements")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-14 md:py-16 px-6 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">実績</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            首店实绩 · 零付费推广
          </h2>
          <p className="text-background/60 text-xs md:text-sm mt-2">
            上海中信泰富广场首店真实运营数据
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center p-4 md:p-5 rounded-lg border border-background/10 bg-background/5"
            >
              <p className="font-display text-2xl md:text-4xl font-bold text-primary mb-1">
                {item.value}
              </p>
              <p className="text-xs md:text-sm font-medium text-background mb-1">
                {item.label}
              </p>
              {item.sublabel && (
                <p className="text-[10px] md:text-xs text-background/50">
                  {item.sublabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
