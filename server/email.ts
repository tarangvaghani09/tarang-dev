import axios from "axios";
// import nodemailer from "nodemailer";

const DEFAULT_CONTACT_RECEIVER_EMAIL = "tarangvaghani@gmail.com";
const BREVO_API_BASE_URL = "https://api.brevo.com/v3";
const EMAIL_TIMEOUT_MS = 15000;

type BrevoConfig = {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
};

function getBrevoConfig(): BrevoConfig {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  const toEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() || DEFAULT_CONTACT_RECEIVER_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || toEmail;
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "Portfolio Contact";

  return {
    apiKey,
    toEmail,
    fromEmail,
    fromName,
  };
}

function getContactReceiverEmail(): string {
  const value = process.env.CONTACT_RECEIVER_EMAIL?.trim();
  return value || DEFAULT_CONTACT_RECEIVER_EMAIL;
}

/*
  SMTP fallback (kept for later switch-back):
  ------------------------------------------------
  import nodemailer from "nodemailer";

  function getSmtpConfig() {
    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !portRaw || !user || !pass) return null;
    const port = Number(portRaw);
    if (!Number.isFinite(port)) return null;
    return { host, port, user, pass };
  }

  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass }
  });
*/

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  submittedAt: Date;
};

export type ContactEmailSendResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
};

export type SmtpTestResult = {
  ok: boolean;
  provider: "brevo-api";
  toEmail: string;
  fromEmail: string;
};

export async function testSmtpConnection(): Promise<SmtpTestResult> {
  const config = getBrevoConfig();
  await axios.get(`${BREVO_API_BASE_URL}/account`, {
    headers: {
      "api-key": config.apiKey,
    },
    timeout: EMAIL_TIMEOUT_MS,
  });

  return {
    ok: true,
    provider: "brevo-api",
    toEmail: config.toEmail,
    fromEmail: config.fromEmail,
  };
}

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload,
): Promise<ContactEmailSendResult> {
  const config = getBrevoConfig();

  const subjectValue = payload.subject?.trim() || "No subject provided";
  const submittedAtLocal = payload.submittedAt.toLocaleString();
  const submittedAtIso = payload.submittedAt.toISOString();

  const textBody = [
    "New Contact Form Submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${subjectValue}`,
    "",
    "Message:",
    payload.message,
    "",
    `Submitted At: ${submittedAtLocal} (${submittedAtIso})`,
  ].join("\n");

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subjectValue)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(submittedAtLocal)} (${escapeHtml(submittedAtIso)})</p>
  `;

  const response = await axios.post(
    `${BREVO_API_BASE_URL}/smtp/email`,
    {
      sender: {
        name: config.fromName,
        email: config.fromEmail,
      },
      to: [{ email: getContactReceiverEmail() }],
      replyTo: { email: payload.email },
      subject: "New Contact Form Query",
      textContent: textBody,
      htmlContent: htmlBody,
    },
    {
      headers: {
        "api-key": config.apiKey,
        "Content-Type": "application/json",
      },
      timeout: EMAIL_TIMEOUT_MS,
    },
  );

  return {
    messageId: String(response.data?.messageId ?? ""),
    accepted: [getContactReceiverEmail()],
    rejected: [],
  };
}
