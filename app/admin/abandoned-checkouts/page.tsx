import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import AbandonedClient from "./abandoned-client";

export const metadata = {
  title: "Abandoned Checkouts - TeeWorld Admin",
};

export default async function AbandonedCheckoutsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const service = createServiceClient();

  const { data: checkouts } = await service
    .from("pending_orders")
    .select("*")
    .neq("status", "captured")
    .order("created_at", { ascending: false });

  return <AbandonedClient checkouts={checkouts || []} />;
}
