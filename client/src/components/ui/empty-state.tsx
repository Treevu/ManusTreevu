import { Button } from '@/components/ui/button';
import { LucideIcon, FileQuestion, Inbox, Search, Users, Gift, Target, Wallet, TrendingUp, Award } from 'lucide-react';
import { Link } from 'wouter';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'compact' | 'card';
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
}: EmptyStateProps) {
  const isCompact = variant === 'compact';
  const isCard = variant === 'card';

  const content = (
    <div className={`text-center ${isCompact ? 'py-6' : 'py-12'}`}>
      <div className={`mx-auto ${isCompact ? 'mb-3' : 'mb-4'} ${
        isCard ? 'bg-white/5 p-4 rounded-full w-fit' : ''
      }`}>
        <Icon className={`${isCompact ? 'h-10 w-10' : 'h-14 w-14'} text-gray-500 mx-auto`} />
      </div>
      <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-white mb-2`}>
        {title}
      </h3>
      <p className={`text-gray-400 ${isCompact ? 'text-sm' : ''} max-w-sm mx-auto mb-4`}>
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button className="bg-brand-primary hover:bg-brand-secondary">
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button onClick={action.onClick} className="bg-brand-primary hover:bg-brand-secondary">
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                onClick={secondaryAction.onClick}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );

  if (isCard) {
    return (
      <div className="rounded-xl bg-treevu-surface/80 backdrop-blur-sm border border-white/10 p-6">
        {content}
      </div>
    );
  }

  return content;
}

// Pre-configured empty states for common scenarios
export function NoTransactionsEmpty({ onAddFirst }: { onAddFirst?: () => void }) {
  return (
    <EmptyState
      icon={Wallet}
      title="Sin transacciones"
      description="Registra tu primer gasto para empezar a rastrear tus finanzas y ganar TreePoints."
      action={onAddFirst ? { label: 'Registrar gasto', onClick: onAddFirst } : undefined}
    />
  );
}

export function NoGoalsEmpty({ onCreateGoal }: { onCreateGoal?: () => void }) {
  return (
    <EmptyState
      icon={Target}
      title="Sin metas de ahorro"
      description="Crea tu primera meta financiera y gana 100 TreePoints al completarla."
      action={onCreateGoal ? { label: 'Crear meta', onClick: onCreateGoal } : undefined}
    />
  );
}

export function NoOffersEmpty() {
  return (
    <EmptyState
      icon={Gift}
      title="Sin ofertas disponibles"
      description="No hay ofertas activas en este momento. Vuelve pronto para ver nuevos descuentos exclusivos."
    />
  );
}

export function NoEmployeesEmpty() {
  return (
    <EmptyState
      icon={Users}
      title="Sin empleados"
      description="Aún no hay empleados registrados en tu organización. Invita a tu equipo para comenzar."
      action={{ label: 'Invitar empleados', href: '/b2b/invite' }}
    />
  );
}

export function NoSearchResultsEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Sin resultados"
      description={`No encontramos resultados para "${query}". Intenta con otros términos de búsqueda.`}
    />
  );
}

export function NoBadgesEmpty() {
  return (
    <EmptyState
      icon={Award}
      title="Sin insignias"
      description="Completa tutoriales, logros y desafíos para ganar tus primeras insignias."
      action={{ label: 'Ver tutoriales', href: '/education' }}
    />
  );
}

export function NoEWARequestsEmpty() {
  return (
    <EmptyState
      icon={Wallet}
      title="Sin solicitudes de EWA"
      description="No hay solicitudes de adelanto de nómina pendientes de revisión."
    />
  );
}

export function NoDataEmpty({ title, description }: { title?: string; description?: string }) {
  return (
    <EmptyState
      icon={Inbox}
      title={title || "Sin datos"}
      description={description || "No hay información disponible en este momento."}
    />
  );
}

export function NoChartDataEmpty() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="Sin datos suficientes"
      description="Necesitamos más datos para generar este gráfico. Continúa usando la plataforma para ver tus estadísticas."
      variant="compact"
    />
  );
}
