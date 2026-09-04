import { useSuspenseQuery } from "@tanstack/react-query";
import { getApiV1BooksOptions } from "@/api/client/@tanstack/react-query.gen";

function BooksList() {
  const { data } = useSuspenseQuery(getApiV1BooksOptions());

  return (
    <ul className="space-y-1 text-sm">
      {data.slice(0, 5).map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </ul>
  );
}

export default function Exercise10() {
  return <BooksList />;
}
