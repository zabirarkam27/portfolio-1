import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { projects } from "@/components/portfolio/Projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.project.title} — Ari Novak` : "Project" },
      { name: "description", content: loaderData?.project.desc ?? "" },
    ],
  }),
  component: ProjectPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      Project not found.
    </div>
  ),
});

function ProjectPage() {
  const { project } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground grain">
      <Navbar />

      <article className="mx-auto max-w-5xl px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to work
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10"
        >
          <div className="flex items-center gap-4 font-mono-tight text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="text-primary">{project.year}</span>
            <span className="h-px w-8 bg-border" />
            <span>{project.tag}</span>
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight sm:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{project.desc}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Visit live site <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-foreground"
            >
              <Github className="h-4 w-4" /> Source
            </a>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-14 overflow-hidden rounded-3xl border border-border"
        >
          <img
            src={project.img}
            alt={project.title}
            width={1200}
            height={800}
            className="w-full"
          />
        </motion.div>

        {/* Meta grid */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-y border-border py-8 sm:grid-cols-4">
          <Meta k="Role" v="Lead engineer" />
          <Meta k="Timeline" v="9 months" />
          <Meta k="Team" v="4 people" />
          <Meta k="Status" v="Shipped" />
        </div>

        <div className="mt-8">
          <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
            Stack
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((s: string) => (
              <span
                key={s}
                className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-xs text-foreground/85"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Block title="The brief">
          The team came in with a messy internal reporting stack, six overlapping tools, and no
          single source of truth. My job was to design and build a calm, opinionated analytics
          surface — one that respected keyboards, respected attention, and got out of the way.
        </Block>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Callout title="Challenges" tint>
            <ul className="space-y-2">
              <li>· Streaming millions of events per hour without UI jank.</li>
              <li>· A design language flexible enough for dashboards, tables, and long‑form.</li>
              <li>· Onboarding a legacy team without breaking their muscle memory.</li>
            </ul>
          </Callout>
          <Callout title="Future improvements">
            <ul className="space-y-2">
              <li>· Native command palette + saved views.</li>
              <li>· Local‑first sync so the app opens instantly, offline.</li>
              <li>· Deeper primitives for annotation and shared context.</li>
            </ul>
          </Callout>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-border pt-8">
          <div className="font-mono-tight text-xs text-muted-foreground">Next project</div>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-display text-2xl font-semibold hover:text-primary sm:text-3xl"
          >
            Back to index
            <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
        {k}
      </div>
      <div className="mt-1 text-sm font-medium">{v}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}

function Callout({ title, children, tint = false }: { title: string; children: React.ReactNode; tint?: boolean }) {
  return (
    <div
      className={
        "rounded-3xl border p-6 " +
        (tint ? "border-primary/30 bg-primary/[0.04]" : "border-border bg-card")
      }
    >
      <div className="flex items-center gap-2">
        <span className={"h-1.5 w-1.5 rounded-full " + (tint ? "bg-primary" : "bg-muted-foreground")} />
        <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
          {title}
        </div>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}
