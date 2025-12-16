import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle, Edit2, Lock, Unlock, Plus, Trash2, Check, X, DollarSign, Users
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EWALimit {
  id: number;
  departmentId: number;
  departmentName: string;
  maxAmountPerRequest: number;
  maxMonthlyAmount: number;
  maxRequestsPerMonth: number;
  minFWIScore: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EWALimitsControlProps {
  limits?: EWALimit[];
  departments?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
  onUpdate?: (limitId: number, updates: Partial<EWALimit>) => Promise<void>;
  onDelete?: (limitId: number) => Promise<void>;
  onCreate?: (newLimit: Omit<EWALimit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function EWALimitsControl({
  limits = [],
  departments = [],
  isLoading = false,
  onUpdate,
  onDelete,
  onCreate,
}: EWALimitsControlProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [formData, setFormData] = useState({
    maxAmountPerRequest: 0,
    maxMonthlyAmount: 0,
    maxRequestsPerMonth: 0,
    minFWIScore: 0,
  });

  const handleEditChange = (limitId: number, field: string, value: any) => {
    const limit = limits.find(l => l.id === limitId);
    if (limit && onUpdate) {
      onUpdate(limitId, { ...limit, [field]: value });
    }
  };

  const handleCreate = async () => {
    if (!selectedDept || !formData.maxAmountPerRequest) {
      alert('Por favor completa todos los campos');
      return;
    }

    const dept = departments.find(d => d.id === parseInt(selectedDept));
    if (dept && onCreate) {
      await onCreate({
        departmentId: parseInt(selectedDept),
        departmentName: dept.name,
        maxAmountPerRequest: formData.maxAmountPerRequest * 100,
        maxMonthlyAmount: formData.maxMonthlyAmount * 100,
        maxRequestsPerMonth: formData.maxRequestsPerMonth,
        minFWIScore: formData.minFWIScore,
        isActive: true,
      });
      setShowCreateDialog(false);
      setSelectedDept('');
      setFormData({
        maxAmountPerRequest: 0,
        maxMonthlyAmount: 0,
        maxRequestsPerMonth: 0,
        minFWIScore: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Control de Límites EWA</h2>
          <p className="text-gray-400 mt-1">Configura límites de adelantos por departamento</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Límite
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-treevu-surface border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Límite de EWA</DialogTitle>
              <DialogDescription className="text-gray-400">
                Define los límites de adelantos para un departamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Departamento</label>
                <Select value={selectedDept} onValueChange={setSelectedDept}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-treevu-surface border-white/10">
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={String(dept.id)} className="text-white">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Monto Máximo por Solicitud (S/)</label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.maxAmountPerRequest}
                  onChange={(e) => setFormData({ ...formData, maxAmountPerRequest: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Monto Máximo Mensual (S/)</label>
                <Input
                  type="number"
                  placeholder="20000"
                  value={formData.maxMonthlyAmount}
                  onChange={(e) => setFormData({ ...formData, maxMonthlyAmount: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Máximo de Solicitudes por Mes</label>
                <Input
                  type="number"
                  placeholder="4"
                  value={formData.maxRequestsPerMonth}
                  onChange={(e) => setFormData({ ...formData, maxRequestsPerMonth: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">FWI Score Mínimo</label>
                <Input
                  type="number"
                  placeholder="40"
                  min="0"
                  max="100"
                  value={formData.minFWIScore}
                  onChange={(e) => setFormData({ ...formData, minFWIScore: parseInt(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} className="bg-brand-primary hover:bg-brand-primary/90">
                Crear Límite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert de información */}
      <Alert className="bg-blue-500/10 border-blue-500/30">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          Los límites se aplican a todas las solicitudes nuevas de EWA. Los cambios entran en vigor inmediatamente.
        </AlertDescription>
      </Alert>

      {/* Tabla de Límites */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Límites por Departamento</CardTitle>
          <CardDescription className="text-gray-400">
            {limits.length} departamento{limits.length !== 1 ? 's' : ''} configurado{limits.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {limits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400">Departamento</th>
                    <th className="text-center py-3 px-4 text-gray-400">Máx. por Solicitud</th>
                    <th className="text-center py-3 px-4 text-gray-400">Máx. Mensual</th>
                    <th className="text-center py-3 px-4 text-gray-400">Máx. Solicitudes/Mes</th>
                    <th className="text-center py-3 px-4 text-gray-400">FWI Mínimo</th>
                    <th className="text-center py-3 px-4 text-gray-400">Estado</th>
                    <th className="text-center py-3 px-4 text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {limits.map((limit) => (
                    <tr key={limit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{limit.departmentName}</td>
                      <td className="py-3 px-4 text-center text-brand-primary font-semibold">
                        S/ {(limit.maxAmountPerRequest / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4 text-center text-blue-400">
                        S/ {(limit.maxMonthlyAmount / 100).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4 text-center text-yellow-400 font-semibold">
                        {limit.maxRequestsPerMonth}
                      </td>
                      <td className="py-3 px-4 text-center text-orange-400">
                        {limit.minFWIScore}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {limit.isActive ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <Check className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            <X className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={() => setEditingId(editingId === limit.id ? null : limit.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => onDelete && onDelete(limit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p className="text-gray-400">No hay límites configurados</p>
              <p className="text-sm text-gray-500 mt-1">Crea el primer límite para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recomendaciones de Límites</CardTitle>
          <CardDescription className="text-gray-400">Basado en mejores prácticas de la industria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white mb-2">Para Departamentos de Alto Riesgo</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Máximo por solicitud: S/ 2,000 - 3,000</li>
                <li>• Máximo mensual: S/ 8,000 - 10,000</li>
                <li>• FWI Score mínimo: 50-60</li>
                <li>• Máximo 2-3 solicitudes por mes</li>
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white mb-2">Para Departamentos de Riesgo Medio</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Máximo por solicitud: S/ 4,000 - 5,000</li>
                <li>• Máximo mensual: S/ 15,000 - 20,000</li>
                <li>• FWI Score mínimo: 40-50</li>
                <li>• Máximo 3-4 solicitudes por mes</li>
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white mb-2">Para Departamentos de Bajo Riesgo</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Máximo por solicitud: S/ 6,000 - 8,000</li>
                <li>• Máximo mensual: S/ 25,000 - 30,000</li>
                <li>• FWI Score mínimo: 30-40</li>
                <li>• Máximo 4-5 solicitudes por mes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
