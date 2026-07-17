// import { motion } from "framer-motion";
// import { BadgeCheck, ExternalLink } from "lucide-react";
// import Image from "next/image";
// import type { Achievement } from "@/generated/prisma/client";
// import { SectionHeader } from "./SectionHeader";

// export function Achievements({ achievements }: { achievements: Achievement[] }) {
//   if (!achievements.length) {
//     return null;
//   }

//   return (
//     <section id="achievements" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
//       <SectionHeader
//         index="03 / Achievements"
//         eyebrow="Credentials"
//         title={<>Proof points, certifications, and shipped learning.</>}
//       >
//         {achievements.length} {achievements.length === 1 ? "credential" : "certifications"} kept
//         current from the dashboard.
//       </SectionHeader>

//       <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
//         {achievements.map((achievement, index) => (
//           <motion.article
//             key={achievement.id}
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-80px" }}
//             transition={{ duration: 0.55, delay: index * 0.06 }}
//             className="group bg-background p-5"
//           >
//             <div className="relative aspect-[16/10] overflow-hidden border border-border bg-card">
//               <Image
//                 src={achievement.imageUrl}
//                 alt={achievement.title}
//                 fill
//                 sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
//                 className="object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//             </div>
//             <div className="mt-5 flex items-start justify-between gap-4">
//               <div>
//                 <p className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
//                   {achievement.issuer} · {achievement.year}
//                 </p>
//                 <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
//                   {achievement.title}
//                 </h3>
//               </div>
//               {achievement.verifyUrl ? (
//                 <a
//                   href={achievement.verifyUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/40 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
//                 >
//                   <BadgeCheck className="h-3.5 w-3.5" />
//                   Verified
//                   <ExternalLink className="h-3 w-3" />
//                 </a>
//               ) : null}
//             </div>
//           </motion.article>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import type { Achievement } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  const [activeImage, setActiveImage] = useState<Achievement | null>(null);

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
            <button
              type="button"
              onClick={() => setActiveImage(achievement)}
              className="relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden border border-border bg-card"
              aria-label={`View ${achievement.title} full size`}
            >
              <Image
                src={achievement.imageUrl}
                alt={achievement.title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                <span className="rounded-full bg-background/90 px-3 py-1.5 font-mono-tight text-[10px] uppercase tracking-widest text-foreground">
                  Click to enlarge
                </span>
              </div>
            </button>

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

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 sm:p-10"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                aria-label="Close"
                className="absolute -top-12 right-0 grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:-top-4 sm:-right-12"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center font-mono-tight text-xs uppercase tracking-widest text-white/70">
                {activeImage.issuer} · {activeImage.year}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
