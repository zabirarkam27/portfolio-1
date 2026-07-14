import { revalidatePath } from "next/cache";

export function revalidatePortfolioPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  } else {
    revalidatePath("/projects/[slug]", "page");
  }
}
