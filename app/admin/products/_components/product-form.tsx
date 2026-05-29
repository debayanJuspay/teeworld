"use client";

import ImageUploadEditor from "@/components/image-upload-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: FormData) => void;
  submitting: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  submitting,
}: ProductFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={product?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price}
            required
          />
        </div>
        <div>
          <Label htmlFor="original_price">Original Price (₹)</Label>
          <Input
            id="original_price"
            name="original_price"
            type="number"
            step="0.01"
            defaultValue={product?.original_price || ""}
          />
        </div>
      </div>
      <div>
        <Label>Product Images</Label>
        <ImageUploadEditor
          name="image_urls"
          initialImages={product?.image_urls || []}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
            required
          />
        </div>
        <div>
          <Label htmlFor="sizes">Sizes</Label>
          <Input
            id="sizes"
            name="sizes"
            defaultValue={product?.sizes?.join(", ") || "S, M, L, XL"}
            placeholder="S, M, L, XL"
          />
        </div>
        <div>
          <Label htmlFor="colors">Colors</Label>
          <Input
            id="colors"
            name="colors"
            defaultValue={product?.colors?.join(", ") || "Black, White, Gray"}
            placeholder="Black, White, Gray"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={product?.status || "active"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          Draft products are hidden from the storefront.
        </p>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
