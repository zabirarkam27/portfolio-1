import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Education as EducationRecord } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

const icons: Record<string, LucideIcon> = {
  Award,
  GraduationCap,
};

export function Education({ items }: { items: EducationRecord[] }) {
  if (!items.length) return null;

  return (
    <section id="education" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeader
        index="04 / Education"
        eyebrow="Academic Journey"
        title={<>Building a strong engineering foundation.</>}
      />

      <div className="relative mt-20">
        {/* Timeline */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-linear-to-b from-primary via-primary/30 to-transparent md:block" />

        <div className="space-y-10">
          {items.map((it, index) => {
            const Icon = icons[it.icon ?? ""] ?? GraduationCap;

            return (
              <motion.div
                key={`${it.school}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                className="relative md:pl-20"
              >
                {/* Timeline Icon */}
                <div className="absolute left-0 top-6 hidden md:flex">
                  <div className="group relative">
                    {/* Glow */}
                    <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl opacity-0 transition duration-500 group-hover:opacity-100" />

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/20 via-primary/10 to-transparent shadow-lg shadow-primary/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Floating Glow */}
                  <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:scale-125" />

                  {/* Left Accent */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-primary via-primary/50 to-transparent" />

                  {/* Content */}
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        {it.school}
                      </h3>

                      <p className="mt-2 text-base font-semibold text-primary">{it.degree}</p>

                      {/* Accent Line */}
                      <div className="mt-4 h-1 w-14 rounded-full bg-linear-to-r from-primary to-primary/20 transition-all duration-500 group-hover:w-24" />
                    </div>

                    <span className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-lg shadow-primary/10 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                      {it.year}
                    </span>
                  </div>

                  {/* Description */}
                  {it.note && (
                    <p className="relative mt-6 max-w-3xl leading-8 text-muted-foreground">
                      {it.note}
                    </p>
                  )}

                  {/* Hover Ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-500 group-hover:ring-primary/20" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
