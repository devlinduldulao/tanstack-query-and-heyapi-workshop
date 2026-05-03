import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string; description: string };

const API = "https://fakerestapi.azurewebsites.net/api/v1/Books";

function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => (await axios.get<Book[]>(API)).data,
  });
}

function useBook(id: number | null) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: async () => (await axios.get<Book>(`${API}/${id}`)).data,
    enabled: id != null,
  });
}

export default function Exercise2End() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: books } = useBooks();
  const { data: book, isFetching } = useBook(selectedId);

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <ul className="space-y-1">
        {books?.slice(0, 10).map((b) => (
          <li key={b.id}>
            <button
              onClick={() => setSelectedId(b.id)}
              className={`text-left hover:underline ${selectedId === b.id ? "font-semibold" : ""}`}
            >
              {b.title}
            </button>
          </li>
        ))}
      </ul>
      <aside className="border-l pl-4">
        {!selectedId && <p className="opacity-70">Select a book…</p>}
        {selectedId && isFetching && <p>Loading…</p>}
        {book && (
          <>
            <h3 className="mb-2 font-semibold">{book.title}</h3>
            <p className="text-xs opacity-80">{book.description}</p>
          </>
        )}
      </aside>
    </div>
  );
}
