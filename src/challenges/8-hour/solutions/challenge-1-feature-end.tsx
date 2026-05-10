import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteApiV1AuthorsByIdMutation,
  getApiV1AuthorsOptions,
  getApiV1AuthorsQueryKey,
  postApiV1AuthorsMutation,
  putApiV1AuthorsByIdMutation,
} from "@/api/client/@tanstack/react-query.gen";

export default function Challenge1FeatureEnd() {
  const queryClient = useQueryClient();
  const queryKey = getApiV1AuthorsQueryKey();

  const { data: authors } = useSuspenseQuery(getApiV1AuthorsOptions());

  const create = useMutation({
    ...postApiV1AuthorsMutation(),
    onSuccess: () => {
      toast.success("Author created");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(`Create failed: ${error.message}`);
    },
  });

  const update = useMutation({
    ...putApiV1AuthorsByIdMutation(),
    onSuccess: () => {
      toast.success("Author updated");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const remove = useMutation({
    ...deleteApiV1AuthorsByIdMutation(),
    onSuccess: () => {
      toast.success("Author deleted");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");

  return (
    <div className="space-y-3 text-sm">
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
          className="flex-1 rounded border px-2 py-1"
          placeholder="First"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
        />
        <input
          className="flex-1 rounded border px-2 py-1"
          placeholder="Last"
          value={last}
          onChange={(e) => setLast(e.target.value)}
        />
        <button type="submit" disabled={create.isPending} className="rounded border px-3 py-1 disabled:opacity-50">
          Add
        </button>
      </form>

      <ul className="max-h-72 space-y-1 overflow-auto">
        {authors?.slice(0, 10).map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-2 border-b py-1">
            {editingId === a.id ? (
              <>
                <input
                  className="flex-1 rounded border px-2 py-0.5"
                  value={editFirst}
                  onChange={(e) => setEditFirst(e.target.value)}
                />
                <input
                  className="flex-1 rounded border px-2 py-0.5"
                  value={editLast}
                  onChange={(e) => setEditLast(e.target.value)}
                />
                <button
                  className="rounded border px-2 py-0.5 text-xs"
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
                      {
                        onSuccess: () => {
                          setEditingId(null);
                        },
                      },
                    );
                  }}
                >
                  Save
                </button>
                <button className="text-xs opacity-60" onClick={() => setEditingId(null)}>
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
