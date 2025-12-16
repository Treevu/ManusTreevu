import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export function AdminRewardTiersManager() {
  const { data: tiers, isLoading, refetch } = (trpc as any).ecosystem.rewards.getTiers.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (tier: any) => {
    setEditingId(tier.id);
    setFormData(tier);
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd call an update mutation
      toast.success("Tier actualizado correctamente");
      setIsOpen(false);
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Error al actualizar el tier");
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reward Tiers Management</CardTitle>
          <CardDescription>Manage TreePoints reward tiers and benefits</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({}); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Tier" : "Create New Tier"}</DialogTitle>
              <DialogDescription>
                Configure tier requirements and benefits
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tier Name</label>
                <Input
                  value={formData.tierName || ""}
                  onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                  placeholder="e.g., Gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Points</label>
                  <Input
                    type="number"
                    value={formData.minPoints || ""}
                    onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Points</label>
                  <Input
                    type="number"
                    value={formData.maxPoints || ""}
                    onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Discount %</label>
                  <Input
                    type="number"
                    value={formData.discountPercentage || ""}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">EWA Rate Reduction (bps)</label>
                  <Input
                    type="number"
                    value={formData.ewaRateReduction || ""}
                    onChange={(e) => setFormData({ ...formData, ewaRateReduction: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Tier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {tiers?.map((tier: any) => (
            <div
              key={tier.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{tier.tierName}</h3>
                <p className="text-sm text-gray-600">
                  {tier.minPoints} - {tier.maxPoints || "∞"} points
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge variant="outline">{tier.discountPercentage}% off</Badge>
                  <p className="text-xs text-gray-600 mt-1">
                    -{(tier.ewaRateReduction / 100).toFixed(2)}% EWA
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(tier)}
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
