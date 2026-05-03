import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Book = { id: number; title: string };

const API = "https://fakerestapi.azurewebsites.net/api/v1/Books";

export default function Exercise6End() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["books-6"],
    queryFn: async () => (await axios.get<Book[]>(API)).data,
  });

  const deleteBook = useMutation({
    mutationFn: async (id: number) => axios.delete(`${API}/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["books-6"] });
      const previous = queryClient.getQueryData<Book[]>(["books-6"]);
      queryClient.setQueryData<Book[]>(["books-6"], (old) => (old ? old.filter((b) => b.id !== id) : old));
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["books-6"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books-6"] });
    },
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
