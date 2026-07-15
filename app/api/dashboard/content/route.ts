import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminForApi } from "@/lib/admin-auth";
import { getHomeContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { revalidatePortfolioPaths } from "@/lib/revalidate";

const optionalId = z.string().optional();
const order = z.coerce.number().int().default(0);
const optionalText = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().nullable().optional(),
);
const text = z.string();
const requiredText = z.string().min(1);

const profileSchema = z.object({
  id: z.string(),
  name: requiredText,
  designation: requiredText,
  headline: requiredText,
  tagline: requiredText,
  availability: requiredText,
  location: requiredText,
  currentCompany: text,
  photoUrl: requiredText,
  resumeUrl: requiredText,
  footerTagline: requiredText,
  stats: z.array(z.object({ key: requiredText, value: requiredText })),
});

const contentSchema = z.object({
  profile: profileSchema,
  aboutMe: z.object({
    id: z.string(),
    content: requiredText,
    imageUrl: requiredText,
    since: requiredText,
    facts: z.array(z.object({ key: requiredText, value: requiredText })),
  }),
  socialLinks: z.array(
    z.object({
      id: optionalId,
      platform: requiredText,
      url: requiredText,
      order,
    }),
  ),
  skillRows: z.array(
    z.object({
      id: optionalId,
      name: requiredText,
      category: requiredText,
      proficiency: z.coerce.number().int().min(0).max(100).nullable().optional(),
      icon: optionalText,
      tag: optionalText,
      order,
    }),
  ),
  education: z.array(
    z.object({
      id: optionalId,
      year: requiredText,
      school: requiredText,
      degree: requiredText,
      note: requiredText,
      icon: optionalText,
      order,
    }),
  ),
  experience: z.array(
    z.object({
      id: optionalId,
      range: requiredText,
      company: requiredText,
      role: requiredText,
      location: requiredText,
      bullets: z.array(requiredText),
      stack: requiredText,
      order,
    }),
  ),
  projects: z.array(
    z.object({
      id: optionalId,
      slug: requiredText,
      name: requiredText,
      year: requiredText,
      tag: requiredText,
      imageUrl: requiredText,
      summary: requiredText,
      techStack: z.array(requiredText),
      liveUrl: optionalText,
      githubUrl: optionalText,
      challenges: requiredText,
      futurePlans: requiredText,
      order,
    }),
  ),
  achievements: z.array(
    z.object({
      id: optionalId,
      title: requiredText,
      issuer: requiredText,
      year: requiredText,
      imageUrl: requiredText,
      verifyUrl: optionalText,
      order,
    }),
  ),
  heroStats: z.array(
    z.object({
      id: optionalId,
      label: requiredText,
      value: requiredText,
      order,
    }),
  ),
  contactInfo: z.object({
    id: z.string(),
    email: text,
    phone: text,
    whatsapp: text,
  }),
});

export async function GET() {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getHomeContent();
  return NextResponse.json({ ...content, admin: { email: admin.email } });
}

export async function PUT(request: Request) {
  const admin = await requireAdminForApi();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = contentSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid dashboard content",
        details: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const data = result.data;

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.profile.update({
          where: { id: data.profile.id },
          data: {
            name: data.profile.name,
            designation: data.profile.designation,
            headline: data.profile.headline,
            tagline: data.profile.tagline,
            availability: data.profile.availability,
            location: data.profile.location,
            currentCompany: data.profile.currentCompany,
            photoUrl: data.profile.photoUrl,
            resumeUrl: data.profile.resumeUrl,
            footerTagline: data.profile.footerTagline,
            stats: data.profile.stats,
          },
        });

        await tx.aboutMe.update({
          where: { id: data.aboutMe.id },
          data: {
            content: data.aboutMe.content,
            imageUrl: data.aboutMe.imageUrl,
            since: data.aboutMe.since,
            facts: data.aboutMe.facts,
          },
        });

        await tx.contactInfo.update({
          where: { id: data.contactInfo.id },
          data: {
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
            whatsapp: data.contactInfo.whatsapp,
          },
        });

        await replaceCollection(tx, "socialLink", data.socialLinks);
        await replaceCollection(tx, "skill", data.skillRows);
        await replaceCollection(tx, "education", data.education);
        await replaceCollection(tx, "experience", data.experience);
        await replaceCollection(tx, "project", data.projects);
        await replaceCollection(tx, "achievement", data.achievements);
        await replaceCollection(tx, "heroStat", data.heroStats);
      },
      {
        maxWait: 10_000,
        timeout: 30_000,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Dashboard save failed" },
      { status: 500 },
    );
  }

  revalidatePortfolioPaths();

  const content = await getHomeContent();
  return NextResponse.json({ ...content, admin: { email: admin.email } });
}

async function replaceCollection(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  model:
    "socialLink" | "skill" | "education" | "experience" | "project" | "achievement" | "heroStat",
  rows: Array<Record<string, unknown>>,
) {
  const delegate = tx[model] as {
    deleteMany: (args?: unknown) => Promise<unknown>;
    update: (args: unknown) => Promise<unknown>;
    create: (args: unknown) => Promise<unknown>;
  };
  const ids = rows.map((row) => row.id).filter((id): id is string => typeof id === "string");
  await delegate.deleteMany(ids.length ? { where: { id: { notIn: ids } } } : {});

  for (const row of rows) {
    const { id, createdAt, updatedAt, ...data } = row;
    void createdAt;
    void updatedAt;

    if (typeof id === "string") {
      await delegate.update({
        where: { id },
        data,
      });
    } else {
      await delegate.create({ data });
    }
  }
}
