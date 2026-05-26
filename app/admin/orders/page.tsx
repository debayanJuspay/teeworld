import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrdersClient from "./orders-client";

export const metadata = {
  title: "Manage Orders - TeeWorld Admin",
};

export default async function AdminOrdersPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .order("created_at", { ascending: false });

  return <OrdersClient initialOrders={orders || []} />;
}
