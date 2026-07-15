import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { Achievement } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) {
    return null;
  }

  return (
    <section id="achievements" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        index="03 / Achievements"
        eyebrow="Credentials"
        title={<>Proof points, certifications, and shipped learning.</>}
      >
        {achievements.length} {achievements.length === 1 ? "credential" : "certifications"} kept
        current from the dashboard.
      </SectionHeader>

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement, index) => (
          <motion.article
            key={achievement.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="group bg-background p-5"
          >
            <div className="relative aspect-[16/10] overflow-hidden border border-border bg-card">
              <Image
                src={achievement.imageUrl}
                alt={achievement.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                  {achievement.issuer} · {achievement.year}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  {achievement.title}
                </h3>
              </div>
              {achievement.verifyUrl ? (
                <a
                  href={achievement.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/40 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
