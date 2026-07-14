import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const order = z.coerce.number().int().default(0);
const nonEmpty = z.string().min(1);
const optionalUrl = z.string().nullable().optional();

const profileSchema = z.object({
  name: nonEmpty,
  designation: nonEmpty,
  headline: nonEmpty,
  tagline: nonEmpty,
  availability: nonEmpty,
  location: nonEmpty,
  currentCompany: nonEmpty,
  photoUrl: nonEmpty,
  resumeUrl: nonEmpty,
  footerTagline: nonEmpty,
  stats: z.array(z.object({ key: nonEmpty, value: nonEmpty })),
});

const aboutSchema = z.object({
  content: nonEmpty,
  imageUrl: nonEmpty,
  since: nonEmpty,
  facts: z.array(z.object({ key: nonEmpty, value: nonEmpty })),
});

const contactSchema = z.object({
  email: nonEmpty,
  phone: nonEmpty,
  whatsapp: nonEmpty,
});

const socialLinkSchema = z.object({
  platform: nonEmpty,
  url: nonEmpty,
  order,
});

const skillSchema = z.object({
  name: nonEmpty,
  category: nonEmpty,
  proficiency: z.coerce.number().int().min(0).max(100).nullable().optional(),
  icon: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  order,
});

const educationSchema = z.object({
  year: nonEmpty,
  school: nonEmpty,
  degree: nonEmpty,
  note: nonEmpty,
  icon: z.string().nullable().optional(),
  order,
});

const experienceSchema = z.object({
  range: nonEmpty,
  company: nonEmpty,
  role: nonEmpty,
  location: nonEmpty,
  bullets: z.array(nonEmpty),
  stack: nonEmpty,
  order,
});

const projectSchema = z.object({
  slug: nonEmpty,
  name: nonEmpty,
  year: nonEmpty,
  tag: nonEmpty,
  imageUrl: nonEmpty,
  summary: nonEmpty,
  techStack: z.array(nonEmpty),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  challenges: nonEmpty,
  futurePlans: nonEmpty,
  order,
});

export const resourceNames = [
  "profile",
  "about",
  "contact",
  "social-links",
  "skills",
  "education",
  "experience",
  "projects",
] as const;

export type DashboardResource = (typeof resourceNames)[number];

export function isDashboardResource(resource: string): resource is DashboardResource {
  return resourceNames.includes(resource as DashboardResource);
}

export function isUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export function validateCreate(resource: DashboardResource, payload: unknown) {
  return getSchema(resource).safeParse(payload);
}

export function validateUpdate(resource: DashboardResource, payload: unknown) {
  return getSchema(resource).partial().safeParse(payload);
}

export async function listResource(resource: DashboardResource) {
  switch (resource) {
    case "profile":
      return prisma.profile.findFirstOrThrow();
    case "about":
      return prisma.aboutMe.findFirstOrThrow();
    case "contact":
      return prisma.contactInfo.findFirstOrThrow();
    case "social-links":
      return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    case "skills":
      return prisma.skill.findMany({ orderBy: { order: "asc" } });
    case "education":
      return prisma.education.findMany({ orderBy: { order: "asc" } });
    case "experience":
      return prisma.experience.findMany({ orderBy: { order: "asc" } });
    case "projects":
      return prisma.project.findMany({ orderBy: { order: "asc" } });
  }
}

export async function getResourceById(resource: DashboardResource, id: string) {
  switch (resource) {
    case "social-links":
      return prisma.socialLink.findUniqueOrThrow({ where: { id } });
    case "skills":
      return prisma.skill.findUniqueOrThrow({ where: { id } });
    case "education":
      return prisma.education.findUniqueOrThrow({ where: { id } });
    case "experience":
      return prisma.experience.findUniqueOrThrow({ where: { id } });
    case "projects":
      return prisma.project.findUniqueOrThrow({ where: { id } });
    default:
      throw new Error("Use collection endpoints for singleton resources.");
  }
}

export async function createResource(resource: DashboardResource, data: Record<string, unknown>) {
  switch (resource) {
    case "social-links":
      return prisma.socialLink.create({ data: data as Prisma.SocialLinkCreateInput });
    case "skills":
      return prisma.skill.create({ data: data as Prisma.SkillCreateInput });
    case "education":
      return prisma.education.create({ data: data as Prisma.EducationCreateInput });
    case "experience":
      return prisma.experience.create({ data: data as Prisma.ExperienceCreateInput });
    case "projects":
      return prisma.project.create({ data: data as Prisma.ProjectCreateInput });
    default:
      throw new Error("Singleton resources cannot be created from the dashboard API.");
  }
}

export async function updateSingletonResource(
  resource: DashboardResource,
  data: Record<string, unknown>,
) {
  switch (resource) {
    case "profile": {
      const existing = await prisma.profile.findFirstOrThrow({ select: { id: true } });
      return prisma.profile.update({
        where: { id: existing.id },
        data: data as Prisma.ProfileUpdateInput,
      });
    }
    case "about": {
      const existing = await prisma.aboutMe.findFirstOrThrow({ select: { id: true } });
      return prisma.aboutMe.update({
        where: { id: existing.id },
        data: data as Prisma.AboutMeUpdateInput,
      });
    }
    case "contact": {
      const existing = await prisma.contactInfo.findFirstOrThrow({ select: { id: true } });
      return prisma.contactInfo.update({
        where: { id: existing.id },
        data: data as Prisma.ContactInfoUpdateInput,
      });
    }
    default:
      throw new Error("Use item endpoints to update collection resources.");
  }
}

export async function updateResourceById(
  resource: DashboardResource,
  id: string,
  data: Record<string, unknown>,
) {
  switch (resource) {
    case "social-links":
      return prisma.socialLink.update({
        where: { id },
        data: data as Prisma.SocialLinkUpdateInput,
      });
    case "skills":
      return prisma.skill.update({ where: { id }, data: data as Prisma.SkillUpdateInput });
    case "education":
      return prisma.education.update({ where: { id }, data: data as Prisma.EducationUpdateInput });
    case "experience":
      return prisma.experience.update({
        where: { id },
        data: data as Prisma.ExperienceUpdateInput,
      });
    case "projects":
      return prisma.project.update({ where: { id }, data: data as Prisma.ProjectUpdateInput });
    default:
      throw new Error("Use collection endpoints to update singleton resources.");
  }
}

export async function deleteResourceById(resource: DashboardResource, id: string) {
  switch (resource) {
    case "social-links":
      return prisma.socialLink.delete({ where: { id } });
    case "skills":
      return prisma.skill.delete({ where: { id } });
    case "education":
      return prisma.education.delete({ where: { id } });
    case "experience":
      return prisma.experience.delete({ where: { id } });
    case "projects":
      return prisma.project.delete({ where: { id } });
    default:
      throw new Error("Singleton resources cannot be deleted from the dashboard API.");
  }
}

function getSchema(resource: DashboardResource) {
  switch (resource) {
    case "profile":
      return profileSchema;
    case "about":
      return aboutSchema;
    case "contact":
      return contactSchema;
    case "social-links":
      return socialLinkSchema;
    case "skills":
      return skillSchema;
    case "education":
      return educationSchema;
    case "experience":
      return experienceSchema;
    case "projects":
      return projectSchema;
  }
}
