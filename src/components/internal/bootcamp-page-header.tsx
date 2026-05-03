import { type ReactNode } from "react";
import { Check } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExerciseCompletion } from "@/hooks/use-exercise-completion";

type Props = {
  dayTitle: string;
  title: string;
  icon?: ReactNode;
  day: string;
  exerciseId: string;
  extraActions?: ReactNode;
};

export function BootcampPageHeader({ dayTitle, title, icon, day, exerciseId, extraActions }: Props) {
  const { isCompleted, toggleCompletion } = useExerciseCompletion();
  const completed = isCompleted(day, exerciseId);

  return (
    <header className="bg-card flex h-16 shrink-0 items-center gap-2 border-b px-4 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {dayTitle}
        </Badge>
        <h1 className="flex items-center gap-2 truncate text-base font-semibold sm:text-lg">
          {icon}
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={completed ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCompletion(day, exerciseId)}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">{completed ? "Completed" : "Mark Complete"}</span>
        </Button>
        {extraActions}
      </div>
    </header>
  );
}
