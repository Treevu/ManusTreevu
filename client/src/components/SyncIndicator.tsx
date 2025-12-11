import { useState, useEffect } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { getPendingCount, getPendingTransactions, markTransactionSynced, clearSyncedTransactions } from '@/lib/offlineCache';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { retryWithBackoff, isRetryableError } from '@/lib/retryWithBackoff';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

/**
 * SyncIndicator - Muestra el estado de sincronización y transacciones pendientes
 */
export function SyncIndicator() {
  const { isOnline, wasOffline } = useOffline();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  const addTransaction = trpc.transactions.create.useMutation();

  // Actualizar conteo de pendientes
  useEffect(() => {
    const updateCount = async () => {
      const count = await getPendingCount();
      setPendingCount(count);
    };
    
    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);

  // Notificar cuando se recupera la conexión
  useEffect(() => {
    if (wasOffline && isOnline) {
      if (pendingCount > 0) {
        toast.info(
          `¡Conexión restaurada! Sincronizando ${pendingCount} transacción(es) pendiente(s)...`,
          { duration: 4000 }
        );
        syncPendingTransactions();
      } else {
        toast.success('¡Conexión restaurada!', { duration: 2000 });
      }
    }
  }, [wasOffline, isOnline, pendingCount]);

  const syncPendingTransactions = async () => {
    if (!isOnline || pendingCount === 0) return;

    setSyncStatus('syncing');
    
    try {
      const pending = await getPendingTransactions();
      let synced = 0;
      let failed = 0;

      for (const transaction of pending) {
        // Usar retry con exponential backoff
        const result = await retryWithBackoff(
          () => addTransaction.mutateAsync({
            amount: transaction.amount,
            category: transaction.category as 'food' | 'transport' | 'entertainment' | 'services' | 'shopping' | 'health' | 'other',
            description: transaction.description || '',
          }),
          {
            maxRetries: 3,
            initialDelay: 1000,
            backoffFactor: 2,
            maxDelay: 10000,
            shouldRetry: isRetryableError,
            onRetry: (attempt, error, nextDelay) => {
              console.log(`[Sync] Retry ${attempt} for transaction ${transaction.id}, waiting ${nextDelay}ms`);
            },
          }
        );

        if (result.success) {
          await markTransactionSynced(transaction.id!);
          synced++;
        } else {
          console.error('[Sync] Failed to sync transaction after retries:', result.error);
          failed++;
        }
      }

      // Limpiar transacciones sincronizadas
      await clearSyncedTransactions();
      
      // Actualizar conteo
      const newCount = await getPendingCount();
      setPendingCount(newCount);

      if (failed === 0) {
        setSyncStatus('success');
        toast.success(`${synced} transacción(es) sincronizada(s)`);
      } else {
        setSyncStatus('error');
        toast.error(`${failed} transacción(es) no pudieron sincronizarse`);
      }

      // Reset status después de 3 segundos
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('[Sync] Error syncing:', error);
      setSyncStatus('error');
      toast.error('Error al sincronizar transacciones');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  // No mostrar si no hay pendientes y está idle
  if (pendingCount === 0 && syncStatus === 'idle') return null;

  return (
    <button
      onClick={syncPendingTransactions}
      disabled={!isOnline || syncStatus === 'syncing'}
      className={`fixed bottom-16 right-4 px-3 py-2 rounded-lg shadow-lg z-40 flex items-center gap-2 transition-all text-sm font-medium ${
        syncStatus === 'syncing'
          ? 'bg-blue-600 text-white cursor-wait'
          : syncStatus === 'success'
          ? 'bg-green-600 text-white'
          : syncStatus === 'error'
          ? 'bg-red-600 text-white'
          : isOnline
          ? 'bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer'
          : 'bg-gray-600 text-white cursor-not-allowed'
      }`}
    >
      {syncStatus === 'syncing' ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : syncStatus === 'success' ? (
        <Check className="w-4 h-4" />
      ) : syncStatus === 'error' ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      <span>
        {syncStatus === 'syncing'
          ? 'Sincronizando...'
          : syncStatus === 'success'
          ? '¡Sincronizado!'
          : syncStatus === 'error'
          ? 'Error al sincronizar'
          : `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`}
      </span>
    </button>
  );
}

export default SyncIndicator;
