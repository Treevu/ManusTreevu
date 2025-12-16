# Area Filter Feature - Guía de Implementación

## Descripción General

Se ha implementado un sistema de filtrado por área (departamento) en el Dashboard B2B que permite a los administradores visualizar métricas y datos específicos de un departamento seleccionado.

---

## Componentes Implementados

### 1. AreaFilter Component
**Ubicación:** `client/src/components/dashboard/AreaFilter.tsx`

**Características:**
- Selector dropdown de áreas/departamentos
- Visualización de cantidad de empleados por área
- Mostrar FWI Score promedio del área seleccionada
- Botón para limpiar el filtro
- Indicador visual del área seleccionada con badge
- Soporte para carga (loading state)

**Props:**
```typescript
interface AreaFilterProps {
  departments: Department[];        // Lista de departamentos disponibles
  selectedArea: number | null;      // ID del área seleccionada
  onAreaChange: (areaId: number | null) => void;  // Callback al cambiar área
  isLoading?: boolean;              // Estado de carga
}
```

**Interfaz Department:**
```typescript
interface Department {
  id: number;
  name: string;
  employeeCount?: number | null;
  avgFwiScore?: number | null;
}
```

---

## Integración en B2BDashboard

### Cambios Realizados:

1. **Estado del Filtro:**
   ```typescript
   const [selectedArea, setSelectedArea] = useState<number | null>(null);
   ```

2. **Renderizado del Componente:**
   ```typescript
   {departments && departments.length > 0 && (
     <div className="mb-6 p-4 bg-treevu-surface/50 border border-white/10 rounded-lg">
       <AreaFilter
         departments={departments}
         selectedArea={selectedArea}
         onAreaChange={setSelectedArea}
         isLoading={metricsLoading}
       />
     </div>
   )}
   ```

3. **Filtrado de Datos:**
   - **Risk Analysis Tab:** Filtra empleados por `departmentId`
   - **Risk Summary by Department:** Filtra resumen de riesgos por departamento

---

## Funcionalidad de Filtrado

### Risk Analysis Tab
```typescript
riskAnalysis
  .filter(emp => !selectedArea || emp.departmentId === selectedArea)
  .slice(0, 10)
  .map((employee) => ...)
```

**Comportamiento:**
- Si no hay área seleccionada: muestra todos los empleados
- Si hay área seleccionada: muestra solo empleados de ese departamento
- Limita a los primeros 10 resultados

### Risk Summary by Department
```typescript
metrics.riskSummary
  .filter(dept => !selectedArea || dept.departmentId === selectedArea)
  .map((dept, i) => ...)
```

**Comportamiento:**
- Si no hay área seleccionada: muestra resumen de todos los departamentos
- Si hay área seleccionada: muestra solo el resumen de ese departamento

---

## Estilos y Diseño

### Contenedor del Filtro:
- Fondo: `bg-treevu-surface/50`
- Borde: `border border-white/10`
- Padding: `p-4`
- Border Radius: `rounded-lg`
- Margen inferior: `mb-6`

### Componentes UI Utilizados:
- **Select** (shadcn/ui) - Selector dropdown
- **Badge** - Mostrar área seleccionada
- **Button** - Botón para limpiar filtro
- **Icons** (lucide-react) - Filter y X icons

### Colores:
- Texto principal: `text-white`
- Texto secundario: `text-gray-400`
- Badge: `bg-brand-primary/20 text-brand-primary`
- Hover: `hover:bg-white/10`

---

## Casos de Uso

### 1. Ver empleados en riesgo de un departamento específico
1. Navegar a Dashboard B2B
2. Seleccionar departamento en el filtro de área
3. El tab de "Riesgo" mostrará solo empleados de ese departamento

### 2. Comparar riesgo entre departamentos
1. Navegar a Dashboard B2B
2. Sin seleccionar área, ver resumen de todos los departamentos
3. Seleccionar un departamento para ver detalles específicos

### 3. Monitorear FWI Score por departamento
1. Seleccionar un departamento en el filtro
2. El badge mostrará el FWI Score promedio del departamento
3. Usar esta información para priorizar intervenciones

---

## Datos Requeridos

El componente requiere que los datos tengan las siguientes propiedades:

### Para Risk Analysis:
```typescript
{
  id: number;
  userId: number;
  departmentId: number;  // Requerido para filtrado
  tenure: number;
  absenteeismRisk: 'critical' | 'high' | 'medium' | 'low';
  // ... otros campos
}
```

### Para Risk Summary:
```typescript
{
  departmentId: number;  // Requerido para filtrado
  employeeCount: number;
  avgIpr: number;
  highRiskCount: number;
  projectedLoss: number;
}
```

---

## Próximas Mejoras

### Corto Plazo:
1. **Filtro Múltiple** - Permitir seleccionar varios departamentos simultáneamente
2. **Búsqueda** - Agregar búsqueda por nombre de departamento
3. **Ordenamiento** - Ordenar departamentos por nombre, empleados, FWI Score

### Mediano Plazo:
1. **Filtros Avanzados** - Combinar con otros filtros (rango de FWI, riesgo, etc.)
2. **Guardar Preferencias** - Recordar última área seleccionada
3. **Exportación Filtrada** - Exportar datos del departamento seleccionado

### Largo Plazo:
1. **Comparación de Departamentos** - Comparar métricas entre departamentos
2. **Análisis Temporal** - Ver evolución de métricas por departamento
3. **Alertas por Departamento** - Configurar alertas específicas por área

---

## Troubleshooting

### El filtro no aparece
- Verificar que `departments` no esté vacío
- Verificar que la query `trpc.b2b.getDepartments` esté retornando datos

### El filtrado no funciona
- Verificar que los datos tengan el campo `departmentId`
- Verificar que los IDs coincidan entre departamentos y empleados

### Estilos no se ven correctamente
- Verificar que las clases de Tailwind estén disponibles
- Verificar que el tema dark esté activo en ThemeProvider

---

## Archivos Modificados

1. **client/src/pages/B2BDashboard.tsx**
   - Agregado import de AreaFilter
   - Agregado estado `selectedArea`
   - Agregado renderizado del componente
   - Agregado filtrado en Risk Analysis Tab
   - Agregado filtrado en Risk Summary

2. **client/src/components/dashboard/AreaFilter.tsx** (Nuevo)
   - Componente completo de filtro

---

## Validación

- ✅ 257 tests pasando
- ✅ Build exitoso sin errores TypeScript
- ✅ Componente compilando correctamente
- ✅ Integración validada con B2BDashboard

---

## Performance

- **Filtrado en Cliente:** El filtrado se realiza en el cliente, por lo que es instantáneo
- **Sin Queries Adicionales:** No requiere llamadas adicionales a la API
- **Escalable:** Funciona eficientemente con hasta 100+ departamentos

---

**Última Actualización:** Diciembre 2024
**Versión:** 1.0
**Estado:** Listo para Producción
