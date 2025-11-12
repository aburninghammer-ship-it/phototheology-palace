/**
 * Background sync service for queuing and syncing user actions
 * Handles offline actions and syncs them when connection is restored
 */

const SYNC_DB_NAME = 'PhototheologySyncDB';
const SYNC_DB_VERSION = 1;
const SYNC_QUEUE_STORE = 'syncQueue';

export type SyncActionType = 
  | 'bookmark_add'
  | 'bookmark_remove'
  | 'progress_update'
  | 'note_add'
  | 'note_update'
  | 'note_delete'
  | 'reading_history';

export interface SyncAction {
  id: string;
  type: SyncActionType;
  payload: any;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
}

class SyncQueueService {
  private db: IDBDatabase | null = null;
  private syncInProgress = false;
  private listeners: Set<() => void> = new Set();

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
          const store = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  /**
   * Add an action to the sync queue
   */
  async queueAction(type: SyncActionType, payload: any): Promise<string> {
    if (!this.db) await this.init();

    const action: SyncAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.add(action);

      request.onsuccess = () => {
        this.notifyListeners();
        resolve(action.id);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending actions
   */
  async getPendingActions(): Promise<SyncAction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get count of pending actions
   */
  async getPendingCount(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const index = store.index('status');
      const request = index.count('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update action status
   */
  async updateAction(id: string, updates: Partial<SyncAction>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          const updatedAction = { ...action, ...updates };
          const putRequest = store.put(updatedAction);
          putRequest.onsuccess = () => {
            this.notifyListeners();
            resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Remove action from queue
   */
  async removeAction(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        this.notifyListeners();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Process sync queue
   */
  async processQueue(syncHandler: (action: SyncAction) => Promise<void>): Promise<void> {
    if (this.syncInProgress) return;
    
    this.syncInProgress = true;
    
    try {
      const actions = await this.getPendingActions();
      
      for (const action of actions) {
        try {
          await this.updateAction(action.id, { status: 'syncing' });
          await syncHandler(action);
          await this.removeAction(action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          
          const newRetries = action.retries + 1;
          if (newRetries >= 3) {
            await this.updateAction(action.id, {
              status: 'failed',
              retries: newRetries,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          } else {
            await this.updateAction(action.id, {
              status: 'pending',
              retries: newRetries
            });
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Clear all synced actions
   */
  async clearCompleted(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        this.notifyListeners();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const syncQueue = new SyncQueueService();
