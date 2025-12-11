import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Command } from 'cmdk';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import {
  Search,
  Home,
  TrendingUp,
  Wallet,
  Target,
  Gift,
  Bell,
  Settings,
  FileText,
  Store,
  Users,
  Building2,
  Shield,
  Sparkles,
  Calendar,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { EwaIcon } from '@/components/ui/ewa-icon';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  // Fetch data for search
  const { data: transactions } = trpc.transactions.list.useQuery(
    { limit: 50 },
    { enabled: open && !!user }
  );

  const { data: goals } = trpc.goals.list.useQuery(
    undefined,
    { enabled: open && !!user }
  );

  const { data: offers } = trpc.merchant.getOffers.useQuery(
    undefined,
    { enabled: open && !!user }
  );

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      { icon: Home, label: 'Inicio', path: '/app', keywords: ['home', 'dashboard', 'inicio'] },
      { icon: TrendingUp, label: 'Mi Dashboard', path: '/employee', keywords: ['dashboard', 'fwi', 'score'] },
      { icon: EwaIcon, label: 'Adelanto de Salario (EWA)', path: '/ewa', keywords: ['ewa', 'adelanto', 'salario', 'dinero'] },
      { icon: Gift, label: 'Ofertas y TreePoints', path: '/offers', keywords: ['ofertas', 'puntos', 'treepoints', 'recompensas'] },
      { icon: FileText, label: 'Reportes', path: '/reports', keywords: ['reportes', 'pdf', 'resumen', 'análisis'] },
      { icon: Bell, label: 'Notificaciones', path: '/notifications', keywords: ['notificaciones', 'alertas'] },
      { icon: Settings, label: 'Configuración', path: '/settings/notifications', keywords: ['configuración', 'ajustes', 'preferencias'] },
    ];

    if (user?.role === 'b2b_admin' || user?.role === 'admin') {
      items.push(
        { icon: Building2, label: 'Dashboard B2B', path: '/b2b', keywords: ['b2b', 'rrhh', 'departamentos', 'riesgo'] },
        { icon: Shield, label: 'Panel Admin', path: '/admin', keywords: ['admin', 'administración', 'usuarios'] }
      );
    }

    if (user?.role === 'merchant') {
      items.push(
        { icon: Store, label: 'Dashboard Merchant', path: '/merchant', keywords: ['merchant', 'comercio', 'tienda', 'ofertas'] }
      );
    }

    return items;
  };

  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Command Dialog */}
      <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl">
        <Command
          className="rounded-xl border shadow-2xl bg-white dark:bg-gray-900 overflow-hidden"
          loop
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar transacciones, metas, ofertas..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
              ESC
            </kbd>
          </div>
          
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No se encontraron resultados.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Acciones Rápidas" className="px-2 py-1.5 text-xs font-semibold text-gray-500">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/employee'))}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Ver mi FWI Score</div>
                  <div className="text-xs text-gray-500">Consulta tu índice de bienestar financiero</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => navigate('/ewa'))}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Wallet className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Solicitar Adelanto</div>
                  <div className="text-xs text-gray-500">Accede a tu salario devengado</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => navigate('/offers'))}
                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900">
                  <Gift className="h-4 w-4 text-pink-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Canjear TreePoints</div>
                  <div className="text-xs text-gray-500">Explora ofertas exclusivas</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Command.Item>
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navegación" className="px-2 py-1.5 text-xs font-semibold text-gray-500">
              {getNavigationItems().map((item) => (
                <Command.Item
                  key={item.path}
                  value={`${item.label} ${item.keywords.join(' ')}`}
                  onSelect={() => runCommand(() => navigate(item.path))}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                >
                  <item.icon className="h-4 w-4 text-gray-500" />
                  <span>{item.label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Transactions */}
            {transactions && transactions.length > 0 && search && (
              <Command.Group heading="Transacciones" className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                {transactions
                  .filter((t: any) => 
                    t.description?.toLowerCase().includes(search.toLowerCase()) ||
                    t.category?.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((transaction: any) => (
                    <Command.Item
                      key={transaction.id}
                      value={`transacción ${transaction.description} ${transaction.category}`}
                      onSelect={() => runCommand(() => navigate('/employee'))}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{transaction.description}</div>
                        <div className="text-xs text-gray-500">{transaction.category} • {formatDate(transaction.date)}</div>
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </div>
                    </Command.Item>
                  ))}
              </Command.Group>
            )}

            {/* Goals */}
            {goals && goals.length > 0 && search && (
              <Command.Group heading="Metas Financieras" className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                {goals
                  .filter((g: any) => 
                    g.name?.toLowerCase().includes(search.toLowerCase()) ||
                    g.category?.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((goal: any) => {
                    const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                    return (
                      <Command.Item
                        key={goal.id}
                        value={`meta ${goal.name} ${goal.category}`}
                        onSelect={() => runCommand(() => navigate('/employee'))}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                          <Target className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{goal.name}</div>
                          <div className="text-xs text-gray-500">{goal.category}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {progress}%
                        </div>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            )}

            {/* Offers */}
            {offers && offers.length > 0 && search && (
              <Command.Group heading="Ofertas" className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                {offers
                  .filter((o: any) => 
                    o.title?.toLowerCase().includes(search.toLowerCase()) ||
                    o.description?.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((offer: any) => (
                    <Command.Item
                      key={offer.id}
                      value={`oferta ${offer.title} ${offer.description}`}
                      onSelect={() => runCommand(() => navigate('/offers'))}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{offer.title}</div>
                        <div className="text-xs text-gray-500">{offer.discountPercent}% descuento</div>
                      </div>
                      <div className="text-sm font-medium text-amber-600">
                        {offer.pointsCost} pts
                      </div>
                    </Command.Item>
                  ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer */}
          <div className="border-t px-3 py-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">↑↓</kbd>
              <span>Navegar</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">↵</kbd>
              <span>Seleccionar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 font-mono">K</kbd>
              <span>para abrir</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}

// Hook to use command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    toggle: () => setOpen((prev) => !prev),
  };
}

export default CommandPalette;
