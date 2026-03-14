
I checked your code and found it:

- The **Character Profiles** page exists at route: `/character-profiles`.
- The tab is present in desktop tab data (`src/data/navTabs.ts`) as **Character Profiles / Characters**.
- On mobile, it’s inside **More → Characters** (`src/components/MobileBottomNav.tsx`).

How to find it now:

**Desktop**
1. Make sure you are **signed in** (the tab row only renders for logged-in users).
2. Go to an in-app page (not just landing), e.g. `/dashboard` or `/bible`.
3. Look for the **second horizontal tab row** under the top header.
4. **Scroll that row horizontally to the right** (there are many tabs; Characters can be off-screen).
5. You can also open it directly: `/character-profiles`.

**Mobile**
1. Tap **More** in the bottom nav.
2. Tap **Characters**.

If you still don’t see it, you’re likely on the logged-out landing view, where this tab row is hidden.
