import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type MatrixItem = {
  id: string;
  store_type: string;
  area: string;
  positioning: string;
  description: string | null;
  is_launched: boolean;
};

const BrandMatrixSection = () => {
  const [items, setItems] = useState<MatrixItem[]>([]);

  useEffect(() => {
    supabase
      .from("brand_matrix")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">ブランドマトリックス</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            品牌矩阵
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            从核心商场到社区、从平价淘货到高端收藏，构建覆盖全场景的中古生活方式品牌生态。
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 max-w-6xl mx-auto pb-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.06 }}
              className="shrink-0 snap-start w-[78vw] sm:w-[55vw] md:w-[33vw] lg:w-[24vw] max-w-[320px] p-5 md:p-6 rounded-xl border border-border bg-secondary flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {item.area}
                </span>
                {item.is_launched ? (
                  <span className="text-xs text-primary">● 营业中</span>
                ) : (
                  <span className="text-xs text-muted-foreground">○ 筹备中</span>
                )}
              </div>
              <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-1">
                {item.store_type}
              </h3>
              <p className="text-xs text-primary mb-3">{item.positioning}</p>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMatrixSection;
