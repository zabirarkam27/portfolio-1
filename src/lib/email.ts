import "server-only";

import { Resend } from "resend";

export function configuredFromEmail() {
  return process.env.FROM_EMAIL || process.env.ADMIN_EMAIL || "hello@zabir.dev";
}

export async function sendReplyEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured. Add it in Vercel env to send replies.");
  }

  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: configuredFromEmail(),
    to,
    subject,
    text,
    replyTo: configuredFromEmail(),
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
