import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type NewBook = { title: string; description: string };

export default function Exercise4End() {
  const [form, setForm] = useState<NewBook>({ title: "", description: "" });

  const mutation = useMutation({
    mutationFn: async (book: NewBook) =>
      (await axios.post("https://fakerestapi.azurewebsites.net/api/v1/Books", book)).data,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
      className="max-w-sm space-y-2 text-sm"
    >
      <input
        className="w-full rounded border px-2 py-1"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full rounded border px-2 py-1"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-primary text-primary-foreground rounded border px-3 py-1 disabled:opacity-50"
      >
        {mutation.isPending ? "Creating…" : "Create book"}
      </button>
      {mutation.isSuccess && <p className="text-xs text-green-600">✅ Book created!</p>}
      {mutation.isError && <p className="text-xs text-red-500">{mutation.error.message}</p>}
    </form>
  );
}
