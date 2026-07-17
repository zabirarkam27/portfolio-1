// import { motion } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import type { Project } from "@/generated/prisma/client";
// import { SectionHeader } from "./SectionHeader";

// export function Projects({ projects }: { projects: Project[] }) {
//   if (!projects.length) {
//     return null;
//   }

//   return (
//     <section id="work" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
//       <SectionHeader
//         index="03 / Work"
//         eyebrow="Selected projects"
//         title={<>Things I built, still stand behind.</>}
//       >
//         A short slice of the last three years. Each ships to real customers today.
//       </SectionHeader>

//       <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
//         {projects.map((p, i) => (
//           <motion.article
//             key={p.slug}
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-80px" }}
//             transition={{ duration: 0.6, delay: i * 0.08 }}
//             className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40"
//           >
//             <div className="relative aspect-4/3 overflow-hidden">
//               <Image
//                 src={p.imageUrl}
//                 alt={p.name}
//                 fill
//                 sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
//                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//               <div className="absolute inset-x-3 top-3 flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-widest">
//                 <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">
//                   {p.tag}
//                 </span>
//                 <span className="rounded-full bg-background/70 px-2.5 py-1 backdrop-blur">
//                   {p.year}
//                 </span>
//               </div>
//             </div>

//             <div className="flex flex-1 flex-col p-6">
//               <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
//               <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
//                 {p.summary}
//               </p>

//               <div className="mt-5 flex flex-wrap gap-1.5">
//                 {p.techStack.slice(0, 3).map((s) => (
//                   <span
//                     key={s}
//                     className="rounded-full border border-border px-2.5 py-1 text-[10px] font-mono-tight text-muted-foreground"
//                   >
//                     {s}
//                   </span>
//                 ))}
//               </div>

//               <Link
//                 href={`/projects/${p.slug}`}
//                 className="mt-6 inline-flex items-center justify-between rounded-full border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
//               >
//                 View case study
//                 <ArrowUpRight className="h-4 w-4" />
//               </Link>
//             </div>
//           </motion.article>
//         ))}
//       </div>
//     </section>
//   );
// }

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeader
        index="03 / Work"
        eyebrow="Selected Projects"
        title={<>Things I built, still stand behind.</>}
      >
        A short slice of the projects I've crafted with a focus on user experience, performance, and
        clean engineering.
      </SectionHeader>

      <div className="mt-20 space-y-28">
        {projects.map((p, index) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
            }}
            className={`grid items-center gap-12 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image */}
            <div className="group relative mx-auto w-full max-w-[460px]">
              {/* Glow */}
              <div className="absolute -inset-5 rounded-[40px] bg-primary/10 blur-3xl opacity-0 transition duration-700 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>

                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                    {p.tag}
                  </span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px)460px,100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <span className="text-sm font-semibold tracking-[0.35em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <h3 className="text-3xl font-bold tracking-tight transition-colors duration-300 hover:text-primary">
                  {p.name}
                </h3>

                <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  {p.year}
                </span>
              </div>

              <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-primary/20" />
              {/* Description */}
              <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">{p.summary}</p>

              {/* Tech Stack */}
              <div className="mt-8 flex flex-wrap gap-2">
                {p.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group/link inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/60 px-5 py-3 text-sm font-semibold backdrop-blur transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                >
                  <span>View Case Study</span>

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                </Link>
              </div>

              {/* Decorative Background */}
              <div className="pointer-events-none absolute -right-10 top-0 hidden h-40 w-40 rounded-full bg-primary/5 blur-3xl lg:block" />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
