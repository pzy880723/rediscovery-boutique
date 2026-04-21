import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
};

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({
    image_url: "",
    caption: "",
    is_active: true,
    sort_order: 0,
  });

  const fetchItems = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      image_url: "",
      caption: "",
      is_active: true,
      sort_order: items.length + 1,
    });
    setOpen(true);
  };

  const openEdit = (item: GalleryImage) => {
    setEditing(item);
    setForm({
      image_url: item.image_url,
      caption: item.caption || "",
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast.error("请上传图片");
      return;
    }
    if (editing) {
      await supabase.from("gallery_images").update(form).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("gallery_images").insert(form);
      toast.success("已添加");
    }
    setOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这张图片？")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    toast.success("已删除");
    fetchItems();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    await Promise.all([
      supabase.from("gallery_images").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("gallery_images").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchItems();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">门店图库（"我们的故事"下方展示）</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1">
          <Plus className="w-4 h-4" />
          添加图片
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">暂无图片</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div key={item.id} className="border rounded-lg overflow-hidden bg-background">
              <div className="aspect-[3/4] bg-muted">
                <img
                  src={item.image_url}
                  alt={item.caption || ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 space-y-2">
                <p className="text-xs truncate">{item.caption || "（无说明）"}</p>
                <p className="text-xs text-muted-foreground">
                  排序 {item.sort_order} · {item.is_active ? "显示" : "隐藏"}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 ml-auto"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "编辑图片" : "添加图片"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>图片（建议竖版 3:4）</Label>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="gallery"
                />
              </div>
              <div>
                <Label>图片说明（可选）</Label>
                <Input
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="如：黑胶唱片区"
                />
              </div>
              <div>
                <Label>排序（数字越小越靠前）</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <Label>在前台显示</Label>
              </div>
              <Button onClick={handleSave} className="w-full">
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GalleryManager;
