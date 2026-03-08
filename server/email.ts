import nodemailer from "nodemailer";

const DEFAULT_CONTACT_RECEIVER_EMAIL = "tarangvaghani@gmail.com";
const SMTP_TIMEOUT_MS = 15000;
const SMTP_RETRY_ATTEMPTS = 2;

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;
let cachedTransporterKey: string | null = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !portRaw || !user || !pass) {
    return null;
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port)) {
    return null;
  }

  return { host, port, user, pass } satisfies SmtpConfig;
}

function getContactReceiverEmail(): string {
  const value = process.env.CONTACT_RECEIVER_EMAIL?.trim();
  return value || DEFAULT_CONTACT_RECEIVER_EMAIL;
}

function buildTransporter(config: SmtpConfig): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
}

function getTransporter(config: SmtpConfig): nodemailer.Transporter {
  const nextKey = `${config.host}:${config.port}:${config.user}`;
  if (cachedTransporter && cachedTransporterKey === nextKey) {
    return cachedTransporter;
  }

  cachedTransporter = buildTransporter(config);
  cachedTransporterKey = nextKey;
  return cachedTransporter;
}

function isRetryableSmtpError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  return code === "ETIMEDOUT" || code === "ECONNECTION";
}

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
  host: string;
  port: number;
  secure: boolean;
  user: string;
};

export async function testSmtpConnection(): Promise<SmtpTestResult> {
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    throw new Error("SMTP configuration is missing or invalid");
  }

  const transporter = getTransporter(smtpConfig);

  await transporter.verify();

  return {
    ok: true,
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    user: smtpConfig.user,
  };
}

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload,
): Promise<ContactEmailSendResult> {
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    throw new Error("SMTP configuration is missing or invalid");
  }

  const transporter = getTransporter(smtpConfig);

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

  const mailOptions = {
    from: `"Portfolio Contact" <${smtpConfig.user}>`,
    to: getContactReceiverEmail(),
    replyTo: payload.email,
    subject: "New Contact Form Query",
    text: textBody,
    html: htmlBody,
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= SMTP_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const result = await transporter.sendMail(mailOptions);
      return {
        messageId: result.messageId,
        accepted: (result.accepted ?? []).map(String),
        rejected: (result.rejected ?? []).map(String),
      };
    } catch (error) {
      lastError = error;
      if (!isRetryableSmtpError(error) || attempt === SMTP_RETRY_ATTEMPTS) {
        break;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to send contact notification email");
}
