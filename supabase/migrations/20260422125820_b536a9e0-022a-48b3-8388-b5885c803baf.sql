-- Achievements 战绩数据条
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sublabel TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active achievements" ON public.achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Experience items 空间体验装置
CREATE TABLE public.experience_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Sparkles',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experience_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active experience items" ON public.experience_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage experience items" ON public.experience_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_experience_items_updated_at BEFORE UPDATE ON public.experience_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audience segments 客群画像
CREATE TABLE public.audience_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  preference TEXT DEFAULT '',
  scene TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'User',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active audience segments" ON public.audience_segments FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage audience segments" ON public.audience_segments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_audience_segments_updated_at BEFORE UPDATE ON public.audience_segments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Press quotes 媒体口碑
CREATE TABLE public.press_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_name TEXT NOT NULL,
  quote_original TEXT NOT NULL,
  quote_translation TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.press_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active press quotes" ON public.press_quotes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage press quotes" ON public.press_quotes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_press_quotes_updated_at BEFORE UPDATE ON public.press_quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Brand matrix 品牌矩阵店型
CREATE TABLE public.brand_matrix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_type TEXT NOT NULL,
  area TEXT NOT NULL,
  positioning TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_launched BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brand_matrix ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active brand matrix" ON public.brand_matrix FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage brand matrix" ON public.brand_matrix FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_brand_matrix_updated_at BEFORE UPDATE ON public.brand_matrix FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partnership info 招商合作信息（设计为单条记录）
CREATE TABLE public.partnership_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_name TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  experience_center_address TEXT DEFAULT '',
  intro TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.partnership_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active partnership info" ON public.partnership_info FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage partnership info" ON public.partnership_info FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_partnership_info_updated_at BEFORE UPDATE ON public.partnership_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 种子数据
INSERT INTO public.achievements (label, value, sublabel, sort_order) VALUES
  ('大众点评·南京西路', '#1', '商圈排名第一', 10),
  ('大众点评·静安区', '#1', '区域排名第一', 20),
  ('全网曝光', '300万+', '零付费推广', 30),
  ('累计客流', '10万+', '人次到店', 40),
  ('月均收藏打卡', '1,000+', 'DIY 互动驱动', 50);

INSERT INTO public.experience_items (title, subtitle, description, icon_name, sort_order) VALUES
  ('大通 Diatone 唱片机', '听觉沉浸', '日本大通 Diatone 立式黑胶唱片机，全程播放昭和经典，把顾客从喧嚣商场拉入旧时光的世界。', 'Disc3', 10),
  ('巨型 Gameboy 装置', '互动体验', '可实际操作的巨大 Gameboy，无论 80/90/00 后都会被吸引驻足，是社交媒体高频打卡点。', 'Gamepad2', 20),
  ('佐藤象店头', '视觉地标', '日本中古文化最具辨识度的橘色大象，路过即认得，是 BOOMER OFF 的"无声招牌"和合影第一站。', 'Sparkles', 30),
  ('DIY 冰箱贴体验', '参与式体验', '点评收藏打卡即送一次 DIY 机会，亲手制作专属中古 IP 冰箱贴，把"时间的礼物"带回家。', 'Hammer', 40);

INSERT INTO public.audience_segments (name, preference, scene, icon_name, sort_order) VALUES
  ('儿童', '玩具 IP（哆啦A梦/面包超人/三丽鸥）', '在翻筐乐中淘到属于自己的童年宝藏', 'Baby', 10),
  ('青少年', '毛绒挂件、卡通瓷器、二次元周边', '初中生专程来店淘黑胶唱片', 'Smile', 20),
  ('都市白领', 'CCD 相机、随身听、复古配饰', '白领特别喜欢日本瓷器，每周必到', 'Briefcase', 30),
  ('中年群体', '黑胶唱片、数码设备、铁壶摆件', '父母带孩子一起来，各有所爱', 'Users', 40),
  ('老年群体', '瓷器、线香、丝巾手帕', '70 多岁的老奶奶每周都来买毛绒玩具', 'Heart', 50);

INSERT INTO public.press_quotes (media_name, quote_original, quote_translation, sort_order) VALUES
  ('SmartShanghai', 'It''s not the kind of place you walk through in five minutes. You have to take your time and dig a little.', '这不是那种五分钟就能逛完的店。你需要慢下来，仔细翻找。', 10),
  ('SmartShanghai', 'Easy to stop by, and easy to end up staying longer than planned.', '很容易路过就走进去，也很容易待得比计划中久得多。', 20);

INSERT INTO public.brand_matrix (store_type, area, positioning, description, is_launched, sort_order) VALUES
  ('BOOMER OFF Vintage', '80-100㎡', '标准商场店（核心产品）', '全品类中古杂货铺，已验证的流量模型，快速复制的核心店型', true, 10),
  ('BOOMER OFF Home', '80-150㎡', '家居垂直品类店', '瓷器、毛巾、丝巾、摆件、装饰画、家具、线香、日用品', false, 20),
  ('BOOMER OFF Hobby', '80-150㎡', '兴趣爱好垂直品类店', '玩具、卡牌、手办、二次元、黑胶、CD、磁带、书籍', false, 30),
  ('BOOMER OFF Collection', '80-200㎡', '高端二奢精品店', '一线高端商场，时尚箱包、服饰配件、高端收藏，定位送礼与个人收藏', false, 40),
  ('BOOMER OFF Digital', '80-150㎡', '数码家电专营店', '中古数码、二手家电、手机设备、3C 配件全品类', false, 50),
  ('BOOMER OFF NB', '30-60㎡', '社区店', '辐射社区，二手寄售 + 自营中古，社区居民歇脚聊天的温暖据点', false, 60),
  ('BOOMER OFF Plus', '1,000㎡+', '大型特卖店', '郊区选址，承接连锁滞销最终清仓出口，SKU 极丰富', false, 70);

INSERT INTO public.partnership_info (conditions, contact_name, contact_phone, experience_center_address, intro) VALUES
  (
    '[
      {"label":"目标面积","value":"80 - 100 ㎡"},
      {"label":"楼层要求","value":"B1 层或 1F（高人流量楼层）"},
      {"label":"铺位条件","value":"要求有基础装修，暂不接受毛胚铺位"},
      {"label":"工程条件","value":"常规商业用电、网络接入即可，无特殊排烟/上下水需求"},
      {"label":"合作模式","value":"销售额扣点模式，与品牌深度利益绑定"}
    ]'::jsonb,
    '潘瞻远',
    '18657433310',
    '上海市闵行区光华路 728 号 728Space C5 栋 3 楼',
    '我们正在寻找志同道合的合作伙伴——商业地产、投资机构或加盟商，共同将这套已验证的流量模型复制到更多城市。'
  );