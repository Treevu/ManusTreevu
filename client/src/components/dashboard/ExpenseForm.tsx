import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; label: string }> = [
  { value: "food", label: "Comida y Restaurantes" },
  { value: "transport", label: "Transporte" },
  { value: "services", label: "Servicios (Luz, Agua, Internet)" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "shopping", label: "Compras" },
  { value: "health", label: "Salud y Bienestar" },
  { value: "other", label: "Otro" },
];

type ExpenseCategory = "food" | "transport" | "entertainment" | "services" | "health" | "shopping" | "other";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    amount: string;
    category: ExpenseCategory;
    description: string;
    date: string;
  }>({
    amount: "",
    category: "food",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const createTransactionMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      toast.success("Gasto registrado exitosamente");
      setFormData({
        amount: "",
        category: "food",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar gasto");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    createTransactionMutation.mutate({
      amount,
      category: formData.category,
      description: formData.description || "",
      merchant: "Gasto registrado manualmente",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-green-600/30 text-green-600 hover:bg-green-600/10"
        >
          <Plus className="h-4 w-4" />
          Registrar Gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Nuevo Gasto</DialogTitle>
          <DialogDescription className="text-slate-400">
            Agrega un nuevo gasto a tu historial financiero
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300">
              Monto *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">S/</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="pl-8 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-300">
              Categoría *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as ExpenseCategory })}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Descripción (opcional)
            </Label>
            <Input
              id="description"
              placeholder="Ej: Almuerzo en restaurante"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              maxLength={200}
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-300">
              Fecha *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="bg-slate-800 border-slate-600 text-white"
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createTransactionMutation.isPending}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
            >
              {createTransactionMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
