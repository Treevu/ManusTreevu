import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Target } from "lucide-react";
import { useState } from "react";

const urgencyColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-900",
  medium: "bg-yellow-100 text-yellow-900",
  high: "bg-red-100 text-red-900",
};

export function PersonalizedRecommendationsCarousel() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: recommendations, isLoading } = (trpc as any).ecosystem.recommendations.getPersonalized.useQuery(
    undefined,
    { enabled: !!user }
  );

  const markViewedMutation = (trpc as any).ecosystem.recommendations.markViewed.useMutation();
  const markConvertedMutation = (trpc as any).ecosystem.recommendations.markConverted.useMutation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-40 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Offers</CardTitle>
          <CardDescription>No offers available at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Check back soon for personalized recommendations based on your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const currentRec = recommendations[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1));
  };

  const handleView = async () => {
    if (!currentRec.isViewed) {
      await markViewedMutation.mutateAsync({ recommendationId: currentRec.id });
    }
  };

  const handleApply = async () => {
    await markConvertedMutation.mutateAsync({ recommendationId: currentRec.id });
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Personalized Offers
            </CardTitle>
            <CardDescription>
              {currentIndex + 1} of {recommendations.length} recommendations
            </CardDescription>
          </div>
          <Badge className="bg-purple-600 text-white">
            {recommendations.filter((r: any) => r.isConverted).length} Applied
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Recommendation */}
        <div className="bg-white p-6 rounded-lg border-2 border-purple-200 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{currentRec.recommendationType}</h3>
              <p className="text-sm text-gray-600">Relevance: {currentRec.relevanceScore}%</p>
            </div>
            <Badge className={`${urgencyColors[currentRec.urgency as string]}`}>
              {currentRec.urgency}
            </Badge>
          </div>

          {/* Savings Info */}
          {currentRec.estimatedSavings && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Estimated Savings</p>
                <p className="font-bold text-green-600">${currentRec.estimatedSavings}</p>
              </div>
            </div>
          )}

          {/* Expiration */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              Expires: {new Date(currentRec.expiresAt).toLocaleDateString()}
            </span>
          </div>

          {/* Social Proof */}
          {currentRec.socialProof && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 {currentRec.socialProof}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleView}
              variant="outline"
              className="flex-1"
              disabled={currentRec.isViewed}
            >
              {currentRec.isViewed ? "✓ Viewed" : "View Details"}
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={currentRec.isConverted}
            >
              {currentRec.isConverted ? "✓ Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-1">
            {recommendations.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-purple-600 w-6"
                    : "bg-purple-200 w-2 hover:bg-purple-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-purple-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Total Offers</p>
            <p className="font-bold text-purple-600">{recommendations.length}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Viewed</p>
            <p className="font-bold text-blue-600">
              {recommendations.filter((r: any) => r.isViewed).length}
            </p>
          </div>
          <div className="bg-green-100 p-2 rounded text-center">
            <p className="text-xs text-gray-600">Applied</p>
            <p className="font-bold text-green-600">
              {recommendations.filter((r: any) => r.isConverted).length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
