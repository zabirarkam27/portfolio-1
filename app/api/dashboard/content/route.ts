import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminForApi } from "@/lib/admin-auth";
import { getHomeContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";

const optionalId = z.string().optional();
const order = z.coerce.number().int().default(0);

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  designation: z.string().min(1),
  headline: z.string().min(1),
  tagline: z.string().min(1),
  availability: z.string().min(1),
  location: z.string().min(1),
  currentCompany: z.string().min(1),
  photoUrl: z.string().min(1),
  resumeUrl: z.string().min(1),
  footerTagline: z.string().min(1),
  stats: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })),
});

const contentSchema = z.object({
  profile: profileSchema,
  aboutMe: z.object({
    id: z.string(),
    content: z.string().min(1),
    imageUrl: z.string().min(1),
    since: z.string().min(1),
    facts: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })),
  }),
  socialLinks: z.array(
    z.object({
      id: optionalId,
      platform: z.string().min(1),
      url: z.string().min(1),
      order,
    }),
  ),
  skillRows: z.array(
    z.object({
      id: optionalId,
      name: z.string().min(1),
      category: z.string().min(1),
      proficiency: z.coerce.number().int().min(0).max(100).nullable().optional(),
      icon: z.string().nullable().optional(),
      tag: z.string().nullable().optional(),
      order,
    }),
  ),
  education: z.array(
    z.object({
      id: optionalId,
      year: z.string().min(1),
      school: z.string().min(1),
      degree: z.string().min(1),
      note: z.string().min(1),
      icon: z.string().nullable().optional(),
      order,
    }),
  ),
  experience: z.array(
    z.object({
      id: optionalId,
      range: z.string().min(1),
      company: z.string().min(1),
      role: z.string().min(1),
      location: z.string().min(1),
      bullets: z.array(z.string().min(1)),
      stack: z.string().min(1),
      order,
    }),
  ),
  projects: z.array(
    z.object({
      id: optionalId,
      slug: z.string().min(1),
      name: z.string().min(1),
      year: z.string().min(1),
      tag: z.string().min(1),
      imageUrl: z.string().min(1),
      summary: z.string().min(1),
      techStack: z.array(z.string().min(1)),
      liveUrl: z.string().nullable().optional(),
      githubUrl: z.string().nullable().optional(),
      challenges: z.string().min(1),
      futurePlans: z.string().min(1),
      order,
    }),
  ),
  contactInfo: z.object({
    id: z.string(),
    email: z.string().min(1),
    phone: z.string().min(1),
    whatsapp: z.string().min(1),
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
    return NextResponse.json({ error: "Invalid dashboard content" }, { status: 400 });
  }

  const data = result.data;

  await prisma.$transaction(async (tx) => {
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
  });

  const content = await getHomeContent();
  return NextResponse.json({ ...content, admin: { email: admin.email } });
}

async function replaceCollection(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  model: "socialLink" | "skill" | "education" | "experience" | "project",
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
