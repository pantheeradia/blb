import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/db/client";
import { pendingOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createOrderFromPending, CustomerData } from "@/lib/createOrderFromPending";
import { sendOrderConfirmation } from "@/lib/sendOrderConfirmation";

type AttributionData = {
  sourceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  capturedAt?: number;
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Razorpay POSTs form data here after UPI/payment redirect flow
export async function POST(req: NextRequest) {
  const origin = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  try {
    const formData = await req.formData();
    const razorpay_payment_id = formData.get("razorpay_payment_id") as string | null;
    const razorpay_order_id = formData.get("razorpay_order_id") as string | null;
    const razorpay_signature = formData.get("razorpay_signature") as string | null;

    console.log("=== CALLBACK CALLED ===", { razorpay_order_id, razorpay_payment_id });

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error("Callback missing params");
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Callback signature mismatch", { razorpay_order_id });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    // Fetch payment details from Razorpay server-side
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (error) {
      console.error("Callback: failed to fetch payment from Razorpay", { razorpay_payment_id, error });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    // Verify payment status is captured
    if (payment.status !== "captured") {
      console.error("Callback: payment not captured", { razorpay_payment_id, status: payment.status });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    // Verify payment currency is INR
    if (payment.currency !== "INR") {
      console.error("Callback: payment currency not INR", { razorpay_payment_id, currency: payment.currency });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    // Verify payment's order_id matches the expected razorpay_order_id
    if (payment.order_id !== razorpay_order_id) {
      console.error("Callback: payment order_id mismatch", { razorpay_payment_id, paymentOrderId: payment.order_id, expectedOrderId: razorpay_order_id });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    const [pending] = await db.select().from(pendingOrders).where(eq(pendingOrders.id, razorpay_order_id)).limit(1);

    if (!pending) {
      // Already processed (likely by webhook) - go straight to success
      console.log("Callback: pending order not found, assuming already processed:", razorpay_order_id);
      return NextResponse.redirect(`${origin}/checkout/success`);
    }

    // Verify payment amount matches expected amount in paise
    if (payment.amount !== pending.amountPaise) {
      console.error("Callback: payment amount mismatch", { razorpay_order_id, paymentAmount: payment.amount, expectedAmount: pending.amountPaise });
      return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
    }

    let customer: CustomerData | null = null;
    let attribution: AttributionData | null = null;

    if (pending.customerJson) {
      try {
        customer = JSON.parse(pending.customerJson) as CustomerData;
      } catch {
        console.error("Callback: failed to parse customerJson for", razorpay_order_id);
      }
    }

    if (pending.attributionJson) {
      try {
        attribution = JSON.parse(pending.attributionJson) as AttributionData;
      } catch { /* ignore */ }
    }

    if (!customer) {
      console.error("Callback: no customer data for order", razorpay_order_id);
      return NextResponse.redirect(`${origin}/checkout/success`);
    }

    const result = await createOrderFromPending(razorpay_order_id, razorpay_payment_id, customer, attribution);

    if (result.success) {
      console.log("Callback: order created:", result.orderNumber);
      sendOrderConfirmation({ customer, orderId: razorpay_order_id, orderNumber: result.orderNumber, paymentId: razorpay_payment_id })
        .catch((err) => console.error("Callback email failed (order saved):", err));
    } else {
      console.error("Callback: createOrderFromPending failed:", result.error);
    }

    return NextResponse.redirect(`${origin}/checkout/success`);
  } catch (error) {
    console.error("Razorpay callback error:", error);
    return NextResponse.redirect(`${origin}/checkout/success`);
  }
}
