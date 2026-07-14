"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary">
          Portfolio
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Something slipped.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The site could not load this view. Try again; if it repeats, the API or database may need
          attention.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
