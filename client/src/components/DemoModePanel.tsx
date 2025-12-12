import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  RefreshCw, 
  Play, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  Presentation,
  Database,
  Users,
  ShoppingBag,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface DemoStats {
  employees: number;
  transactions: number;
  offers: number;
  ewaRequests: number;
}

export function DemoModePanel() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastReset, setLastReset] = useState<Date | null>(null);

  // Query para obtener estadísticas actuales
  const { data: stats, refetch: refetchStats } = trpc.demo.getStats.useQuery(undefined, {
    retry: false,
  });

  const resetMutation = trpc.demo.resetData.useMutation({
    onSuccess: () => {
      toast.success('Datos de demo limpiados correctamente');
      setIsResetting(false);
      setShowResetDialog(false);
      refetchStats();
    },
    onError: (error: { message: string }) => {
      toast.error('Error al limpiar datos: ' + error.message);
      setIsResetting(false);
    },
  });

  const seedMutation = trpc.demo.seedData.useMutation({
    onSuccess: (data: { employees: number; transactions: number }) => {
      toast.success(`Datos de demo creados: ${data.employees} empleados, ${data.transactions} transacciones`);
      setIsSeeding(false);
      setLastReset(new Date());
      refetchStats();
    },
    onError: (error: { message: string }) => {
      toast.error('Error al crear datos: ' + error.message);
      setIsSeeding(false);
    },
  });

  const handleReset = async () => {
    setIsResetting(true);
    resetMutation.mutate();
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    seedMutation.mutate();
  };

  const handleFullReset = async () => {
    setIsResetting(true);
    try {
      await resetMutation.mutateAsync();
      setIsSeeding(true);
      await seedMutation.mutateAsync();
      toast.success('Demo reiniciado completamente');
      setLastReset(new Date());
    } catch {
      toast.error('Error durante el reinicio');
    } finally {
      setIsResetting(false);
      setIsSeeding(false);
      setShowResetDialog(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-300 flex items-center gap-2">
            <Presentation className="h-5 w-5" />
            Modo Demo
          </CardTitle>
          <CardDescription className="text-amber-200/70">
            Controles para reiniciar datos entre presentaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estadísticas actuales */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Empleados</p>
                <p className="text-lg font-bold text-white">{stats?.employees || 0}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2">
              <Database className="h-4 w-4 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Transacciones</p>
                <p className="text-lg font-bold text-white">{stats?.transactions || 0}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400">Ofertas</p>
                <p className="text-lg font-bold text-white">{stats?.offers || 0}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">EWA Requests</p>
                <p className="text-lg font-bold text-white">{stats?.ewaRequests || 0}</p>
              </div>
            </div>
          </div>

          {/* Último reinicio */}
          {lastReset && (
            <div className="flex items-center gap-2 text-xs text-amber-300/70">
              <CheckCircle2 className="h-3 w-3" />
              Último reinicio: {lastReset.toLocaleTimeString('es-MX')}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
              onClick={() => setShowResetDialog(true)}
              disabled={isResetting || isSeeding}
            >
              {isResetting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Reiniciar Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-green-500/50 text-green-300 hover:bg-green-500/20"
              onClick={handleSeed}
              disabled={isResetting || isSeeding}
            >
              {isSeeding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Poblar Datos
            </Button>
          </div>

          {/* Nota de advertencia */}
          <p className="text-xs text-amber-200/50 flex items-start gap-1">
            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Solo visible para administradores. Usar entre presentaciones.
          </p>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              ¿Reiniciar datos de demo?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción eliminará todos los datos transaccionales (transacciones, EWA requests, 
              notificaciones, badges) y los reemplazará con datos frescos de demostración.
              <br /><br />
              <strong className="text-amber-300">Los usuarios y configuración se mantendrán.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFullReset}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isResetting || isSeeding}
            >
              {(isResetting || isSeeding) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sí, reiniciar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DemoModePanel;
