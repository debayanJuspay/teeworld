import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pending_order_id,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // If we have a pending_order_id, check if the webhook already created the real order
    if (pending_order_id) {
      const { data: pending } = await supabase
        .from("pending_orders")
        .select("status, user_id, delivery, items, total")
        .eq("id", pending_order_id)
        .single();

      if (pending?.status === "captured") {
        // Webhook already won — find the real order
        const { data: order } = await supabase
          .from("orders")
          .select("id")
          .eq("user_id", pending.user_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (order) {
          return NextResponse.json({ success: true, orderId: order.id });
        }
      }

      if (pending && pending.status === "pending") {
        // Fallback: create the order ourselves (webhook hasn't arrived yet)
        const delivery = (pending.delivery || {}) as Record<string, string>;
        const items = (pending.items || []) as Array<{
          product_id: string;
          title: string;
          quantity: number;
          price: number;
          image_url?: string;
        }>;

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: pending.user_id,
            status: "Paid",
            payment_status: "captured",
            total: pending.total,
            customer_name: delivery.name || "",
            customer_email: delivery.email || "",
            customer_phone: delivery.phone || "",
            address: delivery.address || "",
            city: delivery.city || "",
            state: delivery.state || "",
            pincode: delivery.pincode || "",
          })
          .select()
          .single();

        if (orderError || !order) {
          console.error("Verify fallback order error:", orderError);
          return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
          );
        }

        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          title: item.title || "Unknown Product",
          image_url: item.image_url || null,
          quantity: item.quantity,
          price: item.price,
        }));

        await supabase.from("order_items").insert(orderItems);

        for (const item of items) {
          await supabase.rpc("decrement_stock", {
            product_id: item.product_id,
            qty: item.quantity,
          });
        }

        await supabase
          .from("pending_orders")
          .update({ status: "captured" })
          .eq("id", pending_order_id);

        return NextResponse.json({ success: true, orderId: order.id });
      }
    }

    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
