import { z } from "zod";

export const joinWavePackages = [
  "Foundation Wave",
  "Momentum Wave",
  "Not sure yet",
] as const;

export const paidJoinWavePackages = [
  "Foundation Wave",
  "Momentum Wave",
] as const;

export const complianceStatement =
  "I understand this service does not sell fake reviews, guarantee positive ratings, incentivise reviews or control review wording.";

const optionalUrl = (message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().url(message).optional());

const optionalText = (maxLength: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(maxLength, message).optional());

const requiredText = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(160, "Please keep this under 160 characters.");

export const joinWaveSchema = z.object({
  businessName: requiredText("Business name is required."),
  website: optionalUrl("Enter a valid website URL, including https://."),
  googleBusinessProfile: optionalUrl(
    "Enter a valid Google Business Profile URL, including https://.",
  ),
  serviceArea: requiredText("Suburb or service area is required."),
  industry: requiredText("Industry is required."),
  currentGoogleReviews: z
    .string()
    .trim()
    .min(1, "Current number of Google reviews is required.")
    .refine(
      (value) => /^\d+$/.test(value),
      "Enter a whole number of 0 or more.",
    )
    .transform((value) => Number(value))
    .refine((value) => value >= 0, "Enter 0 or more."),
  recentCustomers: optionalText(
    160,
    "Please keep recent customer details under 160 characters.",
  ),
  packageName: z.enum(joinWavePackages, {
    error: "Choose a package or select Not sure yet.",
  }),
  notes: optionalText(2000, "Please keep notes under 2,000 characters."),
  complianceAccepted: z.literal(true, {
    error: "Please confirm the compliance statement before joining.",
  }),
  honeypot: z.string().optional(),
});

export type JoinWaveInput = z.input<typeof joinWaveSchema>;
export type JoinWaveSubmission = z.output<typeof joinWaveSchema>;
export type JoinWavePackage = (typeof joinWavePackages)[number];
export type PaidJoinWavePackage = (typeof paidJoinWavePackages)[number];

export type JoinWaveFormValues = {
  businessName: string;
  website: string;
  googleBusinessProfile: string;
  serviceArea: string;
  industry: string;
  currentGoogleReviews: string;
  recentCustomers: string;
  packageName: JoinWavePackage;
  notes: string;
  complianceAccepted: boolean;
  honeypot: string;
};
