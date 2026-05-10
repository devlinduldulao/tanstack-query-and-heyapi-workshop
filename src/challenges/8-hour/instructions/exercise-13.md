# Exercise 13: Search and Pagination from One Generated List

The API returns the full books collection, so this lab builds paging and search as a local derived view on top of one generated read contract. That keeps the data layer simple and the UI logic explicit.

## Requirements

- Hold `page` and `search` in component state.
- Use `useDeferredValue(search)` so typing stays responsive.
- Read the full books collection through the generated list helper.
- Derive the visible page locally by filtering first and slicing second.
- Reset back to page 1 when the search term changes.
- Keep page boundaries valid when the filtered result count shrinks.
- Render result count, current page, and background refresh state.
- Do not add synthetic endpoint strings, manual request functions, or manual cache-warming flows.

## Discussion Prompt

If the backend later adds real `page`, `pageSize`, and `search` parameters, which part of this feature should move into the contract and which part should stay local to the screen?

## Why This Matters

Not every screen needs a more complex cache shape. Sometimes the best move is to keep one generated source of truth and derive the view locally.

## Training Resources

- [Hey API - Get Started](https://heyapi.dev/openapi-ts/get-started)
