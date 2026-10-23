import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/db/client";
import { pendingOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createOrderFromPending } from "@/lib/createOrderFromPending";
import { sendOrderConfirmation } from "@/lib/sendOrderConfirmation";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  console.log("=== VERIFY CALLED ===", new Date().toISOString());
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, attribution } = body;
    console.log("Body parsed", { razorpay_order_id, razorpay_payment_id, has_customer: !!customer, has_sig: !!razorpay_signature });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing fields", { razorpay_order_id, razorpay_payment_id, razorpay_signature: !!razorpay_signature });
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch", { razorpay_order_id, razorpay_payment_id });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Fetch payment details from Razorpay server-side
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (error) {
      console.error("Verify: failed to fetch payment from Razorpay", { razorpay_payment_id, error });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Verify payment status is captured
    if (payment.status !== "captured") {
      console.error("Verify: payment not captured", { razorpay_payment_id, status: payment.status });
      return NextResponse.json({ error: "Payment not captured" }, { status: 400 });
    }

    // Verify payment currency is INR
    if (payment.currency !== "INR") {
      console.error("Verify: payment currency not INR", { razorpay_payment_id, currency: payment.currency });
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }

    // Verify payment's order_id matches the expected razorpay_order_id
    if (payment.order_id !== razorpay_order_id) {
      console.error("Verify: payment order_id mismatch", { razorpay_payment_id, paymentOrderId: payment.order_id, expectedOrderId: razorpay_order_id });
      return NextResponse.json({ error: "Order ID mismatch" }, { status: 400 });
    }

    // Fetch pending order to verify amount
    const [pending] = await db.select().from(pendingOrders).where(eq(pendingOrders.id, razorpay_order_id)).limit(1);

    if (!pending) {
      console.error("Verify: pending order not found", { razorpay_order_id });
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    // Verify payment amount matches expected amount in paise
    if (payment.amount !== pending.amountPaise) {
      console.error("Verify: payment amount mismatch", { razorpay_order_id, paymentAmount: payment.amount, expectedAmount: pending.amountPaise });
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    console.log("Payment verified, creating order", { razorpay_order_id });

    const result = await createOrderFromPending(razorpay_order_id, razorpay_payment_id, customer, attribution);

    if (!result.success) {
      console.error("createOrderFromPending failed", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    sendOrderConfirmation({ customer, orderId: razorpay_order_id, orderNumber: result.orderNumber, paymentId: razorpay_payment_id })
      .catch((err) => console.error("Order confirmation email failed (order saved):", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
