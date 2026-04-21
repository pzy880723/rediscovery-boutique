import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setImages(data);
      });
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-20 md:py-28 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">店内一隅</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            走进 BOOMER OFF
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group relative overflow-hidden rounded-md bg-muted aspect-[3/4]"
            >
              <img
                src={img.image_url}
                alt={img.caption || "BOOMER OFF 门店"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs md:text-sm">{img.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
