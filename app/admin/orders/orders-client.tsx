"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateOrderStatus } from "../actions";
import type { Order } from "@/types";

interface OrdersClientProps {
  initialOrders: Order[];
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Paid: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  Delivered: "bg-green-100 text-green-800 hover:bg-green-100",
};

const statusOptions = ["Pending", "Paid", "Shipped", "Delivered"];

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {initialOrders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {initialOrders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div
                className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <p className="font-medium text-sm">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} ·{" "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                  <Badge className={statusColors[order.status] || ""}>
                    {order.status}
                  </Badge>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="px-6 py-4 border-t">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-sm">Order Items</h4>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleStatusChange(order.id, val)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                              className="hover:text-primary transition-colors"
                            >
                              {item.title || item.product?.title || "Unknown Product"}
                            </Link>
                            {(item.size || item.color) && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.size && item.color && <span className="mx-1">·</span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{item.price}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
