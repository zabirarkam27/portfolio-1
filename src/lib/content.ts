import "server-only";

import { prisma } from "@/lib/prisma";
import type { AboutFact, HomeContent, ProfileStat, SkillGroup } from "@/lib/content-types";

function asProfileStats(value: unknown): ProfileStat[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is ProfileStat =>
          typeof item === "object" &&
          item !== null &&
          "key" in item &&
          "value" in item &&
          typeof item.key === "string" &&
          typeof item.value === "string",
      )
    : [];
}

function asAboutFacts(value: unknown): AboutFact[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is AboutFact =>
          typeof item === "object" &&
          item !== null &&
          "key" in item &&
          "value" in item &&
          typeof item.key === "string" &&
          typeof item.value === "string",
      )
    : [];
}

function groupSkills(skills: HomeContent["skillRows"]): SkillGroup[] {
  const grouped = new Map<string, SkillGroup>();

  for (const skill of skills.filter((item) => item.category !== "Tag")) {
    const group = grouped.get(skill.category) ?? {
      label: skill.category,
      tag: skill.tag ?? "",
      items: [],
    };

    group.items.push({
      name: skill.name,
      lvl: skill.proficiency ?? 0,
    });

    grouped.set(skill.category, group);
  }

  return Array.from(grouped.values());
}

export async function getHomeContent(): Promise<HomeContent> {
  const [profile, aboutMe, socialLinks, skillRows, education, experience, projects, contactInfo] =
    await Promise.all([
      prisma.profile.findFirstOrThrow(),
      prisma.aboutMe.findFirstOrThrow(),
      prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.contactInfo.findFirstOrThrow(),
    ]);

  return {
    profile: {
      ...profile,
      stats: asProfileStats(profile.stats),
    },
    aboutMe: {
      ...aboutMe,
      facts: asAboutFacts(aboutMe.facts),
      paragraphs: aboutMe.content.split(/\n{2,}/),
    },
    socialLinks,
    skillRows,
    skillGroups: groupSkills(skillRows),
    skillTags: skillRows.filter((skill) => skill.category === "Tag").map((skill) => skill.name),
    education,
    experience,
    projects,
    contactInfo,
  };
}

export async function getProjectSlugs() {
  return prisma.project.findMany({
    select: { slug: true },
    orderBy: { order: "asc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}
