import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Back button skeleton */}
      <Skeleton className="h-8 w-32" />

      {/* Header card skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs skeleton */}
      <Skeleton className="h-9 w-full" />

      {/* Content card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
