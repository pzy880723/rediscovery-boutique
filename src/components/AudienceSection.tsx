import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AudienceSegment = {
  id: string;
  name: string;
  preference: string | null;
  scene: string | null;
  icon_name: string | null;
};

const AudienceSection = () => {
  const [items, setItems] = useState<AudienceSegment[]>([]);

  useEffect(() => {
    supabase
      .from("audience_segments")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">全年齢層</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            一家人都能逛
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            从几岁的孩子到八九十岁的老人，每个人都能在这里找到属于自己的那件回忆。
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
          {items.map((item, i) => {
            const IconComp = (Icons[item.icon_name as keyof typeof Icons] as React.ComponentType<{ className?: string }>) || Icons.User;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="text-center p-5 rounded-xl border border-border bg-secondary hover:bg-card hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 leading-snug">
                  {item.preference}
                </p>
                <p className="text-xs text-foreground/70 italic leading-snug">
                  "{item.scene}"
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
