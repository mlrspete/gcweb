import type { JoinWaveSubmission } from "@/lib/validation/joinWaveSchema";

import { sendResendEmail } from "./resend";

export type JoinWaveLeadEmail = {
  lead: JoinWaveSubmission;
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

const subject = "New Growth Specialists Visibility Wave enquiry";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function createRows({ lead, timestamp, sourcePage }: JoinWaveLeadEmail) {
  return [
    ["Business name", lead.businessName],
    ["Website", lead.website],
    ["Google Business Profile link", lead.googleBusinessProfile],
    ["Suburb / service area", lead.serviceArea],
    ["Industry", lead.industry],
    ["Current number of Google reviews", lead.currentGoogleReviews],
    ["Approximate number of recent customers", lead.recentCustomers],
    ["Selected package", lead.packageName],
    ["Additional notes", lead.notes],
    ["Compliance checkbox accepted", lead.complianceAccepted],
    ["Timestamp", timestamp],
    ["Source page", sourcePage],
  ] satisfies Array<[string, string | number | boolean | undefined]>;
}

function buildTextEmail(input: JoinWaveLeadEmail) {
  return createRows(input)
    .map(([label, value]) => `${label}: ${formatValue(value)}`)
    .join("\n");
}

function buildHtmlEmail(input: JoinWaveLeadEmail) {
  const rows = createRows(input)
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:10px 12px;border-bottom:1px solid #dff7ff;color:#061826;width:240px;">${escapeHtml(label)}</th>
          <td style="padding:10px 12px;border-bottom:1px solid #dff7ff;color:#092a3a;">${escapeHtml(formatValue(value))}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#f7f3ea;padding:24px;color:#061826;">
      <div style="max-width:720px;margin:0 auto;background:#fffcf6;border:1px solid #ffd1ca;border-radius:12px;overflow:hidden;">
        <div style="background:#061826;color:#fffcf6;padding:22px 24px;">
          <p style="margin:0;color:#bfefe3;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Growth Specialists</p>
          <h1 style="margin:8px 0 0;font-size:22px;">Visibility Wave enquiry</h1>
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

export async function sendJoinWaveLeadEmail(
  input: JoinWaveLeadEmail,
): Promise<EmailSendResult> {
  const config = getEmailConfig();
  const isProduction = process.env.NODE_ENV === "production";

  if (!config.apiKey || !config.to || !config.from) {
    if (!isProduction) {
      console.info("Growth Specialists lead captured in development mode", {
        businessName: input.lead.businessName,
        packageName: input.lead.packageName,
        timestamp: input.timestamp,
        sourcePage: input.sourcePage,
        emailConfigured: Boolean(config.apiKey && config.to && config.from),
      });

      return { ok: true, mode: "development" };
    }

    return {
      ok: false,
      error: "Email provider is not configured.",
    };
  }

  try {
    const response = await sendResendEmail({
      apiKey: config.apiKey,
      from: config.from,
      to: config.to,
      subject,
      html: buildHtmlEmail(input),
      text: buildTextEmail(input),
    });

    return { ok: true, mode: "sent", id: response.id };
  } catch (error) {
    console.error("Growth Specialists lead email failed", {
      error: error instanceof Error ? error.message : "Unknown email error",
      timestamp: input.timestamp,
    });

    return {
      ok: false,
      error: "Email provider failed to send.",
    };
  }
}
