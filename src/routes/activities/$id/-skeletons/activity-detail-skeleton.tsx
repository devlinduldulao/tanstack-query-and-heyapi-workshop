import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ActivityDetailSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="mb-6 h-10 w-40" />

      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="mb-2 h-4 w-12" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-14" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
