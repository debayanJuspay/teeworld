import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { amount, items, delivery } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        app: "teeworld",
      },
    });

    // Persist pending order so webhook can recover if browser fails
    const { data: pendingOrder, error: pendingError } = await supabase
      .from("pending_orders")
      .insert({
        razorpay_order_id: order.id,
        user_id: user.id,
        delivery: delivery || {},
        items: items,
        total: amount,
        status: "pending",
      })
      .select()
      .single();

    if (pendingError || !pendingOrder) {
      console.error("Pending order creation error:", pendingError);
      return NextResponse.json(
        { error: "Failed to create pending order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      pendingOrderId: pendingOrder.id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
