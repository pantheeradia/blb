import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { db } from "@/db/client";
import { orders, orderItems } from "@/db/schema";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const [allOrders, allItems] = await Promise.all([
    db.select().from(orders),
    db.select().from(orderItems),
  ]);

  const itemsByOrder = new Map<string, typeof allItems>();
  for (const item of allItems) {
    const current = itemsByOrder.get(item.orderId) ?? [];
    current.push(item);
    itemsByOrder.set(item.orderId, current);
  }

  const rows: string[][] = [];
  rows.push(["Order ID", "Date", "Customer", "Email", "Phone", "Address", "City", "State", "Pincode", "Status", "Items", "Discount", "Coupon", "Total", "Tracking Ref", "Payment ID"]);

  for (const o of allOrders) {
    const items = itemsByOrder.get(o.id) ?? [];
    const itemSummary = items.map((i) => `${i.productName} x${i.quantity}`).join("; ");

    rows.push([
      o.id,
      o.createdAt.slice(0, 10),
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      o.address,
      o.city,
      o.state,
      o.pincode,
      o.status,
      itemSummary,
      String(o.discount ?? 0),
      o.couponCode ?? "",
      String(o.total),
      o.trackingRef ?? "",
      o.paymentId,
    ]);
  }

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
