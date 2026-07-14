import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminForApi } from "@/lib/admin-auth";
import { sendReplyEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const replySchema = z.object({
  subject: z.string().min(1).max(180),
  body: z.string().min(1).max(10000),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = replySchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid reply content" }, { status: 400 });
  }

  const { id } = await context.params;
  const message = await prisma.contactMessage.findUniqueOrThrow({ where: { id } });

  try {
    await sendReplyEmail({
      to: message.email,
      subject: result.data.subject,
      text: result.data.body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reply email could not be sent" },
      { status: 500 },
    );
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      status: "replied",
      replySubject: result.data.subject,
      replyBody: result.data.body,
      repliedAt: new Date(),
    },
  });

  return NextResponse.json({ message: updated });
}
