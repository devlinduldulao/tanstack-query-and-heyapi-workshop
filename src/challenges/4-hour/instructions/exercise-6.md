# Exercise 6: Pagination, Search & Cache Shape

The fake API returns the whole books list, so this lab simulates server pagination on top of generated options. The important part is the cache shape: real apps should include every server parameter in the query key.

## Requirements

- Hold `page` and `search` in React state.
- Use `useDeferredValue(search)` so typing does not immediately thrash the query.
- Create a derived options object that starts from `getApiV1BooksOptions()` and adds:
  - query key segment for `{ page, pageSize, search }`
  - `select` to filter and slice the generated response
  - `placeholderData: keepPreviousData`
- Prefetch the next page when one exists.
- Keep previous page data visible during navigation.
- Render result count, current page, and background fetching state.

## Discussion Prompt

If the backend added real `page`, `pageSize`, and `search` query parameters tomorrow, which parts of this exercise would move into `swagger.yaml` and get regenerated?

## Why This Matters

Pagination bugs are usually query-key bugs. If the key does not contain the same variables the server uses, the cache lies.

## Training Resources

- [Paginated Queries](https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries)
- [Placeholder Query Data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data)
- [Prefetching](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)
