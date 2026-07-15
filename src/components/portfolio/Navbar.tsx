import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const links = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "px-3 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 transition-all duration-500",
            scrolled
              ? "rounded-full border border-border bg-background/70 backdrop-blur-xl"
              : "border-b border-transparent",
          )}
        >
          <a href="#top" className="group flex items-center gap-2">
            <img
              src={theme === "dark" ? "/assets/logo-light.png" : "/assets/logo-dark.png"}
              alt="Zabir Arkam"
              className="h-8 w-auto"
            />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="group relative rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <a
              href="#contact"
              className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-block"
            >
              Let's talk
            </a>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm border-l border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="group flex items-baseline justify-between border-b border-border/60 py-4 font-display text-3xl font-semibold tracking-tight"
                  >
                    <span className="transition-colors group-hover:text-primary">{l.label}</span>
                    <span className="font-mono-tight text-xs text-muted-foreground">0{i + 1}</span>
                  </motion.a>
                ))}
              </nav>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-10 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Start a project →
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
