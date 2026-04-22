import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";

type Item = {
  id: string;
  slug: string;
  store_type: string;
  area: string;
  positioning: string;
  description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  is_launched: boolean;
  is_active: boolean;
  sort_order: number;
};

type FormState = {
  slug: string;
  store_type: string;
  area: string;
  positioning: string;
  description: string;
  long_description: string;
  cover_image_url: string;
  gallery_urls: string[];
  is_launched: boolean;
  is_active: boolean;
  sort_order: number;
};

const empty: FormState = {
  slug: "", store_type: "", area: "", positioning: "",
  description: "", long_description: "", cover_image_url: "", gallery_urls: [],
  is_launched: false, is_active: true, sort_order: 0,
};

const BrandMatrixManager = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<FormState>(empty);

  const fetchItems = async () => {
    const { data } = await supabase.from("brand_matrix").select("*").order("sort_order");
    if (data) setItems(data as unknown as Item[]);
  };
  useEffect(() => { fetchItems(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: Item) => {
    setEditing(i);
    setForm({
      slug: i.slug || "",
      store_type: i.store_type, area: i.area, positioning: i.positioning,
      description: i.description || "", long_description: i.long_description || "",
      cover_image_url: i.cover_image_url || "",
      gallery_urls: Array.isArray(i.gallery_urls) ? i.gallery_urls : [],
      is_launched: i.is_launched, is_active: i.is_active, sort_order: i.sort_order,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.store_type || !form.area || !form.positioning || !form.slug) {
      toast.error("请填写店型 / 面积 / 定位 / slug");
      return;
    }
    const payload = {
      slug: form.slug,
      store_type: form.store_type,
      area: form.area,
      positioning: form.positioning,
      description: form.description,
      long_description: form.long_description,
      cover_image_url: form.cover_image_url,
      gallery_urls: form.gallery_urls,
      is_launched: form.is_launched,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };
    if (editing) {
      const { error } = await supabase.from("brand_matrix").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("已更新");
    } else {
      const { error } = await supabase.from("brand_matrix").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("已添加");
    }
    setOpen(false); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("brand_matrix").delete().eq("id", id);
    toast.success("已删除"); fetchItems();
  };

  const addGalleryImage = (url: string) => {
    if (url) setForm({ ...form, gallery_urls: [...form.gallery_urls, url] });
  };
  const removeGalleryImage = (idx: number) => {
    setForm({ ...form, gallery_urls: form.gallery_urls.filter((_, i) => i !== idx) });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">品牌矩阵店型</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />添加</Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 && <p className="text-sm text-muted-foreground">暂无店型</p>}
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3 border rounded-lg">
              {it.cover_image_url && (
                <img src={it.cover_image_url} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{it.store_type} <span className="text-xs text-muted-foreground">· {it.area} · /{it.slug}</span></p>
                <p className="text-xs text-primary truncate">{it.positioning}</p>
                <p className="text-xs text-muted-foreground">{it.is_launched ? "营业中" : "筹备中"} · 排序 {it.sort_order} · {it.is_active ? "显示" : "隐藏"}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(it.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "编辑店型" : "添加店型"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>店型名</Label>
                  <Input value={form.store_type} onChange={e => setForm({ ...form, store_type: e.target.value })} />
                </div>
                <div>
                  <Label>Slug（URL，唯一，如 vintage / home）</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>面积</Label><Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} /></div>
                <div><Label>排序</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div><Label>定位</Label><Input value={form.positioning} onChange={e => setForm({ ...form, positioning: e.target.value })} /></div>
              <div><Label>简介（卡片用）</Label><Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>详细介绍（详情页用）</Label><Textarea rows={5} value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} /></div>

              <div>
                <Label>封面图</Label>
                <ImageUpload value={form.cover_image_url} onChange={(url) => setForm({ ...form, cover_image_url: url })} folder="brand-matrix" />
              </div>

              <div>
                <Label>画廊图（多张）</Label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {form.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <ImageUpload value="" onChange={addGalleryImage} folder="brand-matrix" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_launched} onCheckedChange={v => setForm({ ...form, is_launched: v })} /><Label>已上线营业</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} /><Label>显示在网站</Label></div>
              </div>

              <Button onClick={handleSave} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BrandMatrixManager;
