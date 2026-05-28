import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    if (!payment) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const razorpayOrderId = payment.order_id;
    if (!razorpayOrderId) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const supabase = createClient();

    // Fetch pending order by Razorpay order ID
    const { data: pending, error: pendingError } = await supabase
      .from("pending_orders")
      .select("*")
      .eq("razorpay_order_id", razorpayOrderId)
      .single();

    if (pendingError || !pending) {
      console.warn("Webhook: no pending_order found for", razorpayOrderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (event === "payment.captured") {
      // Idempotency: already captured?
      if (pending.status === "captured") {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Check if real order already exists (double-fire safety)
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", pending.user_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingOrder) {
        await supabase
          .from("pending_orders")
          .update({ status: "captured" })
          .eq("id", pending.id);
        return NextResponse.json({ received: true }, { status: 200 });
      }

      const delivery = pending.delivery as Record<string, string>;

      // Create real order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: pending.user_id,
          status: "Paid",
          total: pending.total,
          customer_name: delivery?.name || "",
          customer_email: delivery?.email || "",
          customer_phone: delivery?.phone || "",
          address: delivery?.address || "",
          city: delivery?.city || "",
          state: delivery?.state || "",
          pincode: delivery?.pincode || "",
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Webhook order creation error:", orderError);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      // Insert order items
      const items = (pending.items as Array<{
        product_id: string;
        quantity: number;
        price: number;
      }>) || [];

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      await supabase.from("order_items").insert(orderItems);

      // Decrement stock
      for (const item of items) {
        await supabase.rpc("decrement_stock", {
          product_id: item.product_id,
          qty: item.quantity,
        });
      }

      // Mark pending as captured
      await supabase
        .from("pending_orders")
        .update({ status: "captured" })
        .eq("id", pending.id);

      console.log("Webhook: order created for", razorpayOrderId, "-> order", order.id);
    }

    if (event === "payment.failed") {
      await supabase
        .from("pending_orders")
        .update({ status: "failed" })
        .eq("id", pending.id);
      console.log("Webhook: payment failed for", razorpayOrderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
