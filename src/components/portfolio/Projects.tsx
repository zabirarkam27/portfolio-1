import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import { SectionHeader } from "./SectionHeader";

export const projects = [
  {
    slug: "orbit",
    year: "2025",
    title: "Orbit Analytics",
    tag: "SaaS · Data",
    desc: "A calm analytics surface for teams drowning in dashboards. Realtime, keyboard‑first, extensible.",
    img: p1,
    stack: ["Next.js", "tRPC", "ClickHouse", "Tailwind", "Motion"],
  },
  {
    slug: "atelier",
    year: "2024",
    title: "Atelier Commerce",
    tag: "E‑commerce · CMS",
    desc: "Headless storefront platform for independent fashion labels. Editorial‑first, checkout in three taps.",
    img: p2,
    stack: ["Remix", "Shopify", "Postgres", "Stripe"],
  },
  {
    slug: "sonder",
    year: "2024",
    title: "Sonder AI",
    tag: "AI · Mobile",
    desc: "An on‑device journaling companion. Streaming inference, gentle motion, no dark patterns.",
    img: p3,
    stack: ["Expo", "Rust", "SQLite", "OpenAI"],
  },
];

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader index="05 / Work" eyebrow="Selected projects" title={<>Things I built, still stand behind.</>}>
        A short slice of the last three years. Each ships to real customers today.
      </SectionHeader>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-widest">
                <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">{p.tag}</span>
                <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">{p.year}</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full border border-border px-2.5 py-1 text-[10px] font-mono-tight text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>

              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="mt-6 inline-flex items-center justify-between rounded-full border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
              >
                View case study
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
