"use server";

import { sendReviewSystemApplicationEmail } from "@/lib/email/provider";
import {
  evaluateFit,
  reviewSystemApplicationSchema,
  type ManualReviewContactInput,
  type ReviewSystemApplicationInput,
} from "@/lib/validation/reviewSystemApplicationSchema";
import { reviewSystemContent } from "@/content/reviewSystem";

type ContactField = keyof ManualReviewContactInput;

export type ReviewSystemApplicationActionResult =
  | {
      ok: true;
      mode: "sent" | "development" | "spam-filtered";
      title: string;
      body: string;
    }
  | {
      ok: false;
      title: string;
      body: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
    };

const successContent = reviewSystemContent.fitCheck.stageTwo.success;
const errorContent = reviewSystemContent.fitCheck.stageTwo.error;

function createSuccessResult(
  mode: "sent" | "development" | "spam-filtered",
): ReviewSystemApplicationActionResult {
  return {
    ok: true,
    mode,
    title: successContent.title,
    body: successContent.body,
  };
}

function createErrorResult(
  fieldErrors?: Partial<Record<ContactField, string>>,
): ReviewSystemApplicationActionResult {
  return {
    ok: false,
    title: errorContent.title,
    body: errorContent.body,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
}

function getContactFieldErrors(error: {
  issues: Array<{ path: PropertyKey[]; message: string }>;
}) {
  const fieldErrors: Partial<Record<ContactField, string>> = {};

  for (const issue of error.issues) {
    const [section, field] = issue.path;

    if (
      section !== "contact" ||
      typeof field !== "string" ||
      field in fieldErrors
    ) {
      continue;
    }

    if (
      field === "workEmail" ||
      field === "contactName" ||
      field === "businessName" ||
      field === "notes" ||
      field === "honeypot"
    ) {
      fieldErrors[field] = issue.message;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function submitReviewSystemApplication(
  values: ReviewSystemApplicationInput,
  sourcePage?: string,
): Promise<ReviewSystemApplicationActionResult> {
  if (
    typeof values?.contact?.honeypot === "string" &&
    values.contact.honeypot.trim().length > 0
  ) {
    return createSuccessResult("spam-filtered");
  }

  const parsed = reviewSystemApplicationSchema.safeParse(values);

  if (!parsed.success) {
    return createErrorResult(getContactFieldErrors(parsed.error));
  }

  const serverResultCategory = evaluateFit(parsed.data.fitCheck);
  const timestamp = new Date().toISOString();
  const emailResult = await sendReviewSystemApplicationEmail({
    application: parsed.data,
    serverResultCategory,
    timestamp,
    sourcePage: sourcePage || "Unknown source page",
  });

  if (!emailResult.ok) {
    return createErrorResult();
  }

  return createSuccessResult(emailResult.mode);
}
