import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Sheet, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  formats: string[];
  icon: React.ReactNode;
}

interface ExportDataProps {
  dashboardType: 'employee' | 'company' | 'merchant' | 'executive';
  isLoading?: boolean;
}

export default function ExportData({
  dashboardType,
  isLoading = false,
}: ExportDataProps) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const exportOptions: ExportOption[] = [
    {
      id: 'summary',
      name: 'Resumen Ejecutivo',
      description: 'KPIs principales y análisis clave',
      formats: ['PDF', 'Excel'],
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'detailed',
      name: 'Reporte Detallado',
      description: 'Todos los datos y análisis completos',
      formats: ['PDF', 'Excel', 'CSV'],
      icon: <Sheet className="w-5 h-5" />,
    },
    {
      id: 'comparison',
      name: 'Análisis Comparativo',
      description: 'Comparación período actual vs anterior',
      formats: ['PDF', 'Excel'],
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  const handleExport = (optionId: string, format: string) => {
    toast.success(`Exportando ${optionId} en formato ${format}...`);
    // Simular descarga
    setTimeout(() => {
      toast.success(`Reporte descargado exitosamente`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando opciones de exportación...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <Card key={option.id} className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-blue-400">{option.icon}</div>
                <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                  {option.formats.length} formatos
                </Badge>
              </div>
              <CardTitle className="text-base text-white mt-2">{option.name}</CardTitle>
              <CardDescription className="text-gray-400">{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {option.formats.map((format) => (
                  <Button
                    key={format}
                    size="sm"
                    onClick={() => handleExport(option.id, format)}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {format}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Export */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Exportación Personalizada</CardTitle>
          <CardDescription className="text-gray-400">Elige qué datos incluir en tu reporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-treevu-surface border-white/20">
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mes</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Año</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Formato</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-treevu-surface border-white/20">
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 block">Incluir en el reporte</label>
            <div className="space-y-2">
              {[
                { id: 'metrics', label: 'Métricas Principales' },
                { id: 'charts', label: 'Gráficos y Visualizaciones' },
                { id: 'analysis', label: 'Análisis Detallado' },
                { id: 'recommendations', label: 'Recomendaciones' },
                { id: 'comparison', label: 'Comparación Histórica' },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={item.id}
                    defaultChecked
                    className="w-4 h-4 rounded border-white/20 bg-white/10"
                  />
                  <label htmlFor={item.id} className="text-sm text-gray-300 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              toast.success(`Generando reporte en ${selectedFormat.toUpperCase()}...`);
              setTimeout(() => {
                toast.success('Reporte descargado exitosamente');
              }, 1500);
            }}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte Personalizado
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Exports */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Exportaciones Programadas</CardTitle>
          <CardDescription className="text-gray-400">Recibe reportes automáticos en tu email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white">Reporte Mensual</h4>
                <p className="text-xs text-gray-400">Cada 1º del mes a las 08:00</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-transparent">Activo</Badge>
            </div>
            <p className="text-sm text-gray-300">Resumen ejecutivo en PDF</p>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white">Reporte Semanal</h4>
                <p className="text-xs text-gray-400">Cada lunes a las 09:00</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-transparent">Activo</Badge>
            </div>
            <p className="text-sm text-gray-300">Análisis de la semana en Excel</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Crear Nueva Exportación Programada
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-treevu-surface border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Programar Exportación</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Configura un reporte automático que se enviará a tu email
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Frecuencia</label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent className="bg-treevu-surface border-white/20">
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
                  Crear Programación
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Historial de Exportaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: 'Reporte Mensual - Diciembre', date: 'Hace 2 días', format: 'PDF' },
            { name: 'Análisis Comparativo Q4', date: 'Hace 5 días', format: 'Excel' },
            { name: 'Resumen Ejecutivo', date: 'Hace 1 semana', format: 'PDF' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div>
                <p className="text-sm text-gray-300">{item.name}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                  {item.format}
                </Badge>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
