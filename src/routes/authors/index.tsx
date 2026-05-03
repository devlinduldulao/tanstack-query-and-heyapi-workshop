import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1AuthorsOptions } from "../../api/client/@tanstack/react-query.gen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { EyeIcon } from "lucide-react";
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
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Authors</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Book ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.length ? (
              authors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">{author.id}</TableCell>
                  <TableCell>{author.firstName}</TableCell>
                  <TableCell>{author.lastName}</TableCell>
                  <TableCell>{author.idBook}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Link to="/authors/$id" params={{ id: author.id!.toString() }}>
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No authors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
