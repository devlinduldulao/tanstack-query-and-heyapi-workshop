// TODO: Implement an optimistic delete using onMutate / onError / onSettled
// 1. cancelQueries(["books-6"])
// 2. snapshot previous = getQueryData(["books-6"])
// 3. setQueryData(["books-6"], (old) => old.filter(b => b.id !== id))
// 4. return { previous } as context
// 5. onError -> setQueryData(["books-6"], context.previous)
// 6. onSettled -> invalidateQueries(["books-6"])

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string };

const API = "https://fakerestapi.azurewebsites.net/api/v1/Books";

export default function Exercise6() {
  const { data } = useQuery({
    queryKey: ["books-6"],
    queryFn: async () => (await axios.get<Book[]>(API)).data,
  });

  const deleteBook = useMutation({
    mutationFn: async (id: number) => axios.delete(`${API}/${id}`),
    // TODO: onMutate, onError, onSettled
  });

  return (
    <ul className="space-y-1 text-sm">
      {data?.slice(0, 5).map((b) => (
        <li key={b.id} className="flex justify-between">
          <span>{b.title}</span>
          <button onClick={() => deleteBook.mutate(b.id)} className="text-xs text-red-500">
            delete
          </button>
        </li>
      ))}
    </ul>
  );
}
