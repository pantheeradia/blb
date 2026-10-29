import { db } from "@/db/client";
import { orders, orderItems, customers, coupons, pendingOrders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/orderNumber";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

  // A valid checkout signature proves the response came from Razorpay, but it
  // does not by itself prove that the payment has been captured. Fetch the
  // payment from Razorpay before creating any permanent order records.
  let payment;
  try {
    payment = await razorpay.payments.fetch(razorpayPaymentId);
  } catch (error) {
    console.error("Failed to fetch Razorpay payment status", {
      razorpayOrderId,
      razorpayPaymentId,
      error,
    });
    return { success: false, error: "Unable to verify payment status with Razorpay" };
  }

  if (payment.order_id !== razorpayOrderId) {
    console.error("Razorpay payment belongs to a different order", {
      expectedOrderId: razorpayOrderId,
      actualOrderId: payment.order_id,
      razorpayPaymentId,
    });
    return { success: false, error: "Payment does not belong to this order" };
  }

  if (payment.status !== "captured" || payment.captured !== true) {
    console.warn("Razorpay payment is not captured", {
      razorpayOrderId,
      razorpayPaymentId,
      paymentStatus: payment.status,
    });
    return { success: false, error: `Payment is not captured (status: ${payment.status})` };
  }

  const paymentAmountPaise = Number(payment.amount);
  if (!Number.isFinite(paymentAmountPaise) || paymentAmountPaise !== pending.amountPaise) {
    console.error("Razorpay payment amount mismatch", {
      razorpayOrderId,
      razorpayPaymentId,
      expectedAmountPaise: pending.amountPaise,
      actualAmountPaise: payment.amount,
    });
    return { success: false, error: "Payment amount does not match this order" };
  }

  if (payment.currency.toUpperCase() !== "INR") {
    console.error("Unexpected Razorpay payment currency", {
      razorpayOrderId,
      razorpayPaymentId,
      currency: payment.currency,
    });
    return { success: false, error: "Payment currency does not match this order" };
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

  await db.insert(orders).values({
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

  await db.insert(orderItems).values(
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

  const existingCustomer = await db.select().from(customers).where(eq(customers.email, customer.email)).limit(1);
  const now = new Date().toISOString();
  if (existingCustomer.length > 0) {
    await db.update(customers).set({
      orderCount: sql`${customers.orderCount} + 1`,
      totalSpend: sql`${customers.totalSpend} + ${total}`,
      address: customer.address,
      city: customer.city,
      state: customer.state ?? "",
      pincode: customer.pincode,
      lastOrderAt: now,
    }).where(eq(customers.email, customer.email));
  } else {
    await db.insert(customers).values({
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
    await db.update(coupons).set({ usesCount: sql`${coupons.usesCount} + 1` }).where(eq(coupons.code, pending.couponCode));
  }

  await db.delete(pendingOrders).where(eq(pendingOrders.id, razorpayOrderId));

  return { success: true, orderNumber };
}
