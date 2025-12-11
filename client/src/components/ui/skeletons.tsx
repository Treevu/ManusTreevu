import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Base skeleton con animación shimmer
function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] rounded",
        className
      )} 
    />
  );
}

/**
 * FWIScoreSkeleton - Skeleton para la card de FWI Score
 */
export function FWIScoreSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-brand-primary/20 to-segment-empresa/20 backdrop-blur-sm border border-brand-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-baseline space-x-2">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-6 w-10" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full mt-4" />
    </div>
  );
}

/**
 * TransactionSkeleton - Skeleton para una transacción individual
 */
export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

/**
 * TransactionListSkeleton - Skeleton para lista de transacciones
 */
export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * OfferCardSkeleton - Skeleton para una card de oferta
 */
export function OfferCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-full rounded-md mt-2" />
    </div>
  );
}

/**
 * OfferGridSkeleton - Skeleton para grid de ofertas
 */
export function OfferGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * MetricCardSkeleton - Skeleton para cards de métricas
 */
export function MetricCardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton - Skeleton completo para un dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      {/* FWI Card */}
      <FWIScoreSkeleton />
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
          <Skeleton className="h-6 w-32 mb-4" />
          <TransactionListSkeleton count={3} />
        </div>
        <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
          <Skeleton className="h-6 w-32 mb-4" />
          <TransactionListSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
