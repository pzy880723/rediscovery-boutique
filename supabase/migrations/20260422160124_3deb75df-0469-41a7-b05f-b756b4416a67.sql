-- 创建首页区块控制表
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view homepage sections"
  ON public.homepage_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage homepage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 初始化所有首页区块
INSERT INTO public.homepage_sections (section_key, name, description, sort_order) VALUES
  ('hero', '首屏 Hero', '顶部主视觉横幅', 10),
  ('about', '品牌介绍', '关于 BOOMER OFF', 20),
  ('gallery', '画廊', '门店实拍画廊', 30),
  ('achievements', '品牌成就', '核心数据展示', 40),
  ('philosophy', '品牌理念', '虽古但新理念', 50),
  ('dual_dna', '双基因', '双基因模式', 60),
  ('experience', '品牌体验', '四大空间装置', 70),
  ('categories', '商品类目', '中古商品分类', 80),
  ('flipper_fun', '翻筐乐', '翻筐乐玩法', 90),
  ('audience', '目标人群', '客群画像', 100),
  ('press', '媒体口碑', '媒体引用', 110),
  ('stores', '门店信息', '门店列表', 120),
  ('brand_matrix', '品牌矩阵', '7 大店型', 130),
  ('partnership', '招商加盟', '加盟合作', 140);