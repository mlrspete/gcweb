import type {
  PreliminaryResultCategory,
  ReviewSystemApplicationValues,
} from "@/lib/validation/reviewSystemApplicationSchema";

import { sendResendEmail } from "./resend";

export type ReviewSystemApplicationEmail = {
  application: ReviewSystemApplicationValues;
  serverResultCategory: PreliminaryResultCategory;
  timestamp: string;
  sourcePage: string;
};

export type EmailSendResult =
  | {
      ok: true;
      mode: "sent" | "development";
      id?: string;
    }
  | {
      ok: false;
      error: string;
    };

const reviewSystemApplicationSubject =
  "New Growth Specialists review system application";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function formatValue(value: string | number | boolean | undefined) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return value && value.length > 0 ? value : "Not provided";
}

function createReviewSystemRows({
  application,
  serverResultCategory,
  timestamp,
  sourcePage,
}: ReviewSystemApplicationEmail) {
  const selectedTools = application.fitCheck.tools?.join(", ");

  return [
    ["Business URL", application.fitCheck.businessUrl],
    ["Industry", application.fitCheck.industry],
    ["Customer-volume range", application.fitCheck.customerVolume],
    ["Request method", application.fitCheck.requestMethod],
    ["Selected tools", selectedTools],
    ["Compliance accepted", application.fitCheck.complianceAccepted],
    ["Client category", application.preliminaryResultCategory],
    ["Recomputed server category", serverResultCategory],
    ["Work email", application.contact.workEmail],
    ["Contact name", application.contact.contactName],
    ["Business name", application.contact.businessName],
    ["Notes", application.contact.notes],
    ["Timestamp", timestamp],
    ["Source page", sourcePage],
  ] satisfies Array<[string, string | number | boolean | undefined]>;
}

function buildReviewSystemTextEmail(input: ReviewSystemApplicationEmail) {
  return createReviewSystemRows(input)
    .map(([label, value]) => `${label}: ${formatValue(value)}`)
    .join("\n");
}

function buildBusinessUrlCell(url: string) {
  const escapedUrl = escapeHtml(url);
  const escapedHref = escapeHtmlAttribute(url);

  return `<a href="${escapedHref}" style="color:#092a3a;font-weight:700;">${escapedUrl}</a>`;
}

function buildReviewSystemHtmlEmail(input: ReviewSystemApplicationEmail) {
  const rows = createReviewSystemRows(input)
    .map(([label, value]) => {
      const renderedValue =
        label === "Business URL" && typeof value === "string"
          ? buildBusinessUrlCell(value)
          : escapeHtml(formatValue(value));

      return `
        <tr>
          <th align="left" style="padding:10px 12px;border-bottom:1px solid #dff7ff;color:#061826;width:240px;">${escapeHtml(label)}</th>
          <td style="padding:10px 12px;border-bottom:1px solid #dff7ff;color:#092a3a;">${renderedValue}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#f7f3ea;padding:24px;color:#061826;">
      <div style="max-width:720px;margin:0 auto;background:#fffcf6;border:1px solid #ffd1ca;border-radius:12px;overflow:hidden;">
        <div style="background:#061826;color:#fffcf6;padding:22px 24px;">
          <p style="margin:0;color:#bfefe3;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Growth Specialists</p>
          <h1 style="margin:8px 0 0;font-size:22px;">Review system application</h1>
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
          ${rows}
        </table>
      </div>
    </div>
  `;
}

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY,
    to: process.env.LEAD_TO_EMAIL,
    from: process.env.LEAD_FROM_EMAIL,
  };
}

export async function sendReviewSystemApplicationEmail(
  input: ReviewSystemApplicationEmail,
): Promise<EmailSendResult> {
  const config = getEmailConfig();
  const { apiKey, from, to } = config;
  const isProduction = process.env.NODE_ENV === "production";
  const emailConfigured = Boolean(apiKey && to && from);

  if (!apiKey || !to || !from) {
    if (!isProduction) {
      console.info(
        "Growth Specialists review system application captured in development mode",
        {
          industry: input.application.fitCheck.industry,
          customerVolume: input.application.fitCheck.customerVolume,
          requestMethod: input.application.fitCheck.requestMethod,
          toolCount: input.application.fitCheck.tools?.length ?? 0,
          clientCategory: input.application.preliminaryResultCategory,
          serverCategory: input.serverResultCategory,
          timestamp: input.timestamp,
          emailConfigured,
        },
      );

      return { ok: true, mode: "development" };
    }

    return {
      ok: false,
      error: "Email provider is not configured.",
    };
  }

  try {
    const response = await sendResendEmail({
      apiKey,
      from,
      to,
      subject: reviewSystemApplicationSubject,
      html: buildReviewSystemHtmlEmail(input),
      text: buildReviewSystemTextEmail(input),
      replyTo: input.application.contact.workEmail,
    });

    return { ok: true, mode: "sent", id: response.id };
  } catch (error) {
    console.error("Growth Specialists review system application email failed", {
      error: error instanceof Error ? error.message : "Unknown email error",
      timestamp: input.timestamp,
    });

    return {
      ok: false,
      error: "Email provider failed to send.",
    };
  }
}
