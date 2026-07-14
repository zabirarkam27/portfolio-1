import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeader({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16"
    >
      <div className="flex items-center gap-4 font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        <span className="text-primary">{index}</span>
        <span className="h-px w-10 bg-border" />
        <span>{eyebrow}</span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {children ? <div className="max-w-md text-muted-foreground">{children}</div> : null}
      </div>
    </motion.div>
  );
}
