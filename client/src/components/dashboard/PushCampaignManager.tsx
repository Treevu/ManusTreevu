import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Send, Plus, BarChart3, Eye, MousePointerClick, 
  TrendingUp, Calendar, Users 
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Campaign {
  id: number;
  campaignName: string;
  campaignType: string;
  title: string;
  body: string;
  status: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  openRate: string;
  clickRate: string;
  createdAt: Date;
}

interface PushCampaignManagerProps {
  campaigns: Campaign[];
}

export default function PushCampaignManager({ campaigns }: PushCampaignManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: 'engagement_boost',
    title: '',
    body: '',
    targetSegment: '',
    targetRiskLevel: '',
  });

  const createCampaignMutation = (trpc as any).pushNotifications?.createCampaign?.useMutation({
    onSuccess: () => {
      toast.success('Campaign created successfully');
      setIsOpen(false);
      setFormData({
        campaignName: '',
        campaignType: 'engagement_boost',
        title: '',
        body: '',
        targetSegment: '',
        targetRiskLevel: '',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to create campaign: ' + (error?.message || 'Unknown error'));
    },
  }) as any;

  const handleCreateCampaign = () => {
    if (!formData.campaignName || !formData.title || !formData.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    createCampaignMutation.mutate({
      ...formData,
      scheduledAt: undefined,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      churn_alert: 'Churn Alert',
      intervention_offer: 'Intervention Offer',
      engagement_boost: 'Engagement Boost',
      achievement_unlock: 'Achievement',
      goal_reminder: 'Goal Reminder',
      educational_content: 'Educational',
      promotional: 'Promotional',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Create Campaign Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Push Notification Campaigns</h2>
          <p className="text-slate-600 mt-1">Manage and monitor notification campaigns</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a new push notification campaign for your users
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label className="text-sm font-medium text-slate-700">Campaign Name *</label>
                <Input
                  placeholder="e.g., Q4 Engagement Boost"
                  value={formData.campaignName}
                  onChange={(e) =>
                    setFormData({ ...formData, campaignName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Campaign Type */}
              <div>
                <label className="text-sm font-medium text-slate-700">Campaign Type *</label>
                <Select
                  value={formData.campaignType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, campaignType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="churn_alert">Churn Alert</SelectItem>
                    <SelectItem value="intervention_offer">Intervention Offer</SelectItem>
                    <SelectItem value="engagement_boost">Engagement Boost</SelectItem>
                    <SelectItem value="achievement_unlock">Achievement Unlock</SelectItem>
                    <SelectItem value="goal_reminder">Goal Reminder</SelectItem>
                    <SelectItem value="educational_content">Educational Content</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-slate-700">Notification Title *</label>
                <Input
                  placeholder="e.g., Your financial wellness improved!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-sm font-medium text-slate-700">Message Body *</label>
                <Textarea
                  placeholder="e.g., Your FWI score has improved by 5 points. Keep up the great work!"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Target Segment */}
              <div>
                <label className="text-sm font-medium text-slate-700">Target Segment (Optional)</label>
                <Input
                  placeholder="e.g., at_risk, high_engagement"
                  value={formData.targetSegment}
                  onChange={(e) =>
                    setFormData({ ...formData, targetSegment: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              {/* Target Risk Level */}
              <div>
                <label className="text-sm font-medium text-slate-700">Target Risk Level (Optional)</label>
                <Select
                  value={formData.targetRiskLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetRiskLevel: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Risk Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCampaign}
                  disabled={createCampaignMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
                  <CardDescription className="mt-1">
                    {getCampaignTypeLabel(campaign.campaignType)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Preview */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="font-medium text-slate-900">{campaign.title}</p>
                <p className="text-sm text-slate-600 mt-1">{campaign.body}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Sent</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{campaign.totalSent}</p>
                </div>

                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Opened</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{campaign.totalOpened}</p>
                  <p className="text-xs text-slate-600">{campaign.openRate}%</p>
                </div>

                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MousePointerClick className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Clicked</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{campaign.totalClicked}</p>
                  <p className="text-xs text-slate-600">{campaign.clickRate}%</p>
                </div>
              </div>

              {/* Campaign Date */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* View Details Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {campaigns.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <Send className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first push notification campaign to engage your users
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Campaign
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
