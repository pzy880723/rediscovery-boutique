import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: "", image_url: "", link_url: "", sort_order: 0, is_active: true });

  const fetchBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    if (data) setBanners(data);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", image_url: "", link_url: "", sort_order: 0, is_active: true });
    setOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, image_url: b.image_url, link_url: b.link_url || "", sort_order: b.sort_order, is_active: b.is_active });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.image_url) { toast.error("请上传图片"); return; }
    if (editing) {
      await supabase.from("banners").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("banners").insert(form);
      toast.success("已添加");
    }
    setOpen(false);
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("已删除");
    fetchBanners();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Banner 管理</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {banners.length === 0 && <p className="text-sm text-muted-foreground">暂无 Banner</p>}
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-3 border rounded-lg">
              {b.image_url && <img src={b.image_url} alt={b.title} className="h-16 w-24 rounded object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{b.title || "无标题"}</p>
                <p className="text-xs text-muted-foreground">排序: {b.sort_order} · {b.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "编辑 Banner" : "添加 Banner"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>标题</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>图片</Label><ImageUpload value={form.image_url} onChange={url => setForm({...form, image_url: url})} folder="banners" /></div>
              <div><Label>链接</Label><Input value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} placeholder="可选" /></div>
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

export default BannerManager;
