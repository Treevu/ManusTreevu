import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface TableHeaderTooltipProps {
  header: string;
  tooltip: string;
  children?: ReactNode;
}

/**
 * Componente para agregar tooltips a encabezados de tablas
 * Muestra un ícono de ayuda al lado del encabezado
 */
export function TableHeaderTooltip({
  header,
  tooltip,
  children,
}: TableHeaderTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className="font-semibold">{header}</span>
            <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-gray-900 text-white border border-gray-700 text-sm"
        >
          <p className="font-medium mb-1">{header}</p>
          <p className="text-gray-200">{tooltip}</p>
          {children && <div className="mt-2 text-xs text-gray-300">{children}</div>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Textos de tooltips para encabezados de tablas
 */
export const tableHeaderTooltips = {
  // Buyer List
  buyerName: "Nombre o identificador del comprador en el sistema",
  buyerScore: "Score de readiness del comprador (0-100). Mayor = más probable que compre",
  buyerSegment: "Segmento al que pertenece: Muy Listo, Listo, Potencial, No Listo",
  buyerCapacity: "Capacidad financiera del comprador basada en FWI y ahorros",
  buyerIntention: "Probabilidad de que el comprador tenga intención de compra",
  buyerUrgency: "Urgencia de compra basada en cambios de vida y necesidades",
  buyerDaysToClose: "Días estimados para que este comprador cierre la compra",
  buyerAction: "Acciones recomendadas para este comprador",

  // Receipt History
  receiptDate: "Fecha en que se procesó el recibo",
  receiptMerchant: "Nombre del comercio donde se realizó la compra",
  receiptAmount: "Monto total de la transacción",
  receiptCategory: "Categoría automáticamente clasificada por IA",
  receiptConfidence: "Precisión del OCR al extraer datos (0-100%)",
  receiptStatus: "Estado del recibo: Procesado, Pendiente, Error",
  receiptItems: "Número de artículos en el recibo",
  receiptPaymentMethod: "Método de pago utilizado",

  // Expense Categories
  categoryName: "Nombre de la categoría de gasto",
  categoryTotal: "Monto total gastado en esta categoría este mes",
  categoryPercentage: "Porcentaje del presupuesto total usado en esta categoría",
  categoryTrend: "Tendencia del gasto: ↑ aumentando, ↓ disminuyendo, → estable",
  categoryAverage: "Promedio de gasto diario en esta categoría",
  categoryTransactions: "Número de transacciones en esta categoría",
  categoryBudget: "Presupuesto asignado a esta categoría",
  categoryStatus: "Estado: En presupuesto, Sobre presupuesto, Crítico",

  // Ant Expense List
  antExpenseName: "Descripción del gasto hormiga detectado",
  antExpenseAmount: "Monto individual de cada gasto hormiga",
  antExpenseFrequency: "Frecuencia: Diario, Semanal, Mensual",
  antExpenseImpact: "Impacto acumulado mensual de este gasto hormiga",
  antExpenseReduction: "Cantidad que podrías ahorrar si reduces este gasto",
  antExpenseRank: "Ranking por impacto: #1 es el más impactante",

  // Merchant Offers
  offerName: "Nombre de la oferta o promoción",
  offerDiscount: "Porcentaje o monto de descuento ofrecido",
  offerExpiry: "Fecha de vencimiento de la oferta",
  offerRedemptions: "Número de veces que fue canjeada",
  offerROI: "Retorno de inversión estimado de la oferta",
  offerStatus: "Estado: Activa, Próxima, Finalizada",
};
