import { z } from "zod";

export const industries = [
  "Trades and home services",
  "Health and allied health",
  "Beauty and personal care",
  "Automotive",
  "Hospitality",
  "Retail",
  "Professional services",
  "Education or training",
  "Other",
] as const;

export const customerVolumeRanges = [
  "0–4",
  "5–19",
  "20–49",
  "50–199",
  "200+",
] as const;

export const requestMethods = [
  "We do not ask",
  "Staff ask manually when they remember",
  "We share a link or QR code",
  "We send email or SMS requests",
  "We already use an automated system",
  "Other",
] as const;

export const customerTools = [
  "Booking system",
  "CRM",
  "POS or checkout",
  "Invoicing software",
  "Email",
  "SMS",
  "Website form or online checkout",
  "None of these",
  "Other",
] as const;

export const preliminaryResultCategories = [
  "potential-fit",
  "manual-review",
] as const;

const trimmedEnum = <const Values extends readonly [string, ...string[]]>(
  values: Values,
) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.enum(values),
  );

const optionalTrimmedText = (maxLength: number, message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(maxLength, message).optional());

export const industrySchema = trimmedEnum(industries);
export const customerVolumeSchema = trimmedEnum(customerVolumeRanges);
export const requestMethodSchema = trimmedEnum(requestMethods);
export const customerToolSchema = trimmedEnum(customerTools);
export const preliminaryResultCategorySchema = trimmedEnum(
  preliminaryResultCategories,
);

export const fitCheckSchema = z.object({
  businessUrl: z
    .string()
    .trim()
    .url("Enter a valid website or Google Business Profile URL.")
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Enter a valid http or https URL."),
  industry: industrySchema,
  customerVolume: customerVolumeSchema,
  requestMethod: requestMethodSchema,
  tools: z
    .array(customerToolSchema)
    .superRefine((tools, context) => {
      const uniqueTools = new Set(tools);

      if (uniqueTools.size !== tools.length) {
        context.addIssue({
          code: "custom",
          message: "Choose each customer tool once.",
        });
      }

      if (tools.includes("None of these") && tools.length > 1) {
        context.addIssue({
          code: "custom",
          message: "Choose None of these by itself.",
        });
      }
    })
    .optional(),
  complianceAccepted: z.literal(true, {
    error: "Please confirm that review requests must be honest and voluntary.",
  }),
});

export const manualReviewContactSchema = z.object({
  workEmail: z.string().trim().email("Enter a valid work email address."),
  contactName: optionalTrimmedText(
    120,
    "Please keep contact name under 120 characters.",
  ),
  businessName: optionalTrimmedText(
    160,
    "Please keep business name under 160 characters.",
  ),
  notes: optionalTrimmedText(2000, "Please keep notes under 2,000 characters."),
  honeypot: z.string().optional(),
});

export const reviewSystemApplicationSchema = z
  .object({
    fitCheck: fitCheckSchema,
    preliminaryResultCategory: preliminaryResultCategorySchema,
    contact: manualReviewContactSchema,
  })
  .superRefine((application, context) => {
    const expectedCategory = evaluateFit(application.fitCheck);

    if (application.preliminaryResultCategory !== expectedCategory) {
      context.addIssue({
        code: "custom",
        path: ["preliminaryResultCategory"],
        message: "Preliminary result category does not match fit guidance.",
      });
    }
  });

export type Industry = (typeof industries)[number];
export type CustomerVolumeRange = (typeof customerVolumeRanges)[number];
export type RequestMethod = (typeof requestMethods)[number];
export type CustomerTool = (typeof customerTools)[number];
export type PreliminaryResultCategory =
  (typeof preliminaryResultCategories)[number];

export type FitCheckInput = z.input<typeof fitCheckSchema>;
export type FitCheckValues = z.output<typeof fitCheckSchema>;
export type ManualReviewContactInput = z.input<
  typeof manualReviewContactSchema
>;
export type ManualReviewContactValues = z.output<
  typeof manualReviewContactSchema
>;
export type ReviewSystemApplicationInput = z.input<
  typeof reviewSystemApplicationSchema
>;
export type ReviewSystemApplicationValues = z.output<
  typeof reviewSystemApplicationSchema
>;

const potentialFitRequestMethods: ReadonlySet<RequestMethod> = new Set([
  "We do not ask",
  "Staff ask manually when they remember",
  "We share a link or QR code",
]);

export function evaluateFit(
  values: Pick<FitCheckValues, "customerVolume" | "requestMethod">,
): PreliminaryResultCategory {
  if (
    values.customerVolume !== "0–4" &&
    potentialFitRequestMethods.has(values.requestMethod)
  ) {
    return "potential-fit";
  }

  return "manual-review";
}
