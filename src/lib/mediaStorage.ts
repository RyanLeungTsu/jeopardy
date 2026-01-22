import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MediaDB extends DBSchema {
  media: {
    key: string;
    value: Blob;
  };
}

const DB_NAME = 'jeopardy-media';
const DB_VERSION = 1;
const STORE_NAME = 'media';

let dbInstance: IDBPDatabase<MediaDB> | null = null;

// Inits Database
async function getDB(): Promise<IDBPDatabase<MediaDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MediaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Creates the object store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  return dbInstance;
}

// Saves media files to IndexedDB

export async function saveMedia(id: string, blob: Blob): Promise<string> {
  const db = await getDB();
  await db.put(STORE_NAME, blob, id);
  console.log(`Media saved: ${id}, size: ${blob.size} bytes`);
  return id;
}


// Retrieve a media file from IndexedDB, @returns A URL that can be used in img/video/audio src attributes
export async function getMedia(id: string): Promise<string | null> {
  try {
    const db = await getDB();
    const blob = await db.get(STORE_NAME, id);
    
    if (!blob) {
      console.warn(`Media not found: ${id}`);
      return null;
    }
    
    // Creates an object URL from the blob
    const url = URL.createObjectURL(blob);
    console.log(`Media retrieved: ${id}`);
    return url;
  } catch (error) {
    console.error(`Error retrieving media ${id}:`, error);
    return null;
  }
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
  console.log(`Media deleted: ${id}`);
}

// grabs media IDs stored in db 
export async function getAllMediaIds(): Promise<string[]> {
  const db = await getDB();
  const keys = await db.getAllKeys(STORE_NAME);
  return keys;
}

// IMPORTANT! function for clearing media
export async function clearAllMedia(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
  console.log('All media cleared');
}

// media check in db
export async function mediaExists(id: string): Promise<boolean> {
  const db = await getDB();
  const blob = await db.get(STORE_NAME, id);
  return blob !== undefined;
}

// this grabs the total size of media for refrence
export async function getTotalMediaSize(): Promise<number> {
  const db = await getDB();
  const allKeys = await db.getAllKeys(STORE_NAME);
  let totalSize = 0;
  
  for (const key of allKeys) {
    const blob = await db.get(STORE_NAME, key);
    if (blob) {
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}