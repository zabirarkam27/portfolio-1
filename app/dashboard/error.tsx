"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Content could not be loaded from the database. Your last saved data is still in Neon.
        </p>
        <Button className="mt-5" onClick={reset}>
          Retry
        </Button>
      </div>
    </div>
  );
}
