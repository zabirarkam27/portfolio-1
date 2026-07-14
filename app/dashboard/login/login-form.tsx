"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodFormResolver } from "@/lib/zod-form-resolver";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodFormResolver(loginSchema),
    defaultValues: {
      email: "zabirarkam27@gmail.com",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      toast.error(data.error ?? "Login failed");
      return;
    }

    toast.success("Signed in");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Single admin access only.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            Email
            <Input className="mt-2" {...form.register("email")} />
          </label>
          <label className="block text-sm">
            Password
            <Input className="mt-2" type="password" {...form.register("password")} />
          </label>
        </div>

        <Button className="mt-6 w-full" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
