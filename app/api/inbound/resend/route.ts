import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const inboundSchema = z.object({
  from: z.union([
    z.string(),
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
  ]),
  to: z.union([z.string(), z.array(z.string())]).optional(),
  subject: z.string().optional(),
  text: z.string().optional(),
  html: z.string().optional(),
});

function parseSender(value: z.infer<typeof inboundSchema>["from"]) {
  if (typeof value === "string") {
    const match = value.match(/^(.*)<(.+)>$/);

    if (match) {
      return {
        name: match[1].trim().replace(/^"|"$/g, "") || match[2].trim(),
        email: match[2].trim(),
      };
    }

    return { name: value, email: value };
  }

  return { name: value.name || value.email, email: value.email };
}

export async function POST(request: Request) {
  const secret = process.env.INBOUND_EMAIL_SECRET;

  if (secret && request.headers.get("x-inbound-email-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = inboundSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid inbound email payload" }, { status: 400 });
  }

  const sender = parseSender(result.data.from);
  const inboundTo = Array.isArray(result.data.to) ? result.data.to.join(", ") : result.data.to;

  const message = await prisma.contactMessage.create({
    data: {
      name: sender.name,
      email: sender.email,
      subject: result.data.subject || "(No subject)",
      message: result.data.text || result.data.html || "(No message body)",
      inboundTo,
      source: "inbound-email",
    },
  });

  return NextResponse.json({ ok: true, messageId: message.id }, { status: 201 });
}
