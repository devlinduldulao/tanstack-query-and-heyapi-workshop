// TODO:
// 1. Start from getApiV1BooksOptions() so Hey API owns the request and query key.
// 2. Use useDeferredValue(search) before deriving the visible items.
// 3. Keep paging local because the API call is still the generated books list query.
// 4. Remove manual prefetching and let one shared query feed the derived UI state.

import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

export default function Exercise13() {
  const { data: books } = useSuspenseQuery(getApiV1BooksOptions());

  return (
    <div className="space-y-3 text-sm">
      <ul className="space-y-1">
        {books.slice(0, 10).map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}
