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

- Compare the generated books-list identifier against every cache touch in the delete flow.
- Stop in-flight list refreshes before writing optimistic state.
- A rollback snapshot must come from the exact same generated list entry that you update.
- Use one generated list identifier for snapshot, optimistic update, rollback, and final reconciliation.

## Checklist

- ✅ Deleting a book removes it permanently (no reappearance).
- ✅ Rapid-clicking three different delete buttons removes those exact three books — never the wrong ones.
- ✅ The mutation uses generated helpers and one generated list identifier for snapshot, optimistic update, rollback, and reconciliation.
- ✅ Optimistic update rolls back on error.

> Race conditions in this kind of UI almost always trace back to a missing stop-before-write step, mismatched cache identity, or a rollback snapshot taken from the wrong place.
