import { motion } from "framer-motion";
import { ArrowDownRight, Github, Linkedin, Twitter, Facebook, MapPin } from "lucide-react";
import portrait from "@/assets/portrait.jpg";

const socials = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* meta bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-tight text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available · Q3 2026
          </span>
          <span className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Lisbon → Remote</span>
          <span className="hidden sm:inline">Full‑Stack Engineer · 06 yrs</span>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Left column: headline */}
          <div className="order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-tight text-balance"
            >
              Building the
              <br />
              <span className="italic text-primary">quiet</span> parts
              <br />
              of the web.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              I'm <span className="text-foreground">Ari Novak</span> — a full‑stack developer who ships
              considered interfaces, resilient APIs, and everything the pixel forgets in between.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_10px_40px_-10px_var(--color-primary)]"
              >
                Download résumé
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:rotate-[-45deg]" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors hover:border-foreground"
              >
                See selected work
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mt-10 flex items-center gap-2"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-border transition-colors hover:border-primary"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                  <s.icon className="relative h-4 w-4 transition-colors group-hover:text-primary-foreground" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 mx-auto lg:order-2"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-transparent blur-2xl" />
              <div className="relative aspect-square w-64 overflow-hidden rounded-full border border-primary/40 sm:w-80 lg:w-72 xl:w-80">
                <img
                  src={portrait}
                  alt="Portrait of Ari Novak"
                  width={1024}
                  height={1280}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 px-4 py-1.5 font-mono-tight text-[10px] uppercase tracking-widest backdrop-blur">
                ★ Currently @ Northwind Labs
              </div>
            </div>
          </motion.div>

          {/* Right stat rail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="order-3 flex flex-col gap-6 lg:items-end lg:text-right"
          >
            <Stat k="06+" v="Years shipping production systems" />
            <Stat k="42" v="Products launched end‑to‑end" />
            <Stat k="11" v="Open‑source repos & contributions" />
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative mt-20 overflow-hidden border-y border-border py-4">
        <div className="flex whitespace-nowrap marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10 font-display text-2xl font-medium sm:text-3xl">
              {["TypeScript", "React", "Node.js", "PostgreSQL", "Rust", "AWS", "Design systems", "Edge compute"].map((w) => (
                <span key={w} className="flex items-center gap-10">
                  <span className="text-muted-foreground">{w}</span>
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="max-w-[220px]">
      <div className="font-display text-4xl font-semibold text-primary">{k}</div>
      <div className="mt-1 text-sm text-muted-foreground">{v}</div>
    </div>
  );
}
