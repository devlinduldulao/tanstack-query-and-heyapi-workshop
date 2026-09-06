import { BookOpen, Bug, Check, Code, ExternalLink, Flame, Play, Trophy, Wrench } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { useExerciseCompletion } from "@/hooks/use-exercise-completion";
import type { Day, ExerciseType } from "@/types/challenge";

const getIcon = (type: ExerciseType, completed: boolean) => {
  if (completed) return <Check className="h-4 w-4 text-green-600" />;
  if (type === "link") return <ExternalLink className="h-4 w-4 text-blue-500" />;
  if (type === "homework") return <BookOpen className="h-4 w-4 text-rose-600" />;
  if (type === "bug-challenge") return <Bug className="h-4 w-4 text-red-500" />;
  if (type === "feature-challenge") return <Wrench className="h-4 w-4 text-purple-500" />;
  if (type === "bonus") return <Flame className="h-4 w-4 text-orange-500" />;
  if (type === "exercise") return <Play className="h-4 w-4" />;
  return <Code className="h-4 w-4" />;
};

export function BootcampSidebar() {
  const location = useLocation();
  const { isCompleted } = useExerciseCompletion();

  const totalExercises = navigationData.reduce(
    (acc, day) => acc + day.exercises.filter((e) => e.type !== "link").length,
    0,
  );
  const completedCount = navigationData.reduce(
    (acc, day) =>
      acc +
      day.exercises.filter((e) => {
        if (e.type === "link") return false;
        if (e.type === "homework") return isCompleted(day.id, "homework");
        return isCompleted(day.id, e.id);
      }).length,
    0,
  );
  const pct = totalExercises ? (completedCount / totalExercises) * 100 : 0;

  return (
    <AppSidebar>
      <SidebarHeader>
        <Link to="/bootcamp" className="hover:bg-sidebar-accent flex items-center gap-2 rounded-md px-2 py-2">
          <Trophy className="text-primary h-6 w-6" />
          <div>
            <h2 className="text-base font-semibold">TanStack Query × Hey API</h2>
            <p className="text-muted-foreground text-xs">Self-paced workshop</p>
          </div>
        </Link>
        <div className="bg-sidebar-accent/50 mt-3 rounded-md px-2 py-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium">Progress</span>
            <span className="text-xs font-semibold">{Math.round(pct)}%</span>
          </div>
          <Progress value={pct} className="h-2" />
          <p className="text-muted-foreground mt-1 text-xs">
            {completedCount} of {totalExercises} completed
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationData.map((day, dayIdx) => (
          <SidebarGroup key={`${day.id}-${dayIdx}`}>
            <SidebarGroupLabel>{day.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {day.exercises.map((exercise) => {
                  const completed =
                    exercise.type === "homework" ? isCompleted(day.id, "homework") : isCompleted(day.id, exercise.id);

                  const isActive =
                    exercise.type === "homework"
                      ? location.pathname === `/bootcamp/homework/${day.id}`
                      : exercise.type !== "link" &&
                        location.pathname === `/bootcamp/challenge/${day.id}/${exercise.id}`;

                  return (
                    <SidebarMenuItem key={exercise.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={
                          exercise.type === "link" && exercise.url ? (
                            <a href={exercise.url} target="_blank" rel="noopener noreferrer" />
                          ) : exercise.type === "homework" ? (
                            <Link to="/bootcamp/homework/$day" params={{ day: day.id }} />
                          ) : (
                            <Link
                              to="/bootcamp/challenge/$day/$exercise"
                              params={{ day: day.id, exercise: exercise.id }}
                            />
                          )
                        }
                      >
                        {getIcon(exercise.type, completed)}
                        <span className={isActive ? "font-semibold" : ""}>{exercise.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </AppSidebar>
  );
}

export const navigationData: Day[] = [
  {
    id: "4-hour",
    title: "4-hour workshop",
    exercises: [
      { id: "exercise-0", title: "Start · Setup", type: "exercise" },
      { id: "exercise-1", title: "Exercise 1 · Query Options", type: "exercise" },
      { id: "exercise-2", title: "Exercise 2 · Delete Feedback", type: "exercise" },
      { id: "exercise-3", title: "Exercise 3 · Why Hey API", type: "exercise" },
      { id: "exercise-4", title: "Exercise 4 · Generated Factories", type: "exercise" },
      { id: "exercise-5", title: "Exercise 5 · Mutation + Zod", type: "exercise" },
      { id: "exercise-6", title: "Exercise 6 · Pagination + Search", type: "exercise" },
      { id: "exercise-7", title: "Exercise 7 · Contract Drift Drill", type: "exercise" },
      { id: "challenge-2-bug", title: "Challenge · Cache Races", type: "bug-challenge" },
      { id: "homework", title: "4-hour Capstone", type: "homework" },
    ],
  },
  {
    id: "8-hour",
    title: "8-hour workshop · Part 1",
    exercises: [
      { id: "exercise-0", title: "Start · Setup", type: "exercise" },
      { id: "exercise-1", title: "Exercise 1 · Query Options", type: "exercise" },
      { id: "exercise-2", title: "Exercise 2 · Parallel + Dependent", type: "exercise" },
      { id: "exercise-3", title: "Exercise 3 · Retry + Refresh UX", type: "exercise" },
      { id: "exercise-4", title: "Exercise 4 · Mutation Lifecycle", type: "exercise" },
      { id: "exercise-5", title: "Exercise 5 · Smart Invalidation", type: "exercise" },
      { id: "exercise-6", title: "Exercise 6 · Delete Recovery", type: "exercise" },
    ],
  },
  {
    id: "8-hour",
    title: "8-hour workshop · Part 2",
    exercises: [
      { id: "exercise-7", title: "Exercise 7 · Why Hey API", type: "exercise" },
      { id: "exercise-8", title: "Exercise 8 · Replace API Drift", type: "exercise" },
      { id: "exercise-9", title: "Exercise 9 · Generated Factories", type: "exercise" },
      { id: "exercise-10", title: "Exercise 10 · Suspense Boundaries", type: "exercise" },
      { id: "exercise-11", title: "Exercise 11 · Mutation + Zod", type: "exercise" },
    ],
  },
  {
    id: "8-hour",
    title: "8-hour workshop · Part 3",
    exercises: [
      { id: "exercise-12", title: "Exercise 12 · Warm Cache UX", type: "exercise" },
      { id: "exercise-13", title: "Exercise 13 · Pagination + Search", type: "exercise" },
      { id: "exercise-14", title: "Exercise 14 · Contract Drift Drill", type: "exercise" },
      { id: "challenge-1-feature", title: "Challenge 1 · Author CRUD", type: "feature-challenge" },
      { id: "challenge-2-bug", title: "Challenge 2 · Cache Races", type: "bug-challenge" },
      { id: "homework", title: "Capstone Homework", type: "homework" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    exercises: [
      {
        id: "tanstack-query-docs",
        title: "TanStack Query Docs",
        type: "link",
        url: "https://tanstack.com/query/latest/docs/framework/react/overview",
      },
      {
        id: "hey-api-docs",
        title: "Hey API Docs",
        type: "link",
        url: "https://heyapi.dev/openapi-ts/get-started",
      },
      {
        id: "demo-routes",
        title: "Demo App",
        type: "link",
        url: "/",
      },
    ],
  },
];
