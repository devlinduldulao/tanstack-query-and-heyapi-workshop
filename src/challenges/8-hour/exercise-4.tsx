// TODO:
// 1. Wrap the form submit in useMutation
// 2. mutationFn POSTs to /api/v1/Books
// 3. Disable submit while isPending; show success / error states

import { useState } from "react";
import axios from "axios";

type NewBook = { title: string; description: string };

export default function Exercise4() {
  const [form, setForm] = useState<NewBook>({ title: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with mutation.mutate(form)
    await axios.post("https://fakerestapi.azurewebsites.net/api/v1/Books", form);
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
      <button type="submit" className="bg-primary text-primary-foreground rounded border px-3 py-1">
        Create book
      </button>
    </form>
  );
}
