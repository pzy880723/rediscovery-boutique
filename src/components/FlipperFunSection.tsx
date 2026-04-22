import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FlipperFunSection = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs tracking-[0.2em] uppercase mb-4">
            <Sparkles className="w-3 h-3" /> 子品牌 Sub Brand
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-3">
            翻筐乐
          </h2>
          <p className="font-display text-base md:text-lg opacity-90 mb-8 tracking-wide">
            Flipper Fun · 寻宝从这里开始
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { value: "¥6.9", label: "起", sub: "极低消费门槛" },
              { value: "100+", label: "木筐", sub: "海量孤品自由翻找" },
              { value: "45-90", label: "分钟", sub: "平均停留时长" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-lg p-5 bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <p className="font-display text-3xl md:text-5xl font-bold mb-1">
                  {stat.value}
                  <span className="text-base md:text-lg font-medium opacity-80 ml-1">{stat.label}</span>
                </p>
                <p className="text-xs md:text-sm opacity-80">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm md:text-base max-w-xl mx-auto opacity-90 leading-relaxed">
            统一低价策略，海量小物件集中在木筐中供顾客自由翻找。<br className="hidden md:block" />
            社交媒体上自发的翻筐视频，构成了 BOOMER OFF 最强大的 UGC 内容矩阵。
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FlipperFunSection;
