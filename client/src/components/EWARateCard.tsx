import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

const riskColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  critical: {
    bg: "bg-red-100",
    text: "text-red-900",
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
  },
  high: {
    bg: "bg-orange-100",
    text: "text-orange-900",
    icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
  },
  medium: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    icon: <TrendingDown className="w-5 h-5 text-yellow-600" />,
  },
  low: {
    bg: "bg-green-100",
    text: "text-green-900",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
};

export function EWARateCard() {
  const { user } = useAuth();
  const { data: userRate, isLoading } = (trpc as any).ecosystem.ewaRates.getUserRate.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: allRates } = (trpc as any).ecosystem.ewaRates.getAllRates.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>EWA Dynamic Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-32 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!userRate || !allRates) {
    return null;
  }

  const riskLevel = userRate.riskLevel as keyof typeof riskColors;
  const riskInfo = riskColors[riskLevel] || riskColors.medium;

  return (
    <Card className={`border-2 ${riskInfo.bg}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {riskInfo.icon}
              EWA Dynamic Rate
            </CardTitle>
            <CardDescription>{userRate.feeDescription}</CardDescription>
          </div>
          <Badge className={`${riskInfo.bg} ${riskInfo.text} text-lg px-4 py-2`}>
            {userRate.baseFeePercentage}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Rate Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Your Current Rate</h3>
          <div className="bg-white p-4 rounded-lg border-2 border-current">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">FWI Score</span>
              <span className="font-bold text-lg">{user?.fwiScore || 50}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fee on $1,000</span>
              <span className="font-bold text-lg">
                ${(parseFloat(userRate.baseFeePercentage.toString()) * 10).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Incentive Message */}
        {userRate.incentiveMessage && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-900">{userRate.incentiveMessage}</AlertDescription>
          </Alert>
        )}

        {/* Rate Comparison */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Rate Progression</h3>
          <div className="space-y-2">
            {allRates.map((rate: any) => {
              const isCurrentRate = rate.id === userRate.id;
              return (
                <div
                  key={rate.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCurrentRate
                      ? "bg-white border-current shadow-md"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium text-sm ${isCurrentRate ? "text-bold" : ""}`}>
                        FWI {rate.minFwiScore}-{rate.maxFwiScore}
                      </p>
                      <p className="text-xs text-gray-600">{rate.feeDescription}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{rate.baseFeePercentage}%</p>
                      <p className="text-xs text-gray-600">
                        ${(parseFloat(rate.baseFeePercentage.toString()) * 10).toFixed(2)}/1k
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Improvement Path */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
          <h3 className="font-semibold text-sm text-blue-900">How to Improve Your Rate</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Increase savings and reduce debt</li>
            <li>✓ Complete financial education courses</li>
            <li>✓ Use EWA responsibly</li>
            <li>✓ Set and achieve financial goals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
