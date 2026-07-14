import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminForApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = statusSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid message status" }, { status: 400 });
  }

  const { id } = await context.params;
  const message = await prisma.contactMessage.update({
    where: { id },
    data: result.data,
  });

  return NextResponse.json({ message });
}
