import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 210_000, 64, "sha512").toString("hex");

  return `pbkdf2$${salt}$${hash}`;
}

async function main() {
  await prisma.profile.deleteMany();
  await prisma.aboutMe.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.heroStat.deleteMany();
  await prisma.contactInfo.deleteMany();

  await prisma.profile.create({
    data: {
      name: "Zabir Arkam",
      designation: "Full-Stack Engineer · 06 yrs",
      headline: "Building the quiet parts of the web.",
      tagline:
        "I'm Zabir Arkam — a full-stack developer who ships considered interfaces, resilient APIs, and everything the pixel forgets in between.",
      availability: "Available · Q3 2026",
      location: "Dhaka, Bangladesh",
      currentCompany: "",
      photoUrl: "/assets/portrait.png",
      resumeUrl: "#",
      footerTagline: "Design + engineering, quietly.",
      stats: [],
    },
  });

  await prisma.aboutMe.create({
    data: {
      imageUrl: "/assets/about.jpg",
      since: "2019",
      content: [
        "I write software the way a carpenter finishes a joint you'll never see — not because anyone will notice, but because I would.",
        "I started with a hand-me-down ThinkPad and a physics degree that quietly turned into a career in code. Today I move between typed backends, design systems, and infrastructure — and I'm happiest at the seam between them, where the interesting trade-offs live.",
        "Based in Dhaka, Bangladesh, I care about fast interfaces, durable APIs, and practical systems that stay easy to change.",
      ].join("\n\n"),
      facts: [
        { key: "Focus", value: "Product engineering" },
        { key: "Stack", value: "TS · Node · Postgres" },
        { key: "Timezone", value: "GMT +6" },
      ],
    },
  });

  await prisma.socialLink.createMany({
    data: [
      { platform: "GitHub", url: "#", order: 1 },
      { platform: "LinkedIn", url: "#", order: 2 },
      { platform: "Twitter", url: "#", order: 3 },
      { platform: "Facebook", url: "#", order: 4 },
    ],
  });

  const skillGroups = [
    {
      category: "Frontend",
      tag: "UI · UX · Motion",
      items: [
        { name: "React / Next", proficiency: 96 },
        { name: "TypeScript", proficiency: 94 },
        { name: "Tailwind & CSS", proficiency: 92 },
        { name: "Framer Motion", proficiency: 85 },
      ],
    },
    {
      category: "Backend",
      tag: "APIs · Data · Systems",
      items: [
        { name: "Node & Bun", proficiency: 92 },
        { name: "PostgreSQL", proficiency: 88 },
        { name: "Rust", proficiency: 70 },
        { name: "gRPC / tRPC", proficiency: 82 },
      ],
    },
    {
      category: "Tools",
      tag: "Infra · Design · DX",
      items: [
        { name: "AWS / Cloudflare", proficiency: 85 },
        { name: "Docker / K8s", proficiency: 78 },
        { name: "Figma", proficiency: 80 },
        { name: "Git / CI", proficiency: 95 },
      ],
    },
  ];

  for (const [groupIndex, group] of skillGroups.entries()) {
    for (const [itemIndex, item] of group.items.entries()) {
      await prisma.skill.create({
        data: {
          ...item,
          category: group.category,
          tag: group.tag,
          order: groupIndex * 100 + itemIndex,
        },
      });
    }
  }

  const tags = [
    "REST",
    "GraphQL",
    "Postgres",
    "Redis",
    "Prisma",
    "Zod",
    "Vitest",
    "Playwright",
    "Stripe",
    "OAuth",
    "WebSockets",
    "OpenAI",
    "S3",
    "Terraform",
    "Vercel",
    "Cloudflare",
  ];

  await prisma.skill.createMany({
    data: tags.map((name, index) => ({
      name,
      category: "Tag",
      order: index,
    })),
  });

  await prisma.contactInfo.create({
    data: {
      email: "",
      phone: "",
      whatsapp: "",
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? "zabirarkam27@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  await prisma.adminAccount.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
