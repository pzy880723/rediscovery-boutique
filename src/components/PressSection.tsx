import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PressQuote = {
  id: string;
  media_name: string;
  quote_original: string;
  quote_translation: string | null;
  link_url: string | null;
};

const KEYWORDS = [
  "稀缺性", "沉浸式体验", "治愈感", "性价比", "出片好看", "有品位",
];

const PressSection = () => {
  const [quotes, setQuotes] = useState<PressQuote[]>([]);

  useEffect(() => {
    supabase
      .from("press_quotes")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => data && setQuotes(data));
  }, []);

  return (
    <section className="py-16 md:py-20 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">メディア</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            来自顾客与媒体的声音
          </h2>
        </motion.div>

        {quotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {quotes.map((q, i) => (
              <motion.blockquote
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 md:p-7 rounded-xl bg-card border border-border"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="font-display text-base md:text-lg text-foreground leading-relaxed mb-3 italic">
                  "{q.quote_original}"
                </p>
                {q.quote_translation && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {q.quote_translation}
                  </p>
                )}
                <p className="text-xs tracking-[0.2em] uppercase text-primary mt-4">
                  — {q.media_name}
                </p>
              </motion.blockquote>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">
            用户评价高频关键词
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {KEYWORDS.map((kw) => (
              <span
                key={kw}
                className="px-4 py-1.5 rounded-full text-sm bg-card border border-border text-foreground"
              >
                # {kw}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PressSection;
