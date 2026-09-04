// TODO:
// 1. Wrap the form submit in useMutation.
// 2. Use the generated postApiV1BooksMutation helper.
// 3. Disable submit while isPending; show success / error states.

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postApiV1BooksMutation } from "@/api/client/@tanstack/react-query.gen";

type NewBook = { title: string; description: string };

export default function Exercise4() {
  const [form, setForm] = useState<NewBook>({ title: "", description: "" });
  const mutation = useMutation({
    ...postApiV1BooksMutation(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call mutation.mutate({ body: { ... } }) with the generated Book shape.
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-2 text-sm">
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
        {mutation.isPending ? "Creating..." : "Create book"}
      </button>
    </form>
  );
}
