import { db } from "@/db/client";
import { orders, orderItems, customers, coupons, pendingOrders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/orderNumber";

export type CustomerData = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
};

export type AttributionData = {
  sourceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  capturedAt?: number;
};

export async function createOrderFromPending(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  customer: CustomerData,
  attribution?: AttributionData | null
): Promise<{ success: true; orderNumber: string } | { success: false; error: string }> {
  // Check if already processed (idempotent)
  const existing = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, razorpayOrderId)).limit(1);
  if (existing.length > 0) {
    return { success: true, orderNumber: existing[0].id };
  }

  const [pending] = await db.select().from(pendingOrders).where(eq(pendingOrders.id, razorpayOrderId)).limit(1);
  if (!pending) {
    return { success: false, error: "Pending order not found" };
  }

  const lineItems: Array<{
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    selectedWeight?: string | null;
    brewingEquipment?: string | null;
  }> = JSON.parse(pending.itemsJson);
  const total = pending.amountPaise / 100;

  const orderNumber = await generateOrderNumber();

  // Use transaction to ensure atomicity - all operations succeed or all fail
  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: razorpayOrderId,
        paymentId: razorpayPaymentId,
        status: "pending",
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone ?? "",
        address: customer.address,
        city: customer.city,
        state: customer.state ?? "",
        pincode: customer.pincode,
        total,
        discount: pending.discount,
        couponCode: pending.couponCode ?? null,
        sourceType: attribution?.sourceType?.slice(0, 50) ?? null,
        utmSource: attribution?.utmSource?.slice(0, 200) ?? null,
        utmMedium: attribution?.utmMedium?.slice(0, 100) ?? null,
        utmCampaign: attribution?.utmCampaign?.slice(0, 300) ?? null,
      });

      await tx.insert(orderItems).values(
        lineItems.map((i) => ({
          orderId: razorpayOrderId,
          productId: i.productId,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
          selectedWeight: i.selectedWeight ?? null,
          brewingEquipment: i.brewingEquipment ?? null,
        }))
      );

      const existingCustomer = await tx.select().from(customers).where(eq(customers.email, customer.email)).limit(1);
      const now = new Date().toISOString();
      if (existingCustomer.length > 0) {
        await tx.update(customers).set({
          orderCount: sql`${customers.orderCount} + 1`,
          totalSpend: sql`${customers.totalSpend} + ${total}`,
          address: customer.address,
          city: customer.city,
          state: customer.state ?? "",
          pincode: customer.pincode,
          lastOrderAt: now,
        }).where(eq(customers.email, customer.email));
      } else {
        await tx.insert(customers).values({
          name: customer.name,
          email: customer.email,
          phone: customer.phone ?? "",
          address: customer.address,
          city: customer.city,
          state: customer.state ?? "",
          pincode: customer.pincode,
          orderCount: 1,
          totalSpend: total,
          lastOrderAt: now,
        });
      }

      if (pending.couponCode) {
        await tx.update(coupons).set({ usesCount: sql`${coupons.usesCount} + 1` }).where(eq(coupons.code, pending.couponCode));
      }

      await tx.delete(pendingOrders).where(eq(pendingOrders.id, razorpayOrderId));
    });
  } catch (error) {
    console.error("Transaction failed during order creation:", error);
    // Check if it's a duplicate key error (order already exists due to race condition)
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      // Idempotent - order already exists
      return { success: true, orderNumber: razorpayOrderId };
    }
    return { success: false, error: "Failed to create order" };
  }

  return { success: true, orderNumber };
}
