import { motion } from "framer-motion";
import { ArrowDownRight, Github, Linkedin, Twitter, Facebook, MapPin } from "lucide-react";
import Image from "next/image";
import {
  SiCloudflare,
  SiCss,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRust,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVitest,
  SiZod,
} from "react-icons/si";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import type { ProfileContent } from "@/lib/content-types";
import type { HeroStat, Skill, SocialLink } from "@/generated/prisma/client";

const socialIcons: Record<string, LucideIcon> = {
  Facebook,
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter,
};

const techIcons: Record<string, { icon: IconType; color: string }> = {
  cloudflare: { icon: SiCloudflare, color: "#f38020" },
  css: { icon: SiCss, color: "#663399" },
  docker: { icon: SiDocker, color: "#2496ed" },
  figma: { icon: SiFigma, color: "#f24e1e" },
  firebase: { icon: SiFirebase, color: "#ffca28" },
  framer: { icon: SiFramer, color: "#0055ff" },
  git: { icon: SiGit, color: "#f05032" },
  github: { icon: SiGithub, color: "#f5f5f5" },
  graphql: { icon: SiGraphql, color: "#e10098" },
  html: { icon: SiHtml5, color: "#e34f26" },
  javascript: { icon: SiJavascript, color: "#f7df1e" },
  mongodb: { icon: SiMongodb, color: "#47a248" },
  next: { icon: SiNextdotjs, color: "#f5f5f5" },
  node: { icon: SiNodedotjs, color: "#5fa04e" },
  postgres: { icon: SiPostgresql, color: "#4169e1" },
  postgresql: { icon: SiPostgresql, color: "#4169e1" },
  prisma: { icon: SiPrisma, color: "#2d3748" },
  react: { icon: SiReact, color: "#61dafb" },
  redis: { icon: SiRedis, color: "#ff4438" },
  rust: { icon: SiRust, color: "#ce412b" },
  tailwind: { icon: SiTailwindcss, color: "#06b6d4" },
  typescript: { icon: SiTypescript, color: "#3178c6" },
  vercel: { icon: SiVercel, color: "#f5f5f5" },
  vitest: { icon: SiVitest, color: "#6e9f18" },
  zod: { icon: SiZod, color: "#3068b7" },
};

export function Hero({
  profile,
  socialLinks,
  heroStats,
  skills,
}: {
  profile: ProfileContent;
  socialLinks: SocialLink[];
  heroStats: HeroStat[];
  skills: Skill[];
}) {
  const [headlineLead, headlineAfterQuiet = ""] = profile.headline.split("quiet");
  const [quietLineRest = "", ...headlineTailParts] = headlineAfterQuiet.trim().split(" ");
  const headlineTail = headlineTailParts.join(" ");
  const currentCompany = profile.currentCompany.trim();
  const visibleHeroStats = heroStats.length
    ? heroStats
    : profile.stats.map((stat, index) => ({
        id: stat.key,
        label: stat.value,
        value: stat.key,
        order: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
  const featuredSkills = skills
    .filter((skill) => skill.category !== "Tag")
    .filter((skill) => getTechIcon(skill))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .slice(0, 12);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-20"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-520px w-900px -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* meta bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {profile.availability}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-3 w-3" /> {profile.location}
          </span>
          <span className="hidden sm:inline">{profile.designation}</span>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-8 xl:grid-cols-[minmax(0,760px)_minmax(320px,420px)] xl:gap-16">
          {/* Left column: headline */}
          <div className="order-1">
            <motion.h1
              aria-label={profile.headline}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-760px font-display text-[clamp(2.65rem,7vw,6.15rem)] font-semibold leading-[0.95] tracking-tight text-balance min-[900px]:text-[clamp(3.75rem,5.8vw,5.5rem)] xl:text-[clamp(4.2rem,6.2vw,6.15rem)]"
            >
              {headlineLead.trim()}
              <br />
              <span className="italic text-primary">quiet</span> {quietLineRest}
              <br />
              {headlineTail}
            </motion.h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.tagline.split(profile.name)[0]}
              <span className="text-foreground">{profile.name}</span>
              {profile.tagline.split(profile.name)[1]}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={profile.resumeUrl}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_10px_40px_-10px_var(--color-primary)]"
              >
                Download resume
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:-rotate-45" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-foreground"
              >
                See selected work
              </a>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {socialLinks.map((s) => {
                const Icon = socialIcons[s.platform] ?? Github;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    aria-label={s.platform}
                    className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-border transition-colors hover:border-primary"
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                    <Icon className="relative h-5 w-5 transition-colors group-hover:text-primary-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="order-2 mx-auto flex w-full max-w-420px flex-col items-center gap-7 min-[900px]:mx-0 min-[900px]:items-end">
            {/* Portrait */}
            <div>
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-linear-to-br from-primary/30 via-transparent to-transparent blur-2xl" />
                <div className="relative aspect-square w-72 overflow-hidden rounded-full border border-primary/40 sm:w-84 min-[900px]:w-80 xl:w-96">
                  <Image
                    src={profile.photoUrl}
                    alt={`Portrait of ${profile.name}`}
                    fill
                    priority
                    sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 20rem, (min-width: 640px) 21rem, 18rem"
                    className="h-full w-full object-cover"
                  />
                </div>
                {currentCompany && currentCompany !== "-" ? (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 px-4 py-1.5 font-mono-tight text-[10px] uppercase tracking-widest backdrop-blur">
                    ★ Currently @ {currentCompany}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right stat rail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="grid w-full grid-cols-3 gap-4 text-center lg:grid-cols-1 lg:gap-5 lg:text-right"
            >
              {visibleHeroStats.map((stat) => (
                <Stat key={stat.id} k={stat.value} v={stat.label} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-14 overflow-hidden border-y border-border py-4 sm:mt-16 lg:mt-18">
        <div className="flex whitespace-nowrap marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-10 pr-10 font-display text-2xl font-medium sm:text-3xl"
            >
              {[
                "TypeScript",
                "Next.js",
                "JavaScript",
                "React",
                "Node.js",
                "PostgreSQL",
                "Docker",
                "GO",
                "Express.js",
                "REST API",
                "Prisma ORM",
                "Stripe Checkout",
                "FastAPI",
              ].map((w) => (
                <span key={w} className="flex items-center gap-10">
                  <span className="text-muted-foreground">{w}</span>
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {featuredSkills.length ? (
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-3 gap-5 px-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6">
          {featuredSkills.map((skill) => {
            const tech = getTechIcon(skill);
            if (!tech) return null;

            const Icon = tech.icon;

            return (
              <div
                key={skill.id}
                title={skill.name}
                className="group flex flex-col items-center justify-center"
              >
                {/* Icon Box */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(255,215,0,0.18)]">
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                  <Icon
                    className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: tech.color }}
                  />
                </div>

                {/* Skill Name */}
                <span className="mt-3 text-center text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="max-w-55">
      <div className="font-display text-4xl font-semibold text-primary">{k}</div>
      <div className="mt-1 text-sm text-muted-foreground">{v}</div>
    </div>
  );
}

function getTechIcon(skill: Skill) {
  const source = `${skill.icon ?? ""} ${skill.name}`.toLowerCase();
  const match = Object.entries(techIcons).find(([key]) => source.includes(key));
  return match?.[1] ?? null;
}
