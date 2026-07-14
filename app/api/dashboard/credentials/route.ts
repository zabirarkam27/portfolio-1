import { NextResponse } from "next/server";
import { z } from "zod";

import {
  hashPassword,
  requireAdminForApi,
  setAdminSession,
  verifyChangeCode,
  verifyPassword,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).optional().or(z.literal("")),
  verificationCode: z.string().min(1),
});

export async function PATCH(request: Request) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = credentialsSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid credential payload" }, { status: 400 });
  }

  try {
    verifyChangeCode(result.data.verificationCode);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  if (!verifyPassword(result.data.currentPassword, admin.passwordHash)) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const updated = await prisma.adminAccount.update({
    where: { id: admin.id },
    data: {
      email: result.data.email,
      ...(result.data.newPassword ? { passwordHash: hashPassword(result.data.newPassword) } : {}),
    },
  });

  await setAdminSession(updated);

  return NextResponse.json({ email: updated.email });
}
