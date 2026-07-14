import { motion } from "framer-motion";
import about from "@/assets/about.jpg";
import { SectionHeader } from "./SectionHeader";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader index="01 / About" eyebrow="The human" title={<>A generalist who <span className="italic text-primary">still</span> loves the craft.</>}>
        Six years of shipping — half in a two‑person startup, half in a design‑led agency.
      </SectionHeader>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
            <img
              src={about}
              alt="Workspace"
              width={1024}
              height={1280}
              loading="lazy"
              className="relative aspect-[4/5] w-full rounded-3xl border border-border object-cover"
            />
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-border bg-background px-4 py-3 font-mono-tight text-xs">
              <span className="text-muted-foreground">since</span>{" "}
              <span className="text-foreground">2019</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl leading-relaxed text-balance sm:text-3xl"
          >
            I write software the way a carpenter finishes a joint you'll never see —
            not because anyone will notice, but because <span className="text-primary">I would</span>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground"
          >
            I started with a hand‑me‑down ThinkPad and a physics degree that quietly turned
            into a career in code. Today I move between typed backends, design systems, and
            infrastructure — and I'm happiest at the seam between them, where the interesting
            trade‑offs live.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Off the keyboard: film photography, brutalist architecture, and the ongoing
            search for a decent flat‑white north of the river.
          </motion.p>

          <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
            {[
              { k: "Focus", v: "Product engineering" },
              { k: "Stack", v: "TS · Node · Postgres" },
              { k: "Timezone", v: "GMT +1" },
            ].map((i) => (
              <div key={i.k} className="rounded-2xl border border-border bg-surface/50 p-4">
                <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                  {i.k}
                </div>
                <div className="mt-1 text-sm font-medium">{i.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
