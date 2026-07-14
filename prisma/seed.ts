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
  await prisma.contactInfo.deleteMany();

  await prisma.profile.create({
    data: {
      name: "Ari Novak",
      designation: "Full-Stack Engineer · 06 yrs",
      headline: "Building the quiet parts of the web.",
      tagline:
        "I'm Ari Novak — a full-stack developer who ships considered interfaces, resilient APIs, and everything the pixel forgets in between.",
      availability: "Available · Q3 2026",
      location: "Lisbon → Remote",
      currentCompany: "Northwind Labs",
      photoUrl: "/assets/portrait.png",
      resumeUrl: "#",
      footerTagline: "Design + engineering, quietly.",
      stats: [
        { key: "06+", value: "Years shipping production systems" },
        { key: "42", value: "Products launched end-to-end" },
        { key: "11", value: "Open-source repos & contributions" },
      ],
    },
  });

  await prisma.aboutMe.create({
    data: {
      imageUrl: "/assets/about.jpg",
      since: "2019",
      content: [
        "I write software the way a carpenter finishes a joint you'll never see — not because anyone will notice, but because I would.",
        "I started with a hand-me-down ThinkPad and a physics degree that quietly turned into a career in code. Today I move between typed backends, design systems, and infrastructure — and I'm happiest at the seam between them, where the interesting trade-offs live.",
        "Off the keyboard: film photography, brutalist architecture, and the ongoing search for a decent flat-white north of the river.",
      ].join("\n\n"),
      facts: [
        { key: "Focus", value: "Product engineering" },
        { key: "Stack", value: "TS · Node · Postgres" },
        { key: "Timezone", value: "GMT +1" },
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

  await prisma.education.createMany({
    data: [
      {
        year: "2017 — 2021",
        school: "University of Porto",
        degree: "B.Sc. Computer Science, minor in Physics",
        note: "Thesis on distributed systems & CRDTs. Graduated with distinction (17.8/20).",
        icon: "GraduationCap",
        order: 1,
      },
      {
        year: "2021",
        school: "École 42 · Lisbon",
        degree: "Advanced Systems Programming (C / Unix)",
        note: "Piscine + 18-month project track.",
        icon: "Award",
        order: 2,
      },
      {
        year: "2022 — ongoing",
        school: "Self-directed",
        degree: "Rust, distributed systems, type theory",
        note: "Reading group + weekend implementations.",
        icon: "Award",
        order: 3,
      },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        range: "2024 — Now",
        company: "Northwind Labs",
        role: "Senior Full-Stack Engineer",
        location: "Remote · EU",
        bullets: [
          "Lead engineer on a payments-adjacent product processing 2M+ tx/mo.",
          "Migrated legacy monolith to a modular Turbo/Bun setup — CI 4× faster.",
          "Owned end-to-end delivery of a new dashboard suite (Figma → prod).",
        ],
        stack: "TypeScript · Bun · Postgres · Cloudflare · Tailwind",
        order: 1,
      },
      {
        range: "2022 — 2024",
        company: "Studio Halcyon",
        role: "Product Engineer",
        location: "Lisbon",
        bullets: [
          "Shipped 12 client products across fintech, cultural & DTC brands.",
          "Built the studio's internal component & motion system (used across 40+ projects).",
          "Mentored two junior engineers into confident mid-levels.",
        ],
        stack: "Next.js · Prisma · Framer Motion · Vercel",
        order: 2,
      },
      {
        range: "2020 — 2022",
        company: "Kernel & Co.",
        role: "Full-Stack Developer",
        location: "Porto",
        bullets: [
          "Second engineering hire at a Series A startup (0 → 40k users).",
          "Owned auth, billing, and the internal admin platform end-to-end.",
        ],
        stack: "Node · React · Postgres · AWS",
        order: 3,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        slug: "orbit",
        name: "Orbit Analytics",
        year: "2025",
        tag: "SaaS · Data",
        imageUrl: "/assets/project-1.jpg",
        summary:
          "A calm analytics surface for teams drowning in dashboards. Realtime, keyboard-first, extensible.",
        techStack: ["Next.js", "tRPC", "ClickHouse", "Tailwind", "Motion"],
        liveUrl: "#",
        githubUrl: "#",
        challenges:
          "Streaming millions of events per hour without UI jank.\nA design language flexible enough for dashboards, tables, and long-form.\nOnboarding a legacy team without breaking their muscle memory.",
        futurePlans:
          "Native command palette + saved views.\nLocal-first sync so the app opens instantly, offline.\nDeeper primitives for annotation and shared context.",
        order: 1,
      },
      {
        slug: "atelier",
        name: "Atelier Commerce",
        year: "2024",
        tag: "E-commerce · CMS",
        imageUrl: "/assets/project-2.jpg",
        summary:
          "Headless storefront platform for independent fashion labels. Editorial-first, checkout in three taps.",
        techStack: ["Remix", "Shopify", "Postgres", "Stripe"],
        liveUrl: "#",
        githubUrl: "#",
        challenges:
          "Streaming millions of events per hour without UI jank.\nA design language flexible enough for dashboards, tables, and long-form.\nOnboarding a legacy team without breaking their muscle memory.",
        futurePlans:
          "Native command palette + saved views.\nLocal-first sync so the app opens instantly, offline.\nDeeper primitives for annotation and shared context.",
        order: 2,
      },
      {
        slug: "sonder",
        name: "Sonder AI",
        year: "2024",
        tag: "AI · Mobile",
        imageUrl: "/assets/project-3.jpg",
        summary:
          "An on-device journaling companion. Streaming inference, gentle motion, no dark patterns.",
        techStack: ["Expo", "Rust", "SQLite", "OpenAI"],
        liveUrl: "#",
        githubUrl: "#",
        challenges:
          "Streaming millions of events per hour without UI jank.\nA design language flexible enough for dashboards, tables, and long-form.\nOnboarding a legacy team without breaking their muscle memory.",
        futurePlans:
          "Native command palette + saved views.\nLocal-first sync so the app opens instantly, offline.\nDeeper primitives for annotation and shared context.",
        order: 3,
      },
    ],
  });

  await prisma.contactInfo.create({
    data: {
      email: "hello@ari.dev",
      phone: "+351 910 000 000",
      whatsapp: "#",
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
