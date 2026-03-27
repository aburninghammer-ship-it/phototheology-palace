

## Fix: Screenshot Upload in Public Chat

### Problem
1. **No upload button** — `ChatInput` only supports pasting images from clipboard; no file picker for selecting screenshots from device.
2. **Images never saved** — `usePublicChat.sendMessage()` receives the `images` array but never includes it in the database insert.

### Plan

**1. Add upload button to ChatInput** (`src/components/ChatInput.tsx`)
- Add a hidden `<input type="file" accept="image/*" multiple>` element
- Add an image/camera icon button next to the emoji picker that triggers the file input
- On file select, read files as base64 data URLs and append to the `images` array (same as paste flow)
- Keep existing paste support intact

**2. Persist images in sendMessage** (`src/hooks/usePublicChat.tsx`)
- In the `sendMessage` function (line ~174), add `images` to `insertData` when the array is non-empty:
  ```typescript
  if (images && images.length > 0) {
    insertData.images = images;
  }
  ```
- Also fix the early return guard to allow image-only messages (currently requires `content.trim()`)

**3. No storage bucket needed** — Images are already stored as base64 strings in the `TEXT[]` column, and the display code in `PublicChat.tsx` (line 248-258) already renders them. This keeps it simple for screenshots. If images get too large, a storage migration can be done later.

### Technical Details
- The `public_chat_messages.images` column is `TEXT[]` — already supports base64 strings
- The rendering in `PublicChat.tsx` lines 248-258 already handles displaying images from messages
- Base64 screenshots are typically 100-500KB; PostgreSQL TEXT fields handle this fine
- Max 4 images per message to prevent abuse

