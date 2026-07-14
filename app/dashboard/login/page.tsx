import { redirect } from "next/navigation";

import { getSessionAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const admin = await getSessionAdmin();

  if (admin) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
