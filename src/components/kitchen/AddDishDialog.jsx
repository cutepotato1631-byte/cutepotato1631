import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { CATEGORIES } from "@/lib/shop";
import { ImagePlus, Loader2, Plus } from "lucide-react";

const empty = {
  name: "",
  category: "Mains",
  price: "",
  serves: "",
  prep_time: "",
  description: "",
  image_url: "",
};

export default function AddDishDialog({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      update("image_url", file_url);
    } catch (err) {
      setError(err.message || "Could not upload that photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError("A dish needs a name and a price.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const dish = await base44.entities.Dish.create({
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        serves: form.serves.trim(),
        prep_time: Number(form.prep_time) || 0,
        description: form.description.trim(),
        image_url: form.image_url,
        available: true,
        sort_order: 99,
      });
      onCreated?.(dish);
      setForm(empty);
      setOpen(false);
    } catch (err) {
      setError(err.message || "Could not save the dish.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-full">
          <Plus className="mr-1.5 h-4 w-4" /> Add dish
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add a dish</DialogTitle>
          <DialogDescription>
            It appears on the menu straight away. You can mark it sold out any time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dish-name">Dish name</Label>
            <Input
              id="dish-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Chicken dum biryani"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dish-category">Category</Label>
              <Select value={form.category} onValueChange={(value) => update("category", value)}>
                <SelectTrigger id="dish-category" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dish-price">Price (Rs)</Label>
              <Input
                id="dish-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="850"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dish-serves">Serves</Label>
              <Input
                id="dish-serves"
                value={form.serves}
                onChange={(e) => update("serves", e.target.value)}
                placeholder="Serves 2"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dish-prep">Prep time (min)</Label>
              <Input
                id="dish-prep"
                type="number"
                min="0"
                value={form.prep_time}
                onChange={(e) => update("prep_time", e.target.value)}
                placeholder="45"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dish-desc">Description</Label>
            <Textarea
              id="dish-desc"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What makes it good?"
              rows={3}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-3">
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                {form.image_url ? (
                  <Image
                    src={form.image_url}
                    alt="Dish preview"
                    fittingType="fill"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                )}
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploading ? "Uploading…" : "Upload photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={saving} className="h-11 w-full rounded-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Add to menu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}