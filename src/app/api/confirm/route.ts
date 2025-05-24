import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const CALLBACK_URL =
  "https://us-central1-kosha-moves-dev.cloudfunctions.net/buyGiftCard";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    
   const payload = {
  data: {
    buyGiftCardRequest: {
      receipientEmail: session.metadata?.recipientEmail || session.metadata?.selfEmail || "",
      receipientName: session.metadata?.recipientName || session.metadata?.selfName || "",
      amount: session.amount_total ? session.amount_total / 100 : 0,
      clientName:
        session.metadata?.forSelf === "true"
          ? session.metadata?.selfName || "Self"
          : "Gift Sender",
    },
  },
};

    // console.log("Sending payload to callback:", payload);

    // Send to callback
    const callbackResponse = await fetch(CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const callbackBody = await callbackResponse.text();
    // console.log("Callback status:", callbackResponse.status);
    // console.log("Callback response body:", callbackBody);

    return NextResponse.json({
      session,
      callbackStatus: callbackResponse.status,
      callbackResponseBody: callbackBody,
    });
  } catch (err: any) {
    console.error("Error confirming session or calling callback:", err);
    return NextResponse.json(
      { error: "Failed to retrieve session or send callback" },
      { status: 500 }
    );
  }
}
