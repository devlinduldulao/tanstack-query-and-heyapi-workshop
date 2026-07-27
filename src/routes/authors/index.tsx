import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1AuthorsOptions } from "../../api/client/@tanstack/react-query.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { EyeIcon, Calendar, UserRound } from "lucide-react";
import { AuthorsListSkeleton } from "./-skeletons/authors-list-skeleton";

export const Route = createFileRoute("/authors/")({
  component: RouteComponent,
  pendingComponent: AuthorsListSkeleton,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(getApiV1AuthorsOptions());
  },
});

function RouteComponent() {
  const { data: authors } = useSuspenseQuery(getApiV1AuthorsOptions());

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display gradient-text text-4xl sm:text-5xl lg:text-6xl">Authors</h1>
          <p className="text-muted-foreground mt-2 text-lg">{authors?.length ?? 0} items loaded from REST API</p>
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
              <TableHead className="font-display">First Name</TableHead>
              <TableHead className="font-display">Last Name</TableHead>
              <TableHead className="font-display">Book ID</TableHead>
              <TableHead className="font-display text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.length ? (
              authors.map((author) => (
                <TableRow key={author.id} className="border-border/50 hover:bg-accent/50 transition-colors">
                  <TableCell className="font-medium">
                    <span className="bg-primary/10 text-primary font-display inline-flex h-8 w-8 items-center justify-center rounded-md text-sm">
                      {author.id}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-muted-foreground h-4 w-4" />
                      {author.firstName}
                    </div>
                  </TableCell>
                  <TableCell>{author.lastName}</TableCell>
                  <TableCell>{author.idBook}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      render={<Link to="/authors/$id" params={{ id: author.id!.toString() }} aria-label="View author" />}
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
                    <UserRound className="h-8 w-8 opacity-50" />
                    <p className="font-display text-lg">No authors found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
