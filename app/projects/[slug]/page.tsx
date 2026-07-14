import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHomeContent, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { baseMetadata } from "@/lib/site";
import { ProjectDetail } from "./project-detail";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

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
    ...baseMetadata({
      title: `${project.name} - Project case study`,
      description: project.summary,
      image: project.imageUrl,
      path: `/projects/${project.slug}`,
    }),
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
