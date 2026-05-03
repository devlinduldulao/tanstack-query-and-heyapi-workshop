# Exercise 4: Mutations with `useMutation`

Reads are easy. Writes are where TanStack Query truly shines. You will create a new book using `useMutation`.

## Requirements

- Import `useMutation` from `@tanstack/react-query`.
- Build a small form with `title` and `description`.
- Call `useMutation` with a `mutationFn` that POSTs to `/api/v1/Books`.
- On submit, call `mutate({ title, description })`.
- Disable the submit button while `isPending` is `true`.
- Show a success toast (or simple text) when `isSuccess` is `true`.
- Surface `error.message` when the mutation fails.

> 💡 Don't worry that the fake API doesn't actually persist — you can still observe the request, response, and lifecycle.

## Why This Matters

`useMutation` separates "imperative side effect" from "declarative cache state" — the cleanest mental model for writes in React.

## Training Resources

- [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [`useMutation` Reference](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
