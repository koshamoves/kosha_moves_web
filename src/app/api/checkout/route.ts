
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "eGift Card",
              description: body.message || "Gift Card Purchase",
            },
            unit_amount: body.amount * 100,
          },
          quantity: body.quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
      metadata: {
        forSelf: String(body.forSelf),
        recipientEmail: body.email || "n/a",
        recipientName: body.name || "n/a",
        deliveryDate: body.date || "n/a",
        message: body.message || "",
      },
    });

    // console.log("Checkout Created Stripe session:", session);

    // Return the full session URL for client redirect
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout creation failed:", err);
    return NextResponse.json(
      { error: err.message || "Stripe Checkout session creation failed" },
      { status: 500 }
    );
  }
}
