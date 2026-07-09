import Stripe from "stripe";

import type { PaidJoinWavePackage } from "@/lib/validation/joinWaveSchema";

export type CheckoutPackage = {
  name: PaidJoinWavePackage;
  amount: number;
  amountLabel: string;
  currency: "usd";
  priceEnvVar: "STRIPE_FOUNDATION_PRICE_ID" | "STRIPE_MOMENTUM_PRICE_ID";
};

export const checkoutPackages = {
  "Foundation Wave": {
    name: "Foundation Wave",
    amount: 29900,
    amountLabel: "$299",
    currency: "usd",
    priceEnvVar: "STRIPE_FOUNDATION_PRICE_ID",
  },
  "Momentum Wave": {
    name: "Momentum Wave",
    amount: 50000,
    amountLabel: "$500",
    currency: "usd",
    priceEnvVar: "STRIPE_MOMENTUM_PRICE_ID",
  },
} satisfies Record<PaidJoinWavePackage, CheckoutPackage>;

export function getCheckoutPackage(packageName: string) {
  if (packageName in checkoutPackages) {
    return checkoutPackages[packageName as PaidJoinWavePackage];
  }

  return null;
}

export function getStripePriceId(packageName: PaidJoinWavePackage) {
  const checkoutPackage = checkoutPackages[packageName];
  return process.env[checkoutPackage.priceEnvVar];
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    appInfo: {
      name: "Growth Specialists",
      version: "0.1.0",
    },
  });
}

export function isStripeCheckoutReady(packageName: PaidJoinWavePackage) {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && getStripePriceId(packageName),
  );
}
