# Background Sync Implementation Guide

## Overview

The Background Sync system automatically queues user actions (bookmarks, notes, progress) when offline and syncs them when the connection is restored.

## Architecture

### Core Components

1. **SyncQueueService** (`src/services/syncQueue.ts`)
   - Manages IndexedDB sync queue
   - Handles action queuing, retrieval, and status updates
   - Supports retry logic with exponential backoff

2. **useBackgroundSync Hook** (`src/hooks/useBackgroundSync.tsx`)
   - Monitors online/offline status
   - Automatically processes sync queue when online
   - Provides sync status to UI components

3. **SyncStatusIndicator** (`src/components/SyncStatusIndicator.tsx`)
   - Visual indicator of sync status
   - Shows pending action count
   - Manual sync trigger button

## Supported Action Types

- `bookmark_add` - Add a new bookmark
- `bookmark_remove` - Remove a bookmark
- `reading_history` - Track reading progress
- `progress_update` - Update room/course progress (coming soon)
- `note_add` - Add study notes (coming soon)
- `note_update` - Update existing notes (coming soon)
- `note_delete` - Delete notes (coming soon)

## Usage Examples

### Basic Usage with Bookmarks

```typescript
import { syncQueue } from "@/services/syncQueue";

// Queue an action when offline or network fails
const addBookmarkOffline = async (book: string, chapter: number) => {
  const payload = { book, chapter, color: 'yellow' };
  
  if (!navigator.onLine) {
    await syncQueue.queueAction('bookmark_add', payload);
    // Show user feedback
  }
};
```

### Enhanced Hook Pattern

Use `useBookmarksWithSync` as a template for creating sync-enabled hooks:

```typescript
import { useBookmarksWithSync } from "@/hooks/useBookmarksWithSync";

function MyComponent() {
  const { addBookmark, removeBookmark } = useBookmarksWithSync();
  
  // Works seamlessly online or offline
  const handleBookmark = () => {
    addBookmark('Genesis', 1, 1, 'Important verse');
  };
  
  return <button onClick={handleBookmark}>Bookmark</button>;
}
```

### Monitoring Sync Status

```typescript
import { useBackgroundSync } from "@/hooks/useBackgroundSync";

function SyncMonitor() {
  const { pendingCount, isSyncing, processSync } = useBackgroundSync();
  
  return (
    <div>
      <p>Pending: {pendingCount}</p>
      {isSyncing && <p>Syncing...</p>}
      <button onClick={processSync}>Sync Now</button>
    </div>
  );
}
```

## How It Works

### Queuing Actions

1. User performs action (add bookmark, update progress, etc.)
2. Check if online: `navigator.onLine`
3. If offline or request fails → queue action in IndexedDB
4. Show user feedback that action is queued

### Auto-Sync Process

1. Listen for `online` event
2. When online, `useBackgroundSync` automatically calls `processSync()`
3. Retrieve all pending actions from queue
4. Process each action sequentially
5. On success → remove from queue
6. On failure → increment retry count (max 3 retries)
7. Update UI to show sync status

### Retry Logic

- Actions are retried up to 3 times
- After 3 failures, action status is marked as `failed`
- Failed actions remain in queue for manual inspection
- User can trigger manual sync to retry failed actions

## Adding New Sync Action Types

### Step 1: Define Action Type

```typescript
// In src/services/syncQueue.ts
export type SyncActionType = 
  | 'bookmark_add'
  | 'your_new_action';  // Add here
```

### Step 2: Add Handler

```typescript
// In src/hooks/useBackgroundSync.tsx
const handleSync = async (action: SyncAction) => {
  switch (action.type) {
    case 'your_new_action':
      await supabase
        .from("your_table")
        .insert({
          user_id: user.id,
          ...action.payload
        });
      break;
  }
};
```

### Step 3: Queue Actions

```typescript
// In your hook or component
if (!navigator.onLine) {
  await syncQueue.queueAction('your_new_action', {
    // your payload
  });
}
```

## UI Components

### SyncStatusIndicator

Shows real-time sync status in the bottom-right corner:
- Badge with pending count
- "Syncing..." indicator with spinner
- Click to manually trigger sync
- Auto-hides when nothing pending

Already integrated in `src/App.tsx`.

## Best Practices

1. **Always Check Network Status**
   ```typescript
   if (!navigator.onLine) {
     await syncQueue.queueAction(...);
   }
   ```

2. **Handle Network Failures Gracefully**
   ```typescript
   try {
     await supabase.from('table').insert(...);
   } catch (error) {
     // Queue for retry
     await syncQueue.queueAction(...);
   }
   ```

3. **Provide User Feedback**
   ```typescript
   toast({
     title: "Action queued",
     description: "Will sync when you're back online"
   });
   ```

4. **Don't Duplicate Online Logic**
   - Use the sync-enabled hooks (`useBookmarksWithSync`)
   - Let the system handle online/offline automatically

## Troubleshooting

### Actions Not Syncing

1. Check browser console for errors
2. Verify user is authenticated
3. Check IndexedDB in DevTools → Application → IndexedDB → PhototheologySyncDB
4. Manually trigger sync with `processSync()`

### Failed Actions

- Check `status: 'failed'` in syncQueue
- Review error messages stored with action
- Clear failed actions: `syncQueue.clearCompleted()`

## Future Enhancements

- [ ] Conflict resolution for concurrent edits
- [ ] Batch sync optimization
- [ ] Background sync API integration (Service Worker)
- [ ] Offline-first CRUD operations
- [ ] Delta sync for large datasets
- [ ] Compression for large payloads

## Performance Considerations

- Actions are processed sequentially to avoid race conditions
- IndexedDB operations are async and non-blocking
- Sync status updates use subscription pattern for efficiency
- Failed actions don't block other actions from syncing

## Security

- All actions require authenticated user
- User ID is always included in sync payloads
- RLS policies on Supabase enforce access control
- Sensitive data never persisted in sync queue
