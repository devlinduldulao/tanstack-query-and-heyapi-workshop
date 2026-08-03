import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1ActivitiesByIdOptions } from "../../../api/client/@tanstack/react-query.gen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, CheckCircle2, Clock, Calendar, Hash, Sparkles } from "lucide-react";
import { ActivityDetailSkeleton } from "./-skeletons/activity-detail-skeleton";
import { motion } from "framer-motion";

export const Route = createFileRoute("/activities/$id/")({
  component: RouteComponent,
  pendingComponent: ActivityDetailSkeleton,
  loader: ({ context, params }) => {
    void context.queryClient.ensureQueryData(
      getApiV1ActivitiesByIdOptions({
        path: { id: parseInt(params.id) },
      }),
    );
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: activity } = useSuspenseQuery(
    getApiV1ActivitiesByIdOptions({
      path: { id: parseInt(id) },
    }),
  );

  const daysRemaining = activity.dueDate
    ? Math.ceil((new Date(activity.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="container mx-auto max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="group mb-8"
        render={<Link to="/activities" />}
      >
        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Activities
      </Button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Header Card */}
        <Card className="neo-border border-primary/30 from-primary/5 to-primary/10 relative overflow-hidden bg-linear-to-br via-transparent">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="neo-border-sm border-accent bg-accent/10 font-display inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm">
                    <Hash className="h-4 w-4" />
                    ID: {activity.id}
                  </span>
                  {activity.completed ? (
                    <span className="neo-border-sm font-display inline-flex items-center gap-2 rounded-lg border-green-600 bg-green-600/10 px-3 py-1 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="neo-border-sm font-display inline-flex items-center gap-2 rounded-lg border-yellow-600 bg-yellow-600/10 px-3 py-1 text-sm text-yellow-600">
                      <Clock className="h-4 w-4" />
                      Pending
                    </span>
                  )}
                </div>
                <CardTitle className="font-display gradient-text text-3xl leading-tight sm:text-4xl">
                  {activity.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  {activity.dueDate
                    ? new Date(activity.dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No due date set"}
                </CardDescription>
              </div>
              <Sparkles className="text-primary/30 h-8 w-8" />
            </div>
          </CardHeader>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="hover-lift hover:border-primary/50 h-full border-2 transition-colors">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <Hash className="text-primary h-5 w-5" />
                Activity ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display gradient-text text-3xl">{activity.id}</p>
              <p className="text-muted-foreground mt-2 text-sm">Unique identifier from API</p>
            </CardContent>
          </Card>

          <Card className="hover-lift hover:border-primary/50 h-full border-2 transition-colors">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <Calendar className="text-primary h-5 w-5" />
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl">
                {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : "-"}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {daysRemaining !== null
                  ? daysRemaining >= 0
                    ? `${daysRemaining} days remaining`
                    : `${Math.abs(daysRemaining)} days overdue`
                  : "No deadline"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 border-2 transition-colors sm:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                {activity.completed ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Completion Status
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Activity Status
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${activity.completed ? "bg-green-600" : "bg-yellow-600"}`} />
                <p className="text-lg font-medium">
                  {activity.completed ? (
                    <span className="font-display text-2xl text-green-600">Completed</span>
                  ) : (
                    <span className="font-display text-2xl text-yellow-600">In Progress</span>
                  )}
                </p>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                {activity.completed
                  ? "This activity has been marked as complete in the system."
                  : "This activity is still pending completion."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Info Footer */}
        <Card className="neo-border-sm border-muted bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-muted-foreground flex items-center gap-3 text-sm">
              <Sparkles className="h-4 w-4" />
              <p>
                Data fetched from{" "}
                <span className="text-foreground font-mono font-semibold">fakerestapi.vercel.app</span> using
                <span className="text-foreground font-semibold"> TanStack Query</span> and
                <span className="text-foreground font-semibold"> HeyAPI</span> generated hooks
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
