import nodemailer from "nodemailer";

const CONTACT_RECEIVER_EMAIL = "tarangvaghani@gmail.com";

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

  return { host, port, user, pass };
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

export async function sendContactNotificationEmail(
  payload: ContactEmailPayload,
): Promise<void> {
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) {
    throw new Error("SMTP configuration is missing or invalid");
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

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

  await transporter.sendMail({
    from: `"Portfolio Contact" <${smtpConfig.user}>`,
    to: CONTACT_RECEIVER_EMAIL,
    replyTo: payload.email,
    subject: "New Contact Form Query",
    text: textBody,
    html: htmlBody,
  });
}
