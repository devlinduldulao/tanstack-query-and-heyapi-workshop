// TODO:
// 1. Implement useBook(id) with queryKey ["book", id] and `enabled: !!id`
// 2. When user clicks a book in the list, set selectedId
// 3. Render the selected book's title + description in the side panel

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

// TODO: implement useBook
// function useBook(id: number | null) { ... }

export default function Exercise2() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: books } = useBooks();
  // TODO: const { data: book, isFetching } = useBook(selectedId);

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
      <aside className="border-l pl-4 opacity-70">
        <p>Select a book to see its details…</p>
      </aside>
    </div>
  );
}
