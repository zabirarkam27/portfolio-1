import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(180),
  message: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const limited = checkRateLimit(`contact:${ip}`, 5, 60_000);

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  const result = contactSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid contact message",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const contactInfo = await prisma.contactInfo.findFirst();

  const message = await prisma.contactMessage.create({
    data: {
      ...result.data,
      inboundTo: contactInfo?.email,
      source: "contact-form",
    },
  });

  return NextResponse.json({ ok: true, messageId: message.id }, { status: 201 });
}
