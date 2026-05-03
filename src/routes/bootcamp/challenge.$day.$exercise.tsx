import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Eye, EyeOff, Play, Bug, Wrench, Flame } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Window } from "@/components/internal/window";
import { useTextFile } from "@/hooks/use-text-file";
import { MarkdownRenderer } from "@/components/internal/markdown-renderer";
import { BootcampPageHeader } from "@/components/internal/bootcamp-page-header";
import { ChallengeLoader } from "@/components/internal/challenge-loader";

export const Route = createFileRoute("/bootcamp/challenge/$day/$exercise")({
  component: ChallengePage,
});

const getIcon = (exercise: string) => {
  if (exercise.includes("bug")) return <Bug className="h-4 w-4" />;
  if (exercise.includes("feature")) return <Wrench className="h-4 w-4" />;
  if (exercise.includes("bonus")) return <Flame className="h-4 w-4" />;
  return <Play className="h-4 w-4" />;
};

function ChallengePage() {
  const { day, exercise } = Route.useParams();
  const [isInstructionsOpen, setInstructionsOpen] = useState(true);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    setShowSolution(false);
  }, [day, exercise]);

  const baseExerciseName = exercise.replace(/-end$/, "");
  const instructionsPath = `/src/challenges/${day}/instructions/${baseExerciseName}.md`;
  const exerciseTitle = exercise.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const { data: markdown, error: markdownError } = useTextFile(instructionsPath);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BootcampPageHeader
        dayTitle={day.replace("-", " ").toUpperCase()}
        title={exerciseTitle}
        icon={getIcon(exercise)}
        day={day}
        exerciseId={exercise}
        extraActions={
          <Button variant="outline" size="sm" onClick={() => setShowSolution((s) => !s)} className="gap-2">
            {showSolution ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide Solution
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show Solution
              </>
            )}
          </Button>
        }
      />
      <div className="flex-1 space-y-6 p-6">
        <Collapsible open={isInstructionsOpen} onOpenChange={setInstructionsOpen}>
          <div className="bg-card border-border rounded-xl border shadow-sm">
            <CollapsibleTrigger className="w-full">
              <div className="hover:bg-accent/5 flex items-center justify-between p-6 transition-colors">
                <h3 className="text-xl font-semibold">Challenge Instructions</h3>
                {isInstructionsOpen ? (
                  <ChevronUp className="text-muted-foreground h-5 w-5" />
                ) : (
                  <ChevronDown className="text-muted-foreground h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-border border-t p-6">
                {markdownError ? (
                  <div className="py-6 text-center text-sm">
                    <p className="text-red-500">Failed to load instructions</p>
                    <p className="text-muted-foreground mt-1">{markdownError}</p>
                  </div>
                ) : markdown ? (
                  <MarkdownRenderer content={markdown} />
                ) : (
                  <div className="text-muted-foreground py-6 text-center text-sm">Loading instructions…</div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Window
          fileName={`${exercise}${showSolution ? "-end" : ""}.tsx`}
          fileType="React Component"
          showSolutionBadge={showSolution}
        >
          <ChallengeLoader day={day} exercise={exercise} showSolution={showSolution} />
        </Window>
      </div>
    </div>
  );
}
