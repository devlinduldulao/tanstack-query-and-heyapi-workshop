import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Clock, Trophy } from "lucide-react";

export const Route = createFileRoute("/bootcamp/")({
  component: BootcampHome,
});

function BootcampHome() {
  return (
    <div className="flex w-full flex-col">
      <header className="bg-card flex h-16 shrink-0 items-center gap-2 border-b px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-base font-semibold sm:text-xl">
          TanStack Query × Hey API <span className="text-primary">Workshop</span>
        </h1>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-4xl space-y-8 text-center">
          <Trophy className="text-primary mx-auto h-12 w-12" />
          <h2 className="text-4xl leading-tight font-bold sm:text-5xl">
            Choose Your Workshop Track
            <span className="text-primary block">for Senior React Devs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pick the compressed 4-hour path for the highest-signal labs, or the full 8-hour path for every advanced
            TanStack Query and Hey API activity.
          </p>
          <div className="grid gap-4 text-left md:grid-cols-2">
            <Link
              to="/bootcamp/challenge/$day/$exercise"
              params={{ day: "4-hour", exercise: "exercise-0" }}
              className="hover:border-primary block rounded-lg border p-5 transition-colors"
            >
              <Clock className="text-primary mb-3 h-5 w-5" />
              <h3 className="text-xl font-semibold">4-hour workshop</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                The compressed track: generated reads, mutation feedback, Hey API adoption, generated factories,
                validated writes, pagination/search, contract-drift triage, and cache-debugging.
              </p>
            </Link>
            <Link
              to="/bootcamp/challenge/$day/$exercise"
              params={{ day: "8-hour", exercise: "exercise-0" }}
              className="hover:border-primary block rounded-lg border p-5 transition-colors"
            >
              <Trophy className="text-primary mb-3 h-5 w-5" />
              <h3 className="text-xl font-semibold">8-hour workshop</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                The full track with every lab: refresh UX, mutation feedback, invalidation, Suspense, contract-drift
                drills, feature challenge, and completion homework.
              </p>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">Your progress is saved automatically per track.</p>
        </div>
      </div>
    </div>
  );
}
