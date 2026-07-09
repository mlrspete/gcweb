"use server";

import { sendJoinWaveLeadEmail } from "@/lib/email/provider";
import {
  joinWaveSchema,
  type JoinWaveFormValues,
} from "@/lib/validation/joinWaveSchema";

export type JoinWaveActionResult =
  | {
      ok: true;
      mode: "sent" | "development" | "spam-filtered";
      message: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<keyof JoinWaveFormValues, string>>;
    };

const successMessage =
  "You're in the queue. We'll review your details and follow up with the next step.";

function flattenFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Partial<Record<keyof JoinWaveFormValues, string>> {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter((entry): entry is [keyof JoinWaveFormValues, string[]] =>
        Array.isArray(entry[1]),
      )
      .map(([field, messages]) => [field, messages[0]]),
  ) as Partial<Record<keyof JoinWaveFormValues, string>>;
}

export async function submitJoinWave(
  values: JoinWaveFormValues,
  sourcePage?: string,
): Promise<JoinWaveActionResult> {
  if (
    typeof values.honeypot === "string" &&
    values.honeypot.trim().length > 0
  ) {
    return {
      ok: true,
      mode: "spam-filtered",
      message: successMessage,
    };
  }

  const parsed = joinWaveSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Something went wrong. Please try again or email us directly.",
      fieldErrors: flattenFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const timestamp = new Date().toISOString();
  const emailResult = await sendJoinWaveLeadEmail({
    lead: parsed.data,
    timestamp,
    sourcePage: sourcePage || "Unknown source page",
  });

  if (!emailResult.ok) {
    return {
      ok: false,
      message: "Something went wrong. Please try again or email us directly.",
    };
  }

  return {
    ok: true,
    mode: emailResult.mode,
    message: successMessage,
  };
}
