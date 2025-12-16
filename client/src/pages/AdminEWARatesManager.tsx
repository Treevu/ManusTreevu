import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const riskLevelColors: Record<string, string> = {
  critical: "bg-red-100 text-red-900",
  high: "bg-orange-100 text-orange-900",
  medium: "bg-yellow-100 text-yellow-900",
  low: "bg-green-100 text-green-900",
};

export function AdminEWARatesManager() {
  const { data: rates, isLoading, refetch } = (trpc as any).ecosystem.ewaRates.getAllRates.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (rate: any) => {
    setEditingId(rate.id);
    setFormData(rate);
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      toast.success("Rate actualizada correctamente");
      setIsOpen(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Error al actualizar la rate");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>EWA Dynamic Rates Management</CardTitle>
          <CardDescription>Configure dynamic EWA rates based on FWI Score</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({}); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Rate" : "Create New Rate"}</DialogTitle>
              <DialogDescription>
                Configure EWA rates for different FWI Score ranges
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min FWI Score</label>
                  <Input
                    type="number"
                    value={formData.minFwiScore || ""}
                    onChange={(e) => setFormData({ ...formData, minFwiScore: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max FWI Score</label>
                  <Input
                    type="number"
                    value={formData.maxFwiScore || ""}
                    onChange={(e) => setFormData({ ...formData, maxFwiScore: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Base Fee %</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.baseFeePercentage || ""}
                  onChange={(e) => setFormData({ ...formData, baseFeePercentage: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Risk Level</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.riskLevel || ""}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Incentive Message</label>
                <Input
                  value={formData.incentiveMessage || ""}
                  onChange={(e) => setFormData({ ...formData, incentiveMessage: e.target.value })}
                  placeholder="Message to encourage improvement"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Rate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {rates?.map((rate: any) => (
            <div
              key={rate.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">FWI {rate.minFwiScore}-{rate.maxFwiScore}</h3>
                  <Badge className={riskLevelColors[rate.riskLevel]}>
                    {rate.riskLevel}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{rate.feeDescription}</p>
                {rate.incentiveMessage && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 {rate.incentiveMessage}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold">{rate.baseFeePercentage}%</p>
                  <p className="text-xs text-gray-600">Fee on $1,000 = ${(parseFloat(rate.baseFeePercentage.toString()) * 10).toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(rate)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
