"use client";

import { useRouter } from "next/navigation";
import { XCircle, RotateCcw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <XCircle className="h-14 w-14 mx-auto mb-4 text-red-500" />
      <h1 className="text-2xl font-bold mb-2">Payment failed</h1>
      <p className="text-muted-foreground mb-6">
        We couldn&apos;t process your payment. No money was deducted from your account.
        You can try again or browse more products.
      </p>
      <div className="flex gap-3 justify-center">
        <Button onClick={() => router.push("/checkout")}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => router.push("/products")}>
          <ShoppingBag className="h-4 w-4 mr-2" />
          Browse Products
        </Button>
      </div>
    </div>
  );
}
