import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// IMPORTANT: render uses Node; App Router gives you raw text via req.text()
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return NextResponse.json({ error: "No signature" }, { status: 400 });

  const text = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      text,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle events to mark users Pro
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any;
    const userId = s.client_reference_id as string | undefined;
    if (userId) await setUserPro(userId, true, { sessionId: s.id });
  }
  if (event.type === "invoice.paid") {
    const inv = event.data.object as any;
    // Subscription renewed - optional: keep user Pro
  }
  if (event.type === "customer.subscription.deleted") {
    // Optional: downgrade user
    // const sub = event.data.object as any;
    // await setUserProByStripeCustomer(sub.customer as string, false);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// Replace with your real DB logic (Mongo/Mongoose, Prisma, etc.)
async function setUserPro(userId: string, isPro: boolean, meta?: any) {
  console.log("setUserPro", { userId, isPro, meta });
  // Example (pseudo):
  // await db.collection('users').updateOne({ _id: userId }, { $set: { isPro, updatedAt: new Date() } })
}
