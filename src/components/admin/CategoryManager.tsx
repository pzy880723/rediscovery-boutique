import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type Category = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", image_url: "", sort_order: 0, is_active: true });

  const fetch = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data);
  };

  useEffect(() => { fetch(); }, []);

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ title: c.title, subtitle: c.subtitle || "", description: c.description || "", image_url: c.image_url || "", sort_order: c.sort_order, is_active: c.is_active });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await supabase.from("categories").update(form).eq("id", editing.id);
      toast.success("已更新");
    }
    setOpen(false);
    fetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">品类图片管理</CardTitle>
        <p className="text-xs text-muted-foreground">编辑各品类的图片和描述文字</p>
      </CardHeader>
      <CardContent>
        {categories.length === 0 && <p className="text-sm text-muted-foreground">暂无品类数据</p>}
        <div className="space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-3 border rounded-lg">
              {c.image_url ? <img src={c.image_url} alt={c.title} className="h-16 w-24 rounded object-cover" /> : <div className="h-16 w-24 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">无图</div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.subtitle} · 排序: {c.sort_order}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>编辑品类</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>名称</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>英文副标题</Label><Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} /></div>
              <div><Label>描述</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div><Label>图片</Label><ImageUpload value={form.image_url} onChange={url => setForm({...form, image_url: url})} folder="categories" /></div>
              <div><Label>排序</Label><Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)||0})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /><Label>显示</Label></div>
              <Button onClick={handleSave} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
