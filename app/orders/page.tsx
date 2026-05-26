import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, ArrowLeft } from "lucide-react";
import type { Order, OrderItem } from "@/types";

export const metadata = {
  title: "My Orders - TeeWorld",
};

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Paid: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Delivered: "bg-green-100 text-green-800 hover:bg-green-100",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { success?: string; order?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = ordersRaw as (Order & { items?: OrderItem[] })[] | null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {searchParams.success === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            Payment successful! Your order #{searchParams.order?.slice(0, 8)} has been placed.
          </p>
        </div>
      )}

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Once you place an order, it will appear here.
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order ID: <span className="font-mono">{order.id.slice(0, 12)}...</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                  {order.status}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Link
                          href={`/products/${item.product_id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product?.title || "Unknown Product"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price}</TableCell>
                      <TableCell className="text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(order.address || order.city || order.state) && (
                <div className="px-6 py-3 border-t bg-muted/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm">
                    {order.customer_name && <span className="font-medium">{order.customer_name}</span>}
                    {order.customer_phone && <span className="text-muted-foreground"> · {order.customer_phone}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[order.address, order.city, order.state, order.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div className="px-6 py-4 border-t flex justify-end">
                <p className="font-semibold">
                  Total: <span className="text-primary">₹{order.total.toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
