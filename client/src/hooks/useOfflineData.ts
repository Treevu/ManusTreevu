import { useEffect, useCallback } from 'react';
import { useOffline } from './useOffline';
import { 
  cacheUserData, 
  getCachedUserData, 
  savePendingTransaction,
  getPendingTransactions,
  markTransactionSynced,
  getPendingCount,
} from '@/lib/offlineCache';

interface UseOfflineDataOptions {
  fwiScore?: number;
  treePoints?: number;
  transactions?: Array<{
    id: number;
    amount: number;
    category: string;
    description: string;
    createdAt: string;
  }>;
  userName?: string;
  userEmail?: string;
}

/**
 * useOfflineData - Hook para manejar datos offline
 * 
 * Cachea automáticamente los datos cuando están disponibles
 * y los recupera del cache cuando está offline
 * 
 * @example
 * const { cachedData, saveTransaction, syncPending } = useOfflineData({
 *   fwiScore: data?.fwiScore,
 *   treePoints: data?.treePoints,
 * });
 */
export function useOfflineData(options: UseOfflineDataOptions = {}) {
  const { isOnline, wasOffline } = useOffline();

  // Cachear datos cuando están disponibles
  useEffect(() => {
    if (isOnline) {
      const dataToCache: Parameters<typeof cacheUserData>[0] = {};
      
      if (options.fwiScore !== undefined) {
        dataToCache.fwiScore = options.fwiScore;
      }
      if (options.treePoints !== undefined) {
        dataToCache.treePoints = options.treePoints;
      }
      if (options.transactions) {
        dataToCache.lastTransactions = options.transactions;
      }
      if (options.userName) {
        dataToCache.userName = options.userName;
      }
      if (options.userEmail) {
        dataToCache.userEmail = options.userEmail;
      }

      if (Object.keys(dataToCache).length > 0) {
        cacheUserData(dataToCache);
      }
    }
  }, [isOnline, options.fwiScore, options.treePoints, options.transactions, options.userName, options.userEmail]);

  // Guardar transacción para sincronizar después
  const saveTransaction = useCallback(async (transaction: {
    type: 'expense' | 'income';
    amount: number;
    category: string;
    description: string;
  }) => {
    return savePendingTransaction(transaction);
  }, []);

  // Sincronizar transacciones pendientes
  const syncPending = useCallback(async (
    syncFn: (transaction: { type: string; amount: number; category: string; description: string }) => Promise<void>
  ) => {
    if (!isOnline) return { synced: 0, failed: 0 };

    const pending = await getPendingTransactions();
    let synced = 0;
    let failed = 0;

    for (const transaction of pending) {
      try {
        await syncFn({
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
        });
        await markTransactionSynced(transaction.id!);
        synced++;
      } catch (error) {
        console.error('[OfflineData] Failed to sync transaction:', error);
        failed++;
      }
    }

    return { synced, failed };
  }, [isOnline]);

  // Obtener datos cacheados
  const getCachedData = useCallback(async () => {
    return getCachedUserData();
  }, []);

  // Obtener conteo de pendientes
  const getPendingTransactionCount = useCallback(async () => {
    return getPendingCount();
  }, []);

  return {
    isOnline,
    wasOffline,
    saveTransaction,
    syncPending,
    getCachedData,
    getPendingTransactionCount,
  };
}

export default useOfflineData;
