# Bug Challenge: Cache Races in Production

A teammate shipped a books dashboard and a bug report just landed:

> "When I delete a book, the toast says success but the list does not refresh correctly. Sometimes the wrong cache entry gets refreshed."

Your job: find and fix the cache bugs in `challenge-2-bug.tsx`.

This is the **compressed** 4-hour version: one books list, one mismatched key, no extra panels. The 8-hour challenge adds an authors canary and over-broad invalidation.

## Symptoms

1. The success toast appears, but the visible list does not always refresh.
2. The mutation may refresh the wrong cache entry after success.
3. Devtools shows the mutation and the read using different generated identities.
4. Error feedback is missing or unclear.

## Hints

- Compare the generated books-list identifier against the success refresh target.
- Keep the mutation on success/error handlers only.
- Use toast feedback to make outcomes visible.
- Make sure the same generated list identifier is reused for the visible read and the post-delete refresh.

## Checklist

- ✅ Deleting a book fires exactly one `DELETE`, then exactly one `GET` on the same
  generated list key. (The *starter* row vanishes and stays gone — that is the cache bug.
  After the fix the row stays on screen: `fakerestapi` is a read-only mock that never
  persists writes. Judge the fix by the requests and the key, not by a row that stays gone.)
- ✅ Success feedback appears when the delete completes.
- ✅ Failure feedback appears when the request fails.
- ✅ The mutation uses generated helpers and one generated list identifier for the visible read and the post-delete refresh.
- ✅ No manual cache writes remain in the delete flow.

> Most delete bugs in this setup come from refreshing the wrong generated key or hiding failures from the user.
