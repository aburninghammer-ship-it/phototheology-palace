/**
 * IndexedDB service for offline-first functionality
 * Stores Bible verses, palace content, and user data
 */

const DB_NAME = 'PhototheologyDB';
const DB_VERSION = 1;

export interface OfflineVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  timestamp: number;
}

export interface OfflinePalaceContent {
  id: string;
  type: 'floor' | 'room' | 'course';
  content: any;
  timestamp: number;
}

export interface OfflineUserData {
  key: string;
  value: any;
  timestamp: number;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Bible verses store
        if (!db.objectStoreNames.contains('verses')) {
          const verseStore = db.createObjectStore('verses', { 
            keyPath: ['book', 'chapter', 'verse', 'translation'] 
          });
          verseStore.createIndex('book', 'book', { unique: false });
          verseStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Palace content store
        if (!db.objectStoreNames.contains('palace')) {
          const palaceStore = db.createObjectStore('palace', { keyPath: 'id' });
          palaceStore.createIndex('type', 'type', { unique: false });
          palaceStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // User data store (for progress, bookmarks, etc.)
        if (!db.objectStoreNames.contains('userData')) {
          const userStore = db.createObjectStore('userData', { keyPath: 'key' });
          userStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Bible Verses Methods
  async saveVerse(verse: OfflineVerse): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readwrite');
      const store = transaction.objectStore('verses');
      const request = store.put({ ...verse, timestamp: Date.now() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveVerses(verses: OfflineVerse[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readwrite');
      const store = transaction.objectStore('verses');
      
      verses.forEach(verse => {
        store.put({ ...verse, timestamp: Date.now() });
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getVerse(book: string, chapter: number, verse: number, translation: string): Promise<OfflineVerse | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readonly');
      const store = transaction.objectStore('verses');
      const request = store.get([book, chapter, verse, translation]);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getChapter(book: string, chapter: number, translation: string): Promise<OfflineVerse[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readonly');
      const store = transaction.objectStore('verses');
      const index = store.index('book');
      const request = index.getAll(book);
      
      request.onsuccess = () => {
        const verses = (request.result || []).filter(
          v => v.chapter === chapter && v.translation === translation
        );
        resolve(verses);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedBooks(): Promise<string[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readonly');
      const store = transaction.objectStore('verses');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const books = new Set(request.result.map(v => v.book));
        resolve(Array.from(books));
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Palace Content Methods
  async savePalaceContent(content: OfflinePalaceContent): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['palace'], 'readwrite');
      const store = transaction.objectStore('palace');
      const request = store.put({ ...content, timestamp: Date.now() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPalaceContent(id: string): Promise<OfflinePalaceContent | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['palace'], 'readonly');
      const store = transaction.objectStore('palace');
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPalaceContent(type?: 'floor' | 'room' | 'course'): Promise<OfflinePalaceContent[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['palace'], 'readonly');
      const store = transaction.objectStore('palace');
      
      if (type) {
        const index = store.index('type');
        const request = index.getAll(type);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      } else {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      }
    });
  }

  // User Data Methods
  async saveUserData(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userData'], 'readwrite');
      const store = transaction.objectStore('userData');
      const request = store.put({ key, value, timestamp: Date.now() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserData(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup Methods
  async clearOldData(daysOld: number = 30): Promise<void> {
    if (!this.db) await this.init();
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

    const stores = ['verses', 'palace', 'userData'];
    const transaction = this.db!.transaction(stores, 'readwrite');

    stores.forEach(storeName => {
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');
      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    });
  }

  async getStorageSize(): Promise<{ verses: number; palace: number; userData: number }> {
    if (!this.db) await this.init();
    
    const counts = {
      verses: 0,
      palace: 0,
      userData: 0
    };

    for (const key of Object.keys(counts)) {
      counts[key as keyof typeof counts] = await new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([key], 'readonly');
        const store = transaction.objectStore(key);
        const request = store.count();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    return counts;
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();
    const stores = ['verses', 'palace', 'userData'];
    const transaction = this.db!.transaction(stores, 'readwrite');

    stores.forEach(storeName => {
      transaction.objectStore(storeName).clear();
    });
  }
}

export const offlineStorage = new OfflineStorage();
