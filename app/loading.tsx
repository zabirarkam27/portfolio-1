import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-4 pt-28 text-foreground sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="space-y-5">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-16 w-full max-w-xl" />
          <Skeleton className="h-16 w-4/5 max-w-lg" />
          <Skeleton className="h-24 w-full max-w-md" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="mx-auto aspect-square w-64 rounded-full sm:w-80 lg:w-72 xl:w-80" />
        <div className="space-y-6 lg:justify-self-end">
          <Skeleton className="h-16 w-48" />
          <Skeleton className="h-16 w-48" />
          <Skeleton className="h-16 w-48" />
        </div>
      </div>
    </div>
  );
}
