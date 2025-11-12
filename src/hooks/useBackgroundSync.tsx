import { useEffect, useState } from "react";
import { syncQueue, SyncAction } from "@/services/syncQueue";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useBackgroundSync = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Get current user without using navigate
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Update pending count
  const updatePendingCount = async () => {
    const count = await syncQueue.getPendingCount();
    setPendingCount(count);
  };

  // Sync handler for different action types
  const handleSync = async (action: SyncAction) => {
    if (!user) throw new Error("User not authenticated");

    try {
      switch (action.type) {
        case 'bookmark_add':
          await supabase.from("bookmarks").insert({
            user_id: user.id,
            ...action.payload
          });
          break;

        case 'bookmark_remove':
          await supabase
            .from("bookmarks")
            .delete()
            .eq("id", action.payload.bookmarkId);
          break;

        case 'reading_history':
          await supabase.from("reading_history").insert({
            user_id: user.id,
            ...action.payload
          });
          break;

        case 'progress_update':
        case 'note_add':
        case 'note_update':
        case 'note_delete':
          // These will be handled in future updates
          console.log(`Sync action ${action.type} queued for future implementation`);
          break;

        default:
          console.warn(`Unknown sync action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Failed to sync ${action.type}:`, error);
      throw error;
    }
  };

  // Process sync queue
  const processSync = async () => {
    if (!navigator.onLine || !user) return;

    setIsSyncing(true);
    try {
      await syncQueue.processQueue(handleSync);
      await updatePendingCount();

      if (pendingCount > 0) {
        toast({
          title: "Sync complete",
          description: `${pendingCount} action${pendingCount !== 1 ? 's' : ''} synced successfully`,
        });
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync failed",
        description: "Some actions could not be synced. Will retry automatically.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming online
  useEffect(() => {
    const handleOnline = () => {
      processSync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user]);

  // Initial sync on mount if online
  useEffect(() => {
    if (navigator.onLine && user) {
      processSync();
    }
  }, [user]);

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = syncQueue.subscribe(() => {
      updatePendingCount();
    });

    updatePendingCount();

    return unsubscribe;
  }, []);

  return {
    pendingCount,
    isSyncing,
    processSync,
  };
};
