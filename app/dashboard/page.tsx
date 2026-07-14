import { requireAdmin } from "@/lib/admin-auth";
import { getHomeContent } from "@/lib/content";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const [admin, content] = await Promise.all([requireAdmin(), getHomeContent()]);

  return <DashboardClient adminEmail={admin.email} initialContent={content} />;
}
