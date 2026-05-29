"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface CheckoutItem {
  product_id: string;
  title?: string;
  quantity: number;
  price: number;
}

interface CheckoutRecord {
  id: string;
  delivery: Record<string, string>;
  items: CheckoutItem[];
  total: number;
  status: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AbandonedClient({ checkouts }: { checkouts: CheckoutRecord[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Abandoned Checkouts</h1>
          <p className="text-muted-foreground mt-1">
            {checkouts.length} incomplete checkout{checkouts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {checkouts.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No abandoned checkouts.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Customers who start checkout but don&apos;t complete payment will appear here.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Abandoned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkouts.map((c) => {
                const d = c.delivery || {};
                return (
                  <TableRow key={c.id} className="align-top">
                    <TableCell>
                      <div className="font-medium">{d.name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{d.email || "—"}</div>
                    </TableCell>
                    <TableCell>{d.phone || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {d.city && d.state ? `${d.city}, ${d.state}` : d.city || d.state || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">{d.pincode || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {c.items?.length || 0} item{c.items?.length !== 1 ? "s" : ""}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            <Eye className="h-3 w-3 mr-1" /> View items
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cart Items</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            {(c.items || []).map((item, i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium text-sm">{item.title || "Unknown Product"}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                            <div className="flex justify-between pt-2 font-semibold">
                              <span>Total</span>
                              <span>₹{c.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="font-medium">₹{c.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {c.status === "pending" ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                          Abandoned
                        </Badge>
                      ) : c.status === "failed" ? (
                        <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                          Payment Failed
                        </Badge>
                      ) : (
                        <Badge variant="outline">{c.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {timeAgo(c.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
