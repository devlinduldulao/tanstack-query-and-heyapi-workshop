import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1ActivitiesOptions } from "../../api/client/@tanstack/react-query.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { EyeIcon, CheckCircle2, Clock, Calendar } from "lucide-react";
import { ActivitiesListSkeleton } from "./-skeletons/activities-list-skeleton";

export const Route = createFileRoute("/activities/")({
  component: RouteComponent,
  pendingComponent: ActivitiesListSkeleton,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(getApiV1ActivitiesOptions());
  },
});

function RouteComponent() {
  const { data: activities } = useSuspenseQuery(getApiV1ActivitiesOptions());

  const completedCount = activities?.filter((a) => a.completed).length ?? 0;
  const totalCount = activities?.length ?? 0;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display gradient-text text-4xl sm:text-5xl lg:text-6xl">Activities</h1>
          <p className="text-muted-foreground mt-2 text-lg">{totalCount} items loaded from REST API</p>
        </div>
        <div className="hidden sm:block">
          <div className="neo-border-sm border-primary/30 bg-primary/5 rounded-lg px-4 py-2">
            <p className="font-display flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Live Data
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="neo-border border-border bg-card/50 overflow-hidden rounded-xl backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 bg-muted/30">
              <TableHead className="font-display w-20">ID</TableHead>
              <TableHead className="font-display">Title</TableHead>
              <TableHead className="font-display">Due Date</TableHead>
              <TableHead className="font-display">Status</TableHead>
              <TableHead className="font-display text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities?.length ? (
              activities.map((activity) => (
                <TableRow key={activity.id} className="border-border/50 hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">
                    <span className="bg-primary/10 text-primary font-display inline-flex h-8 w-8 items-center justify-center rounded-md text-sm">
                      {activity.id}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${activity.completed ? "bg-green-500" : "bg-yellow-500"}`}
                      />
                      {activity.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {activity.completed ? (
                      <span className="neo-border-sm font-display inline-flex items-center gap-2 rounded-md border-green-600 bg-green-600/10 px-3 py-1 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Complete
                      </span>
                    ) : (
                      <span className="neo-border-sm font-display inline-flex items-center gap-2 rounded-md border-yellow-600 bg-yellow-600/10 px-3 py-1 text-sm text-yellow-600">
                        <Clock className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      render={
                        <Link to="/activities/$id" params={{ id: activity.id!.toString() }} aria-label="View activity" />
                      }
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 opacity-50" />
                    <p className="font-display text-lg">No activities found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="neo-border-sm border-accent bg-accent/5 rounded-lg p-4">
          <p className="font-display gradient-text text-2xl">{totalCount}</p>
          <p className="text-muted-foreground mt-1 text-sm">Total Activities</p>
        </div>
        <div className="neo-border-sm rounded-lg border-green-600 bg-green-600/5 p-4">
          <p className="font-display text-2xl text-green-600">{completedCount}</p>
          <p className="text-muted-foreground mt-1 text-sm">Completed</p>
        </div>
        <div className="neo-border-sm rounded-lg border-yellow-600 bg-yellow-600/5 p-4">
          <p className="font-display text-2xl text-yellow-600">{totalCount - completedCount}</p>
          <p className="text-muted-foreground mt-1 text-sm">Pending</p>
        </div>
      </div>
    </div>
  );
}
