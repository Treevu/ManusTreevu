import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

// Base skeleton con animación shimmer
function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] rounded",
        className
      )}
      style={style}
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


/**
 * ChartSkeleton - Skeleton para gráficos
 */
export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-8 rounded-t"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

/**
 * TableRowSkeleton - Skeleton para filas de tabla
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === 0 ? 'w-32' : i === columns - 1 ? 'w-20' : 'w-24'}`}
        />
      ))}
    </div>
  );
}

/**
 * TableSkeleton - Skeleton para tablas completas
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl bg-treevu-surface/80 border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

/**
 * B2BDashboardSkeleton - Skeleton específico para B2B Dashboard
 */
export function B2BDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-treevu-surface/80 border border-white/10">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
          <Skeleton className="h-6 w-40 mb-4" />
          <ChartSkeleton height={200} />
        </div>
        <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
          <Skeleton className="h-6 w-40 mb-4" />
          <ChartSkeleton height={200} />
        </div>
      </div>

      {/* Table */}
      <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
        <Skeleton className="h-6 w-48 mb-4" />
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}

/**
 * MerchantDashboardSkeleton - Skeleton específico para Merchant Dashboard
 */
export function MerchantDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Offers Grid */}
      <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <OfferGridSkeleton count={3} />
      </div>

      {/* Recent Validations */}
      <div className="p-4 rounded-xl bg-treevu-surface/80 border border-white/10">
        <Skeleton className="h-6 w-48 mb-4" />
        <TransactionListSkeleton count={4} />
      </div>
    </div>
  );
}

/**
 * LeaderboardSkeleton - Skeleton para el leaderboard
 */
export function LeaderboardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * BadgeGridSkeleton - Skeleton para grid de badges
 */
export function BadgeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
      ))}
    </div>
  );
}

/**
 * ProfileSkeleton - Skeleton para perfil de usuario
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center p-4 bg-white/5 rounded-lg">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
