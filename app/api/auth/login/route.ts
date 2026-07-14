import { NextResponse } from "next/server";
import { z } from "zod";

import { getOrCreateAdmin, setAdminSession, verifyPassword } from "@/lib/admin-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const result = loginSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json({ error: "Invalid login request" }, { status: 400 });
    }

    const admin = await getOrCreateAdmin();

    if (
      result.data.email !== admin.email ||
      !verifyPassword(result.data.password, admin.passwordHash)
    ) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setAdminSession(admin);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
