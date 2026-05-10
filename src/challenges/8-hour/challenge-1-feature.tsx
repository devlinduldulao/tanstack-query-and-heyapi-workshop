// Feature Challenge — Author Manager
// TODO: Build full CRUD using generated TanStack Query helpers from
// "@/api/client/@tanstack/react-query.gen".
//
// Required:
// - List authors with getApiV1AuthorsOptions + useSuspenseQuery
// - Create author (postApiV1AuthorsMutation) + invalidate list on success
// - Delete author (deleteApiV1AuthorsByIdMutation) + invalidate list on success
// - Edit author (putApiV1AuthorsByIdMutation) inline

import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1AuthorsOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Challenge1Feature() {
  const { data } = useSuspenseQuery(getApiV1AuthorsOptions());

  return (
    <div className="text-sm">
      <h3 className="mb-3 font-semibold">Authors</h3>
      <ul className="max-h-64 space-y-1 overflow-auto">
        {data?.slice(0, 10).map((a) => (
          <li key={a.id}>
            {a.firstName} {a.lastName}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs opacity-70">TODO: Add create / edit / delete with success and error toasts.</p>
    </div>
  );
}
