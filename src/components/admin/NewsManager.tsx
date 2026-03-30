import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";

type NewsItem = {
  id: string;
  title: string;
  content: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState({ title: "", content: "", cover_image_url: "", is_published: false });

  const fetchNews = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (data) setNews(data);
  };

  useEffect(() => { fetchNews(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", content: "", cover_image_url: "", is_published: false });
    setOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content || "", cover_image_url: n.cover_image_url || "", is_published: n.is_published });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("请输入标题"); return; }
    const payload = {
      ...form,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from("news").update(payload).eq("id", editing.id);
      toast.success("已更新");
    } else {
      await supabase.from("news").insert(payload);
      toast.success("已发布");
    }
    setOpen(false);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    await supabase.from("news").delete().eq("id", id);
    toast.success("已删除");
    fetchNews();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">新闻公告</CardTitle>
        <Button size="sm" onClick={openNew} className="gap-1"><Plus className="w-4 h-4" />发布</Button>
      </CardHeader>
      <CardContent>
        {news.length === 0 && <p className="text-sm text-muted-foreground">暂无新闻</p>}
        <div className="space-y-3">
          {news.map((n) => (
            <div key={n.id} className="flex items-center gap-4 p-3 border rounded-lg">
              {n.cover_image_url ? <img src={n.cover_image_url} alt={n.title} className="h-16 w-24 rounded object-cover" /> : <div className="h-16 w-24 rounded bg-muted" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{n.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {n.is_published ? <><Eye className="w-3 h-3" />已发布</> : <><EyeOff className="w-3 h-3" />草稿</>}
                  {" · "}{new Date(n.created_at).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(n)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(n.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "编辑" : "发布新闻"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>标题</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><Label>封面图</Label><ImageUpload value={form.cover_image_url} onChange={url => setForm({...form, cover_image_url: url})} folder="news" /></div>
              <div><Label>内容</Label><Textarea rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={v => setForm({...form, is_published: v})} /><Label>立即发布</Label></div>
              <Button onClick={handleSave} className="w-full">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default NewsManager;
