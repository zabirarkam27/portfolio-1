import { motion } from "framer-motion";
import type { SkillGroup } from "@/lib/content-types";
import { SectionHeader } from "./SectionHeader";

export function Skills({ groups, tags }: { groups: SkillGroup[]; tags: string[] }) {
  return (
    <section id="skills" className="relative border-y border-border bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          index="02 / Skills"
          eyebrow="Toolbox"
          title={<>Sharp on the front, calm on the back.</>}
        >
          A working stack, not a shopping list. Below is what I actually reach for on Monday
          mornings.
        </SectionHeader>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {groups.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: gi * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-semibold">{g.label}</h3>
                <span className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                  0{gi + 1}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{g.tag}</p>

              <div className="mt-8 space-y-5">
                {g.items.map((s, i) => (
                  <div key={s.name}>
                    <div className="mb-2 flex items-baseline justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="font-mono-tight text-xs text-muted-foreground">{s.lvl}</span>
                    </div>
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-border/60">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.lvl}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tag cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex flex-wrap gap-2"
        >
          {tags.map((t) => (
            <span
              key={t}
              className="cursor-default rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
