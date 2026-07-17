// import { motion } from "framer-motion";
// import { GraduationCap, Award } from "lucide-react";
// import type { LucideIcon } from "lucide-react";
// import type { Education as EducationRecord } from "@/generated/prisma/client";
// import { SectionHeader } from "./SectionHeader";

// const icons: Record<string, LucideIcon> = {
//   Award,
//   GraduationCap,
// };

// export function Education({ items }: { items: EducationRecord[] }) {
//   if (!items.length) {
//     return null;
//   }

//   return (
//     <section id="education" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
//       <SectionHeader
//         index="04 / Education"
//         eyebrow="School of thought"
//         title={<>Where the fundamentals came from.</>}
//       />

//       <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
//         {items.map((it, i) => {
//           const Icon = icons[it.icon ?? ""] ?? Award;

//           return (
//             <motion.div
//               key={it.school}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, margin: "-60px" }}
//               transition={{ duration: 0.6, delay: i * 0.1 }}
//               className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
//                   <Icon className="h-4 w-4" />
//                 </div>
//                 <span className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
//                   {it.year}
//                 </span>
//               </div>
//               <h3 className="mt-6 font-display text-xl font-semibold leading-tight">{it.school}</h3>
//               <p className="mt-1 text-sm text-primary">{it.degree}</p>
//               <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{it.note}</p>
//             </motion.div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

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
        <div className="absolute left-6 top-0 hidden h-full w-px bg-linear-to-b from-primary/40 via-border to-transparent md:block" />

        <div className="space-y-10">
          {items.map((it, index) => {
            const Icon = icons[it.icon ?? ""] ?? GraduationCap;

            return (
              <motion.div
                key={`${it.school}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.12,
                }}
                className="relative md:pl-20"
              >
                {/* Timeline Icon */}
                <div className="absolute left-0 top-6 hidden md:flex">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/20 via-primary/10 to-transparent shadow-lg shadow-primary/10 backdrop-blur-xl">
                    <Icon className="h-5 w-5 text-primary" />

                    <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-xl opacity-40" />
                  </div>
                </div>

                {/* Card */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Top */}
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">
                        {it.school}
                      </h3>

                      <p className="mt-2 text-base font-medium text-primary"> {it.degree}</p>
                    </div>

                    <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                      {it.year}
                    </span>
                  </div>

                  {/* Description */}
                  {it.note && (
                    <p className="relative mt-6 max-w-3xl leading-7 text-muted-foreground">
                      {it.note}
                    </p>
                  )}

                  {/* Decorative Line */}
                  <div className="mt-8 h-px bg-linear-to-r from-primary/30 via-border to-transparent" />

                  {/* Footer */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                      Academic
                    </span>

                    <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                      Engineering
                    </span>

                    <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                      Continuous Learning
                    </span>
                  </div>

                  {/* Hover Border */}
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
