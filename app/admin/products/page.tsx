import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductsClient from "./products-client";

export const metadata = {
  title: "Manage Products - TeeWorld Admin",
};

export default async function AdminProductsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductsClient initialProducts={products || []} />;
}
