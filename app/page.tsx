import { HomePage } from "./home-page";
import { getHomeContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getHomeContent();

  return <HomePage content={content} />;
}
