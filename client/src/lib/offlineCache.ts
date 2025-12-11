/**
 * Treevü Offline Cache Service
 * Utiliza IndexedDB para cachear datos críticos del usuario
 */

const DB_NAME = 'treevu-offline-cache';
const DB_VERSION = 1;

interface CachedData {
  key: string;
  value: unknown;
  timestamp: number;
  expiresAt: number;
}

interface UserCriticalData {
  fwiScore?: number;
  treePoints?: number;
  lastTransactions?: Array<{
    id: number;
    amount: number;
    category: string;
    description: string;
    createdAt: string;
  }>;
  userName?: string;
  userEmail?: string;
}

let db: IDBDatabase | null = null;

/**
 * Inicializa la conexión a IndexedDB
 */
async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[OfflineCache] Error opening database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Store para datos cacheados
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'key' });
      }
      
      // Store para transacciones pendientes (offline)
      if (!database.objectStoreNames.contains('pendingTransactions')) {
        const store = database.createObjectStore('pendingTransactions', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Guarda datos en el cache
 */
export async function cacheSet(key: string, value: unknown, ttlMinutes: number = 60): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    const data: CachedData = {
      key,
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttlMinutes * 60 * 1000),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error setting cache:', error);
  }
}

/**
 * Obtiene datos del cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const database = await initDB();
    const transaction = database.transaction(['cache'], 'readonly');
    const store = transaction.objectStore('cache');

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const data = request.result as CachedData | undefined;
        if (!data) {
          resolve(null);
          return;
        }

        // Verificar si expiró
        if (Date.now() > data.expiresAt) {
          // Eliminar dato expirado
          cacheDelete(key);
          resolve(null);
          return;
        }

        resolve(data.value as T);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error getting cache:', error);
    return null;
  }
}

/**
 * Elimina datos del cache
 */
export async function cacheDelete(key: string): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction(['cache'], 'readwrite');
    const store = transaction.objectStore('cache');

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error deleting cache:', error);
  }
}

/**
 * Guarda datos críticos del usuario para acceso offline
 */
export async function cacheUserData(data: UserCriticalData): Promise<void> {
  if (data.fwiScore !== undefined) {
    await cacheSet('user:fwiScore', data.fwiScore, 30); // 30 min TTL
  }
  if (data.treePoints !== undefined) {
    await cacheSet('user:treePoints', data.treePoints, 30);
  }
  if (data.lastTransactions) {
    await cacheSet('user:transactions', data.lastTransactions, 60); // 1 hora TTL
  }
  if (data.userName) {
    await cacheSet('user:name', data.userName, 1440); // 24 horas TTL
  }
  if (data.userEmail) {
    await cacheSet('user:email', data.userEmail, 1440);
  }
}

/**
 * Obtiene datos críticos del usuario desde el cache
 */
export async function getCachedUserData(): Promise<UserCriticalData> {
  const [fwiScore, treePoints, lastTransactions, userName, userEmail] = await Promise.all([
    cacheGet<number>('user:fwiScore'),
    cacheGet<number>('user:treePoints'),
    cacheGet<UserCriticalData['lastTransactions']>('user:transactions'),
    cacheGet<string>('user:name'),
    cacheGet<string>('user:email'),
  ]);

  return {
    fwiScore: fwiScore ?? undefined,
    treePoints: treePoints ?? undefined,
    lastTransactions: lastTransactions ?? undefined,
    userName: userName ?? undefined,
    userEmail: userEmail ?? undefined,
  };
}

// ==================== Transacciones Pendientes ====================

interface PendingTransaction {
  id?: number;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  timestamp: number;
  synced: boolean;
}

/**
 * Guarda una transacción pendiente para sincronizar después
 */
export async function savePendingTransaction(transaction: Omit<PendingTransaction, 'id' | 'timestamp' | 'synced'>): Promise<number> {
  try {
    const database = await initDB();
    const tx = database.transaction(['pendingTransactions'], 'readwrite');
    const store = tx.objectStore('pendingTransactions');

    const data: Omit<PendingTransaction, 'id'> = {
      ...transaction,
      timestamp: Date.now(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error saving pending transaction:', error);
    throw error;
  }
}

/**
 * Obtiene todas las transacciones pendientes de sincronizar
 */
export async function getPendingTransactions(): Promise<PendingTransaction[]> {
  try {
    const database = await initDB();
    const tx = database.transaction(['pendingTransactions'], 'readonly');
    const store = tx.objectStore('pendingTransactions');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const transactions = request.result as PendingTransaction[];
        resolve(transactions.filter(t => !t.synced));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error getting pending transactions:', error);
    return [];
  }
}

/**
 * Marca una transacción como sincronizada
 */
export async function markTransactionSynced(id: number): Promise<void> {
  try {
    const database = await initDB();
    const tx = database.transaction(['pendingTransactions'], 'readwrite');
    const store = tx.objectStore('pendingTransactions');

    const getRequest = store.get(id);
    
    await new Promise<void>((resolve, reject) => {
      getRequest.onsuccess = () => {
        const transaction = getRequest.result as PendingTransaction;
        if (transaction) {
          transaction.synced = true;
          const putRequest = store.put(transaction);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error marking transaction synced:', error);
  }
}

/**
 * Elimina transacciones sincronizadas (limpieza)
 */
export async function clearSyncedTransactions(): Promise<void> {
  try {
    const database = await initDB();
    const tx = database.transaction(['pendingTransactions'], 'readwrite');
    const store = tx.objectStore('pendingTransactions');

    const request = store.getAll();
    
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = () => {
        const transactions = request.result as PendingTransaction[];
        const syncedIds = transactions.filter(t => t.synced).map(t => t.id!);
        
        Promise.all(syncedIds.map(id => {
          return new Promise<void>((res, rej) => {
            const deleteRequest = store.delete(id);
            deleteRequest.onsuccess = () => res();
            deleteRequest.onerror = () => rej(deleteRequest.error);
          });
        })).then(() => resolve()).catch(reject);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[OfflineCache] Error clearing synced transactions:', error);
  }
}

/**
 * Obtiene el conteo de transacciones pendientes
 */
export async function getPendingCount(): Promise<number> {
  const pending = await getPendingTransactions();
  return pending.length;
}

export default {
  cacheSet,
  cacheGet,
  cacheDelete,
  cacheUserData,
  getCachedUserData,
  savePendingTransaction,
  getPendingTransactions,
  markTransactionSynced,
  clearSyncedTransactions,
  getPendingCount,
};
