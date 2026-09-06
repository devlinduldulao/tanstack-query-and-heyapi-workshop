# Bug Challenge: Cache Races in Production

A teammate shipped a books dashboard next to an authors panel and a bug report just landed:

> "When I delete a book, the toast says success but the books list does not refresh correctly. The authors panel also flickers, and sometimes the wrong cache entry gets refreshed."

Your job: find and fix the cache bugs in `challenge-2-bug.tsx`.

This is the **full** 8-hour version of the race. The 4-hour track only has the mismatched books-list key. Here you also have to stop an over-broad refresh and cancel the in-flight **books** read, not authors.

## Symptoms

1. The success toast appears, but the deleted book vanishes and never comes back from the generated books list.
2. The authors panel shows **Refreshing...** on every book delete — that query was not the one you meant to touch.
3. Devtools shows the mutation refreshing the authors identity instead of the books-list identity.
4. Error feedback is missing or unclear (rollback instead of a failure toast).
5. Rapid clicks can hit the wrong row (`key={index}`).

## Hints

- Compare the generated **books-list** identifier against the success refresh target.
- `cancelQueries` must target the same generated books key the list reads — not authors.
- Keep the mutation on success/error handlers only. No `onMutate` / `setQueryData`.
- Use toast feedback to make outcomes visible.
- The authors query is a canary: it should stay still when a book is deleted.

## Checklist

- ✅ Deleting a book fires exactly one `DELETE`, then exactly one `GET` on the generated **books** list key.
- ✅ The authors panel does **not** refetch.
- ✅ The *starter* row vanishes and stays gone — that is the cache bug. After the fix the book row stays on screen: `fakerestapi` is a read-only mock. Judge the fix by the requests and the keys.
- ✅ Success feedback appears when the delete completes.
- ✅ Failure feedback appears when the request fails.
- ✅ No manual cache writes remain in the delete flow.

> Most delete bugs in this setup come from refreshing the wrong generated key, skipping cancellation on the read that is actually on screen, or hiding failures from the user.
