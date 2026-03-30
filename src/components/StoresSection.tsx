import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Store = {
  id: string;
  name: string;
  address: string;
  feature_tag: string | null;
};

const StoresSection = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    supabase
      .from("stores")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setStores(data);
      });
  }, []);

  return (
    <section id="stores" className="py-24 md:py-32 px-6 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">店舗情報</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            欢迎光临
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            我们期待与你在城市的一角相遇，共同开启一段寻宝之旅。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-xl border border-border p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="font-display text-lg font-bold text-card-foreground mb-4">
                {store.name}
              </h3>
              <div className="flex items-start gap-2 text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{store.address}</span>
              </div>
              {store.feature_tag && (
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                  <Star className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span>{store.feature_tag}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoresSection;
