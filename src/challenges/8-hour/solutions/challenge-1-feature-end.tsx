import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteApiV1AuthorsByIdMutation,
  getApiV1AuthorsOptions,
  getApiV1AuthorsQueryKey,
  postApiV1AuthorsMutation,
  putApiV1AuthorsByIdMutation,
} from "@/api/client/@tanstack/react-query.gen";
import type { Author } from "@/api/client";

export default function Challenge1FeatureEnd() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1AuthorsQueryKey();

  const { data: authors } = useQuery(getApiV1AuthorsOptions());

  const create = useMutation({
    ...postApiV1AuthorsMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    ...putApiV1AuthorsByIdMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    ...deleteApiV1AuthorsByIdMutation(),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Author[]>(queryKey);
      queryClient.setQueryData<Author[]>(queryKey, (old) =>
        old ? old.filter((a) => a.id !== vars.path.id) : old,
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");

  return (
    <div className="text-sm space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!first && !last) return;
          create.mutate({
            body: { id: 0, idBook: 1, firstName: first, lastName: last },
          });
          setFirst("");
          setLast("");
        }}
        className="flex gap-2"
      >
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="First"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Last"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="space-y-1 max-h-72 overflow-auto">
        {authors?.slice(0, 10).map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between gap-2 border-b py-1"
          >
            {editingId === a.id ? (
              <>
                <input
                  className="border rounded px-2 py-0.5 flex-1"
                  value={editFirst}
                  onChange={(e) => setEditFirst(e.target.value)}
                />
                <input
                  className="border rounded px-2 py-0.5 flex-1"
                  value={editLast}
                  onChange={(e) => setEditLast(e.target.value)}
                />
                <button
                  className="text-xs px-2 py-0.5 border rounded"
                  disabled={update.isPending}
                  onClick={() => {
                    update.mutate(
                      {
                        path: { id: a.id! },
                        body: {
                          id: a.id!,
                          idBook: a.idBook!,
                          firstName: editFirst,
                          lastName: editLast,
                        },
                      },
                      { onSuccess: () => setEditingId(null) },
                    );
                  }}
                >
                  Save
                </button>
                <button
                  className="text-xs opacity-60"
                  onClick={() => setEditingId(null)}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {a.firstName} {a.lastName}
                </span>
                <button
                  className="text-xs opacity-70"
                  onClick={() => {
                    setEditingId(a.id!);
                    setEditFirst(a.firstName ?? "");
                    setEditLast(a.lastName ?? "");
                  }}
                >
                  edit
                </button>
                <button
                  className="text-xs text-red-500"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate({ path: { id: a.id! } })}
                >
                  delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
