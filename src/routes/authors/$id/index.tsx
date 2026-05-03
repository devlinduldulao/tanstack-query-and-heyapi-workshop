import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1AuthorsByIdOptions } from "../../../api/client/@tanstack/react-query.gen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AuthorDetailSkeleton } from "./-skeletons/author-detail-skeleton";

export const Route = createFileRoute("/authors/$id/")({
  component: RouteComponent,
  pendingComponent: AuthorDetailSkeleton,
  loader: ({ context, params }) => {
    void context.queryClient.ensureQueryData(
      getApiV1AuthorsByIdOptions({
        path: { id: parseInt(params.id) },
      }),
    );
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: author } = useSuspenseQuery(
    getApiV1AuthorsByIdOptions({
      path: { id: parseInt(id) },
    }),
  );

  return (
    <div className="container mx-auto py-8">
      <Link to="/authors">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Authors
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Author Details</CardTitle>
          <CardDescription>ID: {author.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">First Name</h3>
              <p className="text-lg">{author.firstName}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Last Name</h3>
              <p className="text-lg">{author.lastName}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Book ID</h3>
              <p className="text-lg">{author.idBook}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
