import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const standardized = {
  title: "日本标准化中古店",
  subtitle: "如 Book Off",
  pros: ["明码标价", "标准化陈列", "可复制性强"],
  cons: ["缺乏氛围感", "情绪价值低"],
};

const designer = {
  title: "街边设计师中古店",
  subtitle: "主理人个人审美",
  pros: ["设计感强", "氛围出片"],
  cons: ["定价不透明", "依赖主理人"],
};

const DualDNASection = () => {
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
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">ダブル DNA</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            标准化 × 氛围感
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            首创双基因融合模式——既有日式 Book Off 的信任感，又有街边设计师店的情绪价值。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
          {[standardized, designer].map((side, idx) => (
            <motion.div
              key={side.title}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl border border-border bg-secondary ${idx === 1 ? "md:order-3" : ""}`}
            >
              <p className="text-xs text-muted-foreground mb-1">{side.subtitle}</p>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                {side.title}
              </h3>
              <ul className="space-y-2">
                {side.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
                {side.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:order-2 p-8 rounded-xl bg-primary text-primary-foreground text-center shadow-lg"
          >
            <p className="text-xs tracking-[0.2em] uppercase mb-2 opacity-80">
              BOOMER OFF
            </p>
            <h3 className="font-display text-xl md:text-2xl font-bold mb-4">
              融合模式
            </h3>
            <ul className="space-y-2 text-left">
              {[
                "标准化 + 层次感陈列",
                "透明定价 + 6 级评级",
                "沉浸声光 + IP 元素",
                "6.9 元起 极低门槛",
                "可复制可加盟",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DualDNASection;
