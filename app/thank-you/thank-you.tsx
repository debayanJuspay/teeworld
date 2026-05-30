"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pendingOrderId = searchParams.get("pending_order_id");
  const [status, setStatus] = useState<"polling" | "confirmed" | "timeout">("polling");
  const supabase = createClient();

  useEffect(() => {
    if (!pendingOrderId) {
      router.push("/orders");
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;

    const poll = async () => {
      const { data: pending } = await supabase
        .from("pending_orders")
        .select("status")
        .eq("id", pendingOrderId)
        .single();

      if (pending?.status === "captured") {
        setStatus("confirmed");
        return;
      }

      if (pending?.status === "failed") {
        router.push("/payment-failed");
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setStatus("timeout");
        return;
      }

      setTimeout(poll, 300);
    };

    poll();
  }, [pendingOrderId, router, supabase]);

  if (status === "polling") {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-semibold mb-2">Confirming your order...</h1>
        <p className="text-muted-foreground text-sm">
          This usually takes just a few seconds. Please don&apos;t close this page.
        </p>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <Package className="h-10 w-10 mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-semibold mb-2">We&apos;re almost there</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Your payment was received. We&apos;re finalising your order and will show it in your orders shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/orders")}>View My Orders</Button>
          <Button variant="outline" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="h-14 w-14 mx-auto mb-4 text-green-500" />
      <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
      <p className="text-muted-foreground mb-6">
        Your payment was successful and your order has been placed.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={() => router.push("/orders")}>View My Orders</Button>
        <Button variant="outline" onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
