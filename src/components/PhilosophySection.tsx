import { motion } from "framer-motion";
import { Heart, Recycle, Clock, Sparkles, Coins } from "lucide-react";

const philosophies = [
  {
    icon: Heart,
    title: "情绪价值",
    desc: "每一件旧物，都承载着一段独一无二的记忆。我们相信，它们传递的不仅是物品本身，更是一份温暖的情感共鸣。",
  },
  {
    icon: Recycle,
    title: "环保循环",
    desc: "在快速消费的时代，我们选择慢下来。通过循环利用，让闲置的物品重获价值，是对地球最温柔的回应。",
  },
  {
    icon: Clock,
    title: "情怀之美",
    desc: "从童年的玩具到经典的黑胶，这里是连接过去与现在的时光隧道。我们珍视每一份情怀，让美好的记忆触手可及。",
  },
  {
    icon: Sparkles,
    title: "发现惊喜",
    desc: "BOOMER OFF 是一个充满未知的宝藏盒。我们鼓励您在琳琅满目的商品中自由探索，享受每一次转角遇到的意外之喜。",
  },
  {
    icon: Coins,
    title: "亲民价格",
    desc: "我们相信，美好不应昂贵。通过我们的全球供应链，为您提供价格合理的优质中古商品，让每个人都能轻松拥有心头好。",
  },
];

const PhilosophySection = () => {
  return (
    <section id="philosophy" className="py-24 md:py-32 px-6 bg-[hsl(30,20%,95%)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-primary uppercase mb-2">私たちの理念</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            我们相信
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {philosophies.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-xl bg-white/70 backdrop-blur-sm border border-[hsl(30,15%,88%)] hover:shadow-lg hover:bg-white/90 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
