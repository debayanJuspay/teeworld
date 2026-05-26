import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditProductForm from "./edit-product-form";

export const metadata = {
  title: "Edit Product - TeeWorld Admin",
};

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
