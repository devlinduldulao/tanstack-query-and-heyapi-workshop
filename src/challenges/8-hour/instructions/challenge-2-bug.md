# Bug Challenge: Cache Races in Production

A teammate shipped a books dashboard and a bug report just landed:

> "When I delete a book, it disappears for a second and then **comes back**. Also, sometimes the _wrong_ book gets deleted when I click fast."

Your job: find and fix the cache bugs in `challenge-2-bug.tsx`.

## Symptoms

1. Deleted book reappears within ~1s.
2. Rapid clicks on different delete buttons sometimes delete the wrong row.
3. Devtools shows the optimistic update writing to a cache entry the read query never uses.
4. The mutation refreshes the wrong data after success.

## Hints

- Compare the read query key against every key used in `onMutate` and invalidation.
- `onMutate` should cancel in-flight list reads before writing optimistic cache state.
- A rollback needs a snapshot from the same cache entry that gets edited.
- Prefer generated query keys for reads, writes, invalidation, prefetching, and rollbacks.

## Checklist

- ✅ Deleting a book removes it permanently (no reappearance).
- ✅ Rapid-clicking three different delete buttons removes those exact three books — never the wrong ones.
- ✅ The mutation uses generated helpers and one generated query key for snapshot, optimistic update, rollback, and invalidation.
- ✅ Optimistic update rolls back on error.

> Race conditions in TanStack Query almost always trace back to **missing `cancelQueries`**, **mismatched query keys**, or **rollback snapshots from the wrong cache entry**.
