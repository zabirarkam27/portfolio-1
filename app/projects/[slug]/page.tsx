import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomeContent, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { ProjectDetail } from "./project-detail";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjectSlugs();

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project",
    };
  }

  return {
    title: `${project.name} - Ari Novak`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await getHomeContent();

  return (
    <ProjectDetail profile={content.profile} project={project} socialLinks={content.socialLinks} />
  );
}
