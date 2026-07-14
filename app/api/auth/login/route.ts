import { NextResponse } from "next/server";
import { z } from "zod";

import { getOrCreateAdmin, setAdminSession, verifyPassword } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
    const limited = checkRateLimit(`login:${ip}`, 5, 60_000);

    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again in a minute." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((limited.resetAt - Date.now()) / 1000)),
          },
        },
      );
    }

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
