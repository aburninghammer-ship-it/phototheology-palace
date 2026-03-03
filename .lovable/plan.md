

# Fix: "Error Loading Stats" — get-subscriber-stats Auth Failure

## Problem
The `get-subscriber-stats` edge function returns 400 with `"invalid claim: missing sub claim"` when calling `getClaims(token)`. This breaks the admin dashboard stats display.

**Root cause**: The `getClaims()` method on the esm.sh-imported `@supabase/supabase-js@2.49.4` doesn't properly handle ES256 JWTs used by Lovable Cloud. It attempts local JWT parsing and fails because the token format differs from what it expects.

## Solution

Replace `getClaims(token)` with `getUser()` (no token argument). When the Supabase client is initialized with the user's Authorization header, calling `getUser()` without arguments makes a **server-side API call** to validate the token, which works regardless of signing algorithm.

### Edge Function Change (`supabase/functions/get-subscriber-stats/index.ts`)

**Lines 136-147** — Replace the auth verification block:

```typescript
// Current (broken):
const userClient = createClient(supabaseUrl, supabaseAnon, {
  global: { headers: { Authorization: authHeader } },
});
const token = authHeader.replace("Bearer ", "");
const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
if (claimsError || !claimsData?.claims) { ... }
const userId = claimsData.claims.sub as string;

// Fixed:
const userClient = createClient(supabaseUrl, supabaseAnon, {
  global: { headers: { Authorization: authHeader } },
});
const { data: { user: authUser }, error: authError } = await userClient.auth.getUser();
if (authError || !authUser) {
  logStep("Auth failed", { error: authError?.message });
  throw new Error("Invalid authorization");
}
const userId = authUser.id;
```

**Key difference**: `getUser()` (no argument) uses the Authorization header already set on the client to make a server-side validation call, bypassing local JWT parsing entirely.

### Why This Works
- `getClaims(token)` = local JWT parsing → fails with ES256
- `getUser(token)` = local parsing + server call → also can fail with ES256
- `getUser()` (no arg) = pure server-side call using the client's auth header → works with any signing algorithm

### Redeploy
After the edit, the `get-subscriber-stats` function needs to be redeployed.

### Scope
Only one file changes: `supabase/functions/get-subscriber-stats/index.ts` (lines 136-147).

