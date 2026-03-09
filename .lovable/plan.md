

# Fix Patreon Linking Error

## Root Cause Analysis

Two issues are causing Creed's error when linking Patreon:

### Bug 1: Race Condition — User Not Loaded Before Processing
In `PatreonCallback.tsx`, the `useEffect` runs immediately when the page loads. At that point, `useAuth()` hasn't finished loading the session yet, so `user` is `null`. The callback sends `userId: undefined` to the edge function. Then `processedRef.current = true` prevents the effect from re-running once the user loads.

The edge function falls back to email matching, but if Creed used a different email on Patreon vs the app, or if there are other issues, the link fails.

### Bug 2: Double Token Encryption
The edge function manually calls `encrypt_token()` RPC on the tokens before upserting. But the database has a `BEFORE INSERT OR UPDATE` trigger (`encrypt_patreon_tokens_trigger`) that ALSO encrypts tokens. This means tokens get encrypted twice, potentially causing errors or corrupt data.

## Fix Plan

### 1. Fix the race condition in `PatreonCallback.tsx`
- Wait for `useAuth()` to finish loading before processing the callback
- Add a check: if `loading` is true, skip processing (the effect will re-run when loading completes)
- Remove `processedRef` guard based on initial render; instead, only set it after successful processing with a valid user
- Keep the `sessionStorage` code-reuse guard for actual duplicate protection

### 2. Remove manual encryption from the edge function
- Remove the `encrypt_token` RPC calls in `patreon-callback/index.ts`
- Pass raw tokens directly to the upsert — the database trigger handles encryption automatically
- This eliminates the double-encryption issue

### 3. Files to modify
- `src/pages/PatreonCallback.tsx` — wait for auth loading before processing
- `supabase/functions/patreon-callback/index.ts` — remove manual `encrypt_token` calls

