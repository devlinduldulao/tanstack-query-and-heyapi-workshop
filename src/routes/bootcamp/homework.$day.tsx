import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useTextFile } from "@/hooks/use-text-file";
import { MarkdownRenderer } from "@/components/internal/markdown-renderer";
import { BootcampPageHeader } from "@/components/internal/bootcamp-page-header";

export const Route = createFileRoute("/bootcamp/homework/$day")({
  component: HomeworkPage,
});

function HomeworkPage() {
  const { day } = Route.useParams();
  const path = `/src/challenges/homework/${day}-homework.md`;
  const { data: markdown, error } = useTextFile(path);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BootcampPageHeader
        dayTitle={day.replace("-", " ").toUpperCase()}
        title="Homework"
        icon={<BookOpen className="h-4 w-4" />}
        day={day}
        exerciseId="homework"
      />
      <div className="flex-1 p-6">
        <div className="bg-card border-border mx-auto max-w-3xl rounded-xl border p-8 shadow-sm">
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : markdown ? (
            <MarkdownRenderer content={markdown} />
          ) : (
            <p className="text-muted-foreground text-sm">Loading…</p>
          )}
        </div>
      </div>
    </div>
  );
}
