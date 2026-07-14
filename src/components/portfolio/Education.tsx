import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const items = [
  {
    year: "2017 — 2021",
    school: "University of Porto",
    degree: "B.Sc. Computer Science, minor in Physics",
    note: "Thesis on distributed systems & CRDTs. Graduated with distinction (17.8/20).",
    icon: GraduationCap,
  },
  {
    year: "2021",
    school: "École 42 · Lisbon",
    degree: "Advanced Systems Programming (C / Unix)",
    note: "Piscine + 18‑month project track.",
    icon: Award,
  },
  {
    year: "2022 — ongoing",
    school: "Self‑directed",
    degree: "Rust, distributed systems, type theory",
    note: "Reading group + weekend implementations.",
    icon: Award,
  },
];

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader index="03 / Education" eyebrow="School of thought" title={<>Where the fundamentals came from.</>} />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.school}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <it.icon className="h-4 w-4" />
              </div>
              <span className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                {it.year}
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold leading-tight">{it.school}</h3>
            <p className="mt-1 text-sm text-primary">{it.degree}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{it.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
