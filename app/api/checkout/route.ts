import { NextResponse } from "next/server";
import { z } from "zod";

import {
  getCheckoutPackage,
  getStripeClient,
  getStripePriceId,
} from "@/lib/stripe";
import { paidJoinWavePackages } from "@/lib/validation/joinWaveSchema";

const checkoutRequestSchema = z.object({
  packageName: z.enum(paidJoinWavePackages),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Choose a valid package." },
      { status: 400 },
    );
  }

  const checkoutPackage = getCheckoutPackage(parsed.data.packageName);
  const stripe = getStripeClient();
  const priceId = getStripePriceId(parsed.data.packageName);

  if (!checkoutPackage || !stripe || !priceId) {
    return NextResponse.json({
      ok: true,
      checkoutAvailable: false,
      message:
        "Secure checkout is not configured yet. Your enquiry can still be submitted.",
    });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      packageName: checkoutPackage.name,
      amount: String(checkoutPackage.amount),
      currency: checkoutPackage.currency,
    },
    success_url: `${siteUrl}/?checkout=reserved&package=${encodeURIComponent(
      checkoutPackage.name,
    )}#join`,
    cancel_url: `${siteUrl}/?checkout=cancelled&package=${encodeURIComponent(
      checkoutPackage.name,
    )}#pricing`,
  });

  return NextResponse.json({
    ok: true,
    checkoutAvailable: true,
    url: session.url,
  });
}
