"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { createClient } from "@/lib/supabase/client";

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const supabase = createClient();

  const [delivery, setDelivery] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/products");
        return;
      }
      setUser(data.user);
      setDelivery((d) => ({
        ...d,
        name: data.user?.user_metadata?.full_name || "",
        email: data.user?.email || "",
      }));
    });
  }, [router, supabase]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items to proceed to checkout.</p>
      </div>
    );
  }

  const isDeliveryValid = () => {
    return (
      delivery.name.trim() &&
      delivery.email.trim() &&
      delivery.phone.trim() &&
      delivery.address.trim() &&
      delivery.city.trim() &&
      delivery.state.trim() &&
      delivery.pincode.trim()
    );
  };

  const handlePayment = async () => {
    if (!user || !isDeliveryValid()) return;
    setLoading(true);

    try {
      const cartItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          items: cartItems,
          delivery,
        }),
      });

      const { orderId, pendingOrderId } = await res.json();
      if (!orderId || !pendingOrderId) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(totalPrice * 100),
        currency: "INR",
        name: "TeeWorld",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Fast-path verification (webhook is the source of truth)
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pending_order_id: pendingOrderId,
            }),
          });
          clearCart();
          router.push(`/thank-you?pending_order_id=${pendingOrderId}`);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        prefill: {
          name: delivery.name,
          email: delivery.email,
          contact: delivery.phone,
        },
        theme: {
          color: "#E14B6A",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery + Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Details */}
            <div className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={delivery.name}
                    onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={delivery.email}
                    onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={delivery.phone}
                    onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                    placeholder="9876543210"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    placeholder="123, Main Street"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={delivery.city}
                    onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={delivery.state}
                    onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={delivery.pincode}
                    onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h2 className="font-semibold">Order Items</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 rounded-lg border">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.product.image_urls[0] || ""}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                      {item.size && ` · Size: ${item.size}`}
                      {item.color && ` · Color: ${item.color}`}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePayment}
                disabled={loading || !scriptLoaded || !isDeliveryValid()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay with Razorpay"
                )}
              </Button>

              {!scriptLoaded && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Loading payment gateway...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
