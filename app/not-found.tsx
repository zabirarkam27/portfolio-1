import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 text-foreground grain">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="relative max-w-md text-center">
        <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
          404 / Missing route
        </p>
        <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight">Lost signal.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This portfolio page does not exist anymore, or the case study moved while nobody was
          watching.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
