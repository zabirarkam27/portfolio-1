import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return null;
  }

  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        index="06 / Work"
        eyebrow="Selected projects"
        title={<>Things I built, still stand behind.</>}
      >
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
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-widest">
                <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">
                  {p.tag}
                </span>
                <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">
                  {p.year}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.techStack.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-2.5 py-1 text-[10px] font-mono-tight text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <Link
                href={`/projects/${p.slug}`}
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
