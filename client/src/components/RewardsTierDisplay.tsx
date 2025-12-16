import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Star, Crown } from "lucide-react";

const tierIcons: Record<string, React.ReactNode> = {
  Award: <Award className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
};

const tierColors: Record<string, string> = {
  amber: "bg-amber-100 text-amber-900",
  gray: "bg-gray-100 text-gray-900",
  yellow: "bg-yellow-100 text-yellow-900",
  blue: "bg-blue-100 text-blue-900",
};

export function RewardsTierDisplay() {
  const { user } = useAuth();
  const { data: userTier, isLoading: tierLoading } = (trpc as any).ecosystem.rewards.getUserTier.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: allTiers, isLoading: tiersLoading } = (trpc as any).ecosystem.rewards.getTiers.useQuery();
  const { data: discount } = (trpc as any).ecosystem.rewards.getDiscount.useQuery(undefined, {
    enabled: !!user,
  });

  if (tierLoading || tiersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>TreePoints Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-32 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!userTier || !allTiers) {
    return null;
  }

  // Find current and next tier
  const currentTierIndex = allTiers.findIndex((t: any) => t.id === userTier.id);
  const nextTier = allTiers[currentTierIndex + 1];

  // Calculate progress to next tier
  let progressPercent = 100;
  if (nextTier && userTier.maxPoints) {
    const currentRange = userTier.maxPoints - userTier.minPoints;
    const nextRange = nextTier.maxPoints ? nextTier.maxPoints - nextTier.minPoints : currentRange;
    progressPercent = Math.min(100, ((user?.treePoints || 0) - userTier.minPoints) / currentRange * 100);
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {tierIcons[userTier.tierIcon as string] || <Award className="w-6 h-6" />}
              {userTier.tierName} Tier
            </CardTitle>
            <CardDescription>{userTier.description}</CardDescription>
          </div>
          <Badge className={`${tierColors[userTier.tierColor as string]} text-lg px-4 py-2`}>
            {user?.treePoints || 0} pts
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Tier Benefits */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Current Benefits</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">Marketplace Discount</p>
              <p className="text-lg font-bold text-green-600">{userTier.discountPercentage}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">EWA Rate Reduction</p>
              <p className="text-lg font-bold text-green-600">
                {(userTier.ewaRateReduction / 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Progress to {nextTier.tierName}</h3>
              <span className="text-xs text-gray-600">
                {nextTier.minPoints - (user?.treePoints || 0)} points needed
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-gray-600">
              {userTier.minPoints} → {nextTier.minPoints} points
            </p>
          </div>
        )}

        {/* All Tiers Overview */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Tier Progression</h3>
          <div className="space-y-2">
            {allTiers.map((tier: any) => (
              <div
                key={tier.id}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                  tier.id === userTier.id ? "bg-green-100 border-l-4 border-green-600" : "bg-gray-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tierColors[tier.tierColor as string]}`}>
                  {tierIcons[tier.tierIcon as string]}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{tier.tierName}</p>
                  <p className="text-xs text-gray-600">{tier.minPoints}+ points</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-green-600">{tier.discountPercentage}% off</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
