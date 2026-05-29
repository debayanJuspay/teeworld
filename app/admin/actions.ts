"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

async function verifyAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

function getFormValue(formData: FormData, key: string): string | null {
  return (formData.get(key) as string) || (formData.get(`1_${key}`) as string) || null;
}

// Product actions
export async function createProduct(formData: FormData) {
  await verifyAdmin();
  const service = createServiceClient();

  const title = getFormValue(formData, "title");
  const description = getFormValue(formData, "description");
  const priceRaw = getFormValue(formData, "price");
  const price = priceRaw ? parseFloat(priceRaw) : NaN;
  const originalPriceRaw = getFormValue(formData, "original_price");
  const original_price = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const imageUrlsRaw = getFormValue(formData, "image_urls");
  const image_urls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];
  const stockRaw = getFormValue(formData, "stock");
  const stock = stockRaw ? parseInt(stockRaw) : 0;
  const sizesRaw = getFormValue(formData, "sizes");
  const sizes = sizesRaw ? sizesRaw.split(",").map((s) => s.trim()) : ["S", "M", "L", "XL"];
  const colorsRaw = getFormValue(formData, "colors");
  const colors = colorsRaw ? colorsRaw.split(",").map((s) => s.trim()) : ["Black", "White", "Gray"];
  const status = getFormValue(formData, "status") || "active";

  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");
  if (Number.isNaN(price)) throw new Error("Price is required");

  const { error } = await service.from("products").insert({
    title,
    description,
    price,
    original_price,
    image_urls,
    stock,
    sizes,
    colors,
    status,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
  await verifyAdmin();
  const service = createServiceClient();

  const title = getFormValue(formData, "title");
  const description = getFormValue(formData, "description");
  const priceRaw = getFormValue(formData, "price");
  const price = priceRaw ? parseFloat(priceRaw) : NaN;
  const originalPriceRaw = getFormValue(formData, "original_price");
  const original_price = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const imageUrlsRaw = getFormValue(formData, "image_urls");
  const image_urls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];
  const stockRaw = getFormValue(formData, "stock");
  const stock = stockRaw ? parseInt(stockRaw) : 0;
  const sizesRaw = getFormValue(formData, "sizes");
  const sizes = sizesRaw ? sizesRaw.split(",").map((s) => s.trim()) : ["S", "M", "L", "XL"];
  const colorsRaw = getFormValue(formData, "colors");
  const colors = colorsRaw ? colorsRaw.split(",").map((s) => s.trim()) : ["Black", "White", "Gray"];
  const status = getFormValue(formData, "status") || "active";

  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");
  if (Number.isNaN(price)) throw new Error("Price is required");

  const { error } = await service
    .from("products")
    .update({
      title,
      description,
      price,
      original_price,
      image_urls,
      stock,
      sizes,
      colors,
      status,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await verifyAdmin();
  const service = createServiceClient();

  // Fetch product to get images before deletion
  const { data: product } = await service
    .from("products")
    .select("image_urls")
    .eq("id", id)
    .single();

  // Delete images from storage
  if (product?.image_urls && product.image_urls.length > 0) {
    const paths = product.image_urls
      .map((url: string) => {
        try {
          const pathname = new URL(url).pathname;
          const segments = pathname.split("/");
          // URLs are like /storage/v1/object/public/tees/<filename>
          const bucketIndex = segments.indexOf("tees");
          if (bucketIndex !== -1 && bucketIndex < segments.length - 1) {
            return segments.slice(bucketIndex + 1).join("/");
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((p: string | null): p is string => p !== null);

    if (paths.length > 0) {
      await service.storage.from("tees").remove(paths);
    }
  }

  const { error } = await service.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

// Order actions
export async function updateOrderStatus(orderId: string, status: string) {
  await verifyAdmin();
  const service = createServiceClient();

  const { error } = await service
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
}
