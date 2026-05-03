import { type ReactNode } from "react";
import { Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  fileName: string;
  fileType?: string;
  showSolutionBadge?: boolean;
  className?: string;
  children: ReactNode;
};

export function Window({
  fileName,
  fileType = "React Component",
  showSolutionBadge = false,
  className,
  children,
}: Props) {
  return (
    <div className={cn("bg-card border border-border rounded-xl shadow-sm overflow-hidden", className)}>
      <div className="bg-muted/30 border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium">{fileName}</span>
          {showSolutionBadge && (
            <Badge variant="secondary" className="text-xs">
              Solution
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Code className="h-3 w-3" />
          <span>{fileType}</span>
        </div>
      </div>
      <div className="bg-secondary/20 min-h-[300px] p-4">{children}</div>
    </div>
  );
}
