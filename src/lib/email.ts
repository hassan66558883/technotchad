import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[email] SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS not set — emails will be skipped.",
    );
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendMail(options: { to: string; subject: string; html: string; replyTo?: string }) {
  const client = getTransporter();
  if (!client) return { sent: false as const };

  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER!;

  try {
    await client.sendMail({
      from: `TechnoTchad <${from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("[email] Failed to send:", error);
    return { sent: false as const };
  }
}

export function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.SMTP_USER ?? null;
}
