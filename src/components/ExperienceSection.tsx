import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ExperienceItem = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
};

const ExperienceSection = () => {
  const [items, setItems] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    supabase
      .from("experience_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">空間体験</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            四大空间装置
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            视觉、听觉、互动、参与——让每一个角落都值得停留。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {items.map((item, i) => {
            const IconComp = (Icons[item.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }>) || Icons.Sparkles;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
              >
                {item.image_url ? (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
                    <IconComp className="w-16 h-16 text-primary/40" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComp className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-primary tracking-wider uppercase">
                      {item.subtitle}
                    </p>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
