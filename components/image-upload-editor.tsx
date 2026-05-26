"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadEditorProps {
  name?: string;
  initialImages?: string[];
  onChange?: (images: string[]) => void;
}

export default function ImageUploadEditor({
  name = "image_urls",
  initialImages = [],
  onChange,
}: ImageUploadEditorProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImages = useCallback(
    (newImages: string[]) => {
      setImages(newImages);
      onChange?.(newImages);
    },
    [onChange]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

        const { error } = await supabase.storage
          .from("tees")
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          continue;
        }

        const { data } = supabase.storage
          .from("tees")
          .getPublicUrl(filename);

        newUrls.push(data.publicUrl);
      }

      updateImages([...images, ...newUrls]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    updateImages(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    setDragOverIndex(null);

    if (dragIndex === dropIndex || Number.isNaN(dragIndex)) return;

    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, removed);
    updateImages(newImages);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        ref={fileInputRef}
      />

      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragLeave={handleDragLeave}
              className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-colors ${
                dragOverIndex === index
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
            >
              <div className="relative h-24 w-24">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[10px] font-medium">
                {index + 1}
              </div>
              <div className="absolute top-1 left-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3 text-white drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" /> Add Images
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Drag thumbnails to reorder. First image is the primary display image.
      </p>
    </div>
  );
}
