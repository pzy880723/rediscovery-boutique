import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Section = {
  id: string;
  section_key: string;
  name: string;
  description: string | null;
  is_visible: boolean;
  sort_order: number;
};

const HomepageSectionManager = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("加载失败：" + error.message);
    } else {
      setSections((data ?? []) as Section[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVisible = async (s: Section) => {
    setSavingId(s.id);
    const { error } = await supabase
      .from("homepage_sections")
      .update({ is_visible: !s.is_visible })
      .eq("id", s.id);
    setSavingId(null);
    if (error) {
      toast.error("保存失败：" + error.message);
      return;
    }
    setSections((prev) =>
      prev.map((x) => (x.id === s.id ? { ...x, is_visible: !s.is_visible } : x)),
    );
    toast.success(`已${!s.is_visible ? "显示" : "隐藏"}「${s.name}」`);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const a = sections[index];
    const b = sections[target];
    const newList = [...sections];
    newList[index] = { ...b, sort_order: a.sort_order };
    newList[target] = { ...a, sort_order: b.sort_order };
    setSections(newList);

    const { error: e1 } = await supabase
      .from("homepage_sections")
      .update({ sort_order: b.sort_order })
      .eq("id", a.id);
    const { error: e2 } = await supabase
      .from("homepage_sections")
      .update({ sort_order: a.sort_order })
      .eq("id", b.id);
    if (e1 || e2) {
      toast.error("排序保存失败");
      load();
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        控制前端首页每个区块的显示/隐藏与排序。关闭后该区块在用户访问首页时不会出现。
      </p>
      <div className="space-y-2">
        {sections.map((s, i) => (
          <Card key={s.id} className={s.is_visible ? "" : "opacity-60"}>
            <CardContent className="flex items-center gap-3 p-3 md:p-4">
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="上移"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="下移"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{s.name}</p>
                  {s.is_visible ? (
                    <Eye className="h-3.5 w-3.5 text-primary shrink-0" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                </div>
                {s.description && (
                  <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                )}
                <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">
                  {s.section_key}
                </p>
              </div>
              <Switch
                checked={s.is_visible}
                disabled={savingId === s.id}
                onCheckedChange={() => toggleVisible(s)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomepageSectionManager;
