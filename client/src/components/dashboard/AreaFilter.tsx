import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

export interface Department {
  id: number;
  name: string;
  employeeCount?: number | null;
  avgFwiScore?: number | null;
}

interface AreaFilterProps {
  departments: Department[];
  selectedArea: number | null;
  onAreaChange: (areaId: number | null) => void;
  isLoading?: boolean;
}

export default function AreaFilter({
  departments,
  selectedArea,
  onAreaChange,
  isLoading = false,
}: AreaFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDepartment = departments.find(d => d.id === selectedArea);

  const handleClear = () => {
    onAreaChange(null);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Filtrar por Área:</span>
      </div>

      <Select
        value={selectedArea?.toString() || 'all'}
        onValueChange={(value) => {
          if (value === 'all') {
            onAreaChange(null);
          } else {
            onAreaChange(parseInt(value));
          }
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[200px] bg-treevu-surface/50 border-white/10">
          <SelectValue placeholder="Seleccionar área..." />
        </SelectTrigger>
        <SelectContent className="bg-treevu-surface border-white/10">
          <SelectItem value="all" className="text-white">
            Todas las Áreas
          </SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id.toString()} className="text-white">
              <div className="flex items-center gap-2">
                <span>{dept.name}</span>
                {dept.employeeCount && (
                  <span className="text-xs text-gray-400">
                    ({dept.employeeCount} empleados)
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedArea && selectedDepartment && (
        <div className="flex items-center gap-2">
          <Badge className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
            {selectedDepartment.name}
            {selectedDepartment.employeeCount && (
              <span className="ml-2 text-xs">
                {selectedDepartment.employeeCount} empleados
              </span>
            )}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 hover:bg-red-500/10"
            title="Limpiar filtro"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </Button>
        </div>
      )}

      {selectedArea && selectedDepartment?.avgFwiScore && (
        <div className="text-sm text-gray-400 ml-auto">
          FWI Promedio: <span className="text-white font-semibold">{selectedDepartment.avgFwiScore}</span>
        </div>
      )}
    </div>
  );
}
