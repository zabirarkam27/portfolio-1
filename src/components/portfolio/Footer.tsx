import { Github, Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-sm font-bold">
              A
            </span>
            <div>
              <div className="font-display text-sm font-semibold">ari.dev</div>
              <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                Design + engineering, quietly.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[Github, Linkedin, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 font-mono-tight text-[11px] text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Ari Novak. All rights reserved.</span>
          <span>Handcrafted in Lisbon · v2.6</span>
        </div>
      </div>
    </footer>
  );
}
