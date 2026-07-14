import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { Experience as ExperienceRecord } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Experience({ roles }: { roles: ExperienceRecord[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="experience"
      className="relative border-y border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          index="04 / Experience"
          eyebrow="Track record"
          title={<>Roles, receipts, and the things I actually shipped.</>}
        />

        <div className="mt-16">
          {roles.map((r, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={r.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-t border-border last:border-b"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[140px_1fr_auto_auto] sm:gap-8"
                >
                  <span className="font-mono-tight text-xs text-muted-foreground">{r.range}</span>
                  <div className="min-w-0">
                    <div className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                      {r.company}
                    </div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">{r.role}</div>
                  </div>
                  <span className="hidden font-mono-tight text-xs text-muted-foreground sm:block">
                    {r.location}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-colors group-hover:border-primary">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-[140px_1fr] sm:gap-8">
                        <div className="hidden sm:block" />
                        <div>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {r.bullets.map((b) => (
                              <li key={b} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                <span className="text-foreground/85">{b}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-5 font-mono-tight text-xs text-muted-foreground">
                            {r.stack}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
