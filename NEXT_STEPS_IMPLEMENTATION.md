# Treevü Backend - Implementation of 3 Suggested Next Steps

## Overview

This document outlines the implementation of three critical features for the Treevü platform:

1. **Intervention Automation Engine** - Automated workflows triggered by churn risk levels
2. **Mobile Push Notifications** - Device token management and campaign delivery
3. **Executive Reporting Dashboard** - Automated reports and executive metrics

---

## 1. Intervention Automation Engine

### Purpose
Automatically create and execute intervention workflows based on employee churn risk levels, with success tracking and ROI calculation.

### Key Components

#### Service: `server/services/interventionAutomationService.ts`

**Core Functions:**

- `createInterventionWorkflow(request)` - Create intervention based on risk level
  - Determines intervention type (counseling, education, personalized_offer, etc.)
  - Sets priority based on risk level
  - Defines success metrics

- `getUserActiveWorkflows(userId)` - Get all active interventions for a user
- `getHighPriorityWorkflows(limit)` - Get critical interventions requiring immediate action
- `startInterventionWorkflow(workflowId)` - Activate a pending workflow
- `completeInterventionWorkflow(workflowId, actualResults)` - Mark workflow as completed
- `addInterventionAction(workflowId, userId, actionType, description, actionData)` - Add action to workflow
- `recordSuccessMetrics(...)` - Record intervention outcomes and calculate success score
- `getInterventionEffectiveness(interventionType)` - Get effectiveness metrics by type

#### Intervention Types

| Type | Trigger | Duration | Target FWI Improvement |
|------|---------|----------|----------------------|
| **counseling** | Critical risk or FWI < 30 | 30 days | +15 points |
| **education** | At-risk segment | 60 days | +8 points |
| **personalized_offer** | High risk | 14 days | Special offer |
| **manager_alert** | Crisis intervention | 45 days | +20 points |
| **ewa_support** | EWA needs | 30 days | +12 points |
| **goal_creation** | Low engagement | 90 days | +5 points |
| **engagement_boost** | Default | 21 days | +engagement |

#### Success Score Calculation

```
Score (0-100) = 
  FWI Improvement (max 25) +
  Churn Risk Reduction (max 25) +
  Engagement Increase (max 25) +
  ROI Achievement (max 25)
```

#### API Endpoints (tRPC)

```typescript
// Create intervention
trpc.interventions.create.mutate({
  userId: number,
  churnProbability: number,
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal',
  segment: string,
  fwiScore: number
})

// Get user's active interventions
trpc.interventions.getActive.useQuery()

// Get high-priority interventions (admin only)
trpc.interventions.getHighPriority.useQuery({ limit?: number })

// Record intervention success
trpc.interventions.recordSuccess.mutate({
  workflowId: number,
  userId: number,
  interventionType: string,
  preInterventionFwi: number,
  postInterventionFwi: number,
  churnRiskBefore: number,
  churnRiskAfter: number,
  engagementIncrease: number,
  estimatedSavings: number,
  actualSavings: number
})

// Get effectiveness metrics
trpc.interventions.getEffectiveness.useQuery({ interventionType: string })
```

---

## 2. Mobile Push Notifications

### Purpose
Manage device tokens, create notification campaigns, and track delivery metrics across iOS, Android, and Web platforms.

### Key Components

#### Service: `server/services/mobilePushService.ts`

**Core Functions:**

- `registerDeviceToken(request)` - Register or update device token
  - Supports iOS, Android, Web
  - Tracks app version and OS version
  - Marks as active

- `unregisterDeviceToken(deviceToken)` - Deactivate device token
- `getUserDeviceTokens(userId)` - Get all active tokens for user
- `createPushCampaign(request, createdBy)` - Create notification campaign
  - Supports scheduling
  - Target by segment or risk level
  - Includes image and action URL

- `sendPushNotification(campaignId, userId, deviceToken)` - Send notification
  - Records delivery attempt
  - Updates campaign metrics

- `recordPushOpen(campaignId, userId)` - Track notification open
  - Updates open rate
  - Records timestamp

- `recordPushClick(campaignId, userId)` - Track notification click
  - Updates click rate
  - Records timestamp

- `getCampaignAnalytics(campaignId)` - Get detailed campaign metrics
- `getCampaignDeliveryStatus(campaignId)` - Get delivery status breakdown
- `sendCampaignToSegment(campaignId, userIds)` - Batch send to segment
- `updateCampaignStatus(campaignId, status)` - Update campaign status

#### Campaign Types

- `churn_alert` - Alert about churn risk
- `intervention_offer` - Intervention opportunity
- `engagement_boost` - Engagement incentive
- `achievement_unlock` - Badge/achievement notification
- `goal_reminder` - Goal progress reminder
- `educational_content` - Learning content
- `promotional` - Special offers

#### API Endpoints (tRPC)

```typescript
// Register device
trpc.pushNotifications.registerDevice.mutate({
  deviceToken: string,
  deviceType: 'ios' | 'android' | 'web',
  appVersion?: string,
  osVersion?: string
})

// Unregister device
trpc.pushNotifications.unregisterDevice.mutate({
  deviceToken: string
})

// Create campaign (admin only)
trpc.pushNotifications.createCampaign.mutate({
  campaignName: string,
  campaignType: string,
  title: string,
  body: string,
  imageUrl?: string,
  actionUrl?: string,
  targetSegment?: string,
  targetRiskLevel?: string,
  scheduledAt?: Date
})

// Get campaigns (admin only)
trpc.pushNotifications.getCampaigns.useQuery({
  status?: string,
  campaignType?: string,
  limit?: number
})

// Get campaign analytics (admin only)
trpc.pushNotifications.getAnalytics.useQuery({ campaignId: number })

// Record open
trpc.pushNotifications.recordOpen.mutate({ campaignId: number })

// Record click
trpc.pushNotifications.recordClick.mutate({ campaignId: number })
```

#### Metrics Tracked

| Metric | Description |
|--------|-------------|
| **totalSent** | Number of notifications sent |
| **totalOpened** | Number of notifications opened |
| **totalClicked** | Number of notifications clicked |
| **openRate** | Percentage of sent that were opened |
| **clickRate** | Percentage of sent that were clicked |

---

## 3. Executive Reporting Dashboard

### Purpose
Generate automated executive reports with key metrics, dashboards, and subscription management for C-suite decision-making.

### Key Components

#### Service: `server/services/executiveReportingService.ts`

**Core Functions:**

- `generateExecutiveReport(request)` - Generate comprehensive report
  - Builds report data
  - Generates executive summary
  - Extracts key metrics
  - Creates recommendations

- `getExecutiveReport(reportId)` - Retrieve specific report
- `getReportsByType(reportType, limit)` - Get reports by type
- `recordDashboardMetrics(departmentId, date, metrics)` - Record daily metrics
  - Tracks FWI scores
  - Churn risk analysis
  - Intervention metrics
  - Tree points activity
  - EWA metrics
  - Engagement scores

- `getDashboardMetrics(startDate, endDate, departmentId)` - Get metrics for date range
- `getLatestDashboardMetrics(departmentId)` - Get most recent metrics
- `subscribeToReport(userId, reportType, frequency, deliveryMethod)` - Subscribe to reports
  - Supports daily, weekly, monthly, quarterly
  - Email or dashboard delivery

- `getUserSubscriptions(userId)` - Get user's report subscriptions
- `getReportsDueForDelivery()` - Get reports ready to send
- `updateReportSubscription(subscriptionId, isActive)` - Update subscription status
- `generateMonthlySummary(year, month, departmentId)` - Generate monthly report
- `generateChurnAnalysisReport(departmentId)` - Generate churn analysis
- `generateInterventionROIReport(departmentId)` - Generate ROI analysis

#### Report Types

| Type | Frequency | Content |
|------|-----------|---------|
| **monthly_summary** | Monthly | All key metrics and trends |
| **churn_analysis** | As needed | Churn risk and prediction |
| **intervention_roi** | As needed | Intervention effectiveness and ROI |
| **department_health** | Weekly | Department-specific metrics |
| **executive_dashboard** | Daily | Real-time dashboard metrics |

#### Dashboard Metrics

```typescript
{
  date: string,              // YYYY-MM-DD
  totalEmployees: number,
  avgFwiScore: number,       // 0-100
  employeesAtRisk: number,
  riskPercentage: number,    // 0-100
  churnRiskAverage: number,  // 0-1
  predictedChurnCount: number,
  activeInterventions: number,
  completedInterventions: number,
  interventionSuccessRate: number,  // 0-100
  estimatedROI: number,      // in cents
  totalTreePointsIssued: number,
  totalTreePointsRedeemed: number,
  ewaRequestsCount: number,
  ewaApprovalRate: number,   // 0-100
  engagementScore: number    // 0-100
}
```

#### API Endpoints (tRPC)

```typescript
// Generate report (admin only)
trpc.executiveReports.generateReport.mutate({
  reportType: string,
  reportPeriod: string,
  departmentId?: number
})

// Get specific report (admin only)
trpc.executiveReports.getReport.useQuery({ reportId: number })

// Get reports by type (admin only)
trpc.executiveReports.getByType.useQuery({
  reportType: string,
  limit?: number
})

// Get dashboard metrics (admin only)
trpc.executiveReports.getDashboardMetrics.useQuery({
  startDate: string,
  endDate: string,
  departmentId?: number
})

// Get latest metrics (admin only)
trpc.executiveReports.getLatestMetrics.useQuery({
  departmentId?: number
})

// Subscribe to reports
trpc.executiveReports.subscribeToReport.mutate({
  reportType: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
  deliveryMethod?: 'email' | 'dashboard' | 'both'
})

// Get subscriptions
trpc.executiveReports.getSubscriptions.useQuery()
```

---

## Database Schema

### New Tables

#### `intervention_workflows`
- Core intervention tracking
- Status: pending, active, completed
- Priority: critical, high, medium, low
- Stores success metrics and actual results

#### `intervention_actions`
- Individual actions within workflows
- Action types: counseling, offer, education, etc.
- Status tracking and results

#### `intervention_success_metrics`
- Outcome measurements
- FWI improvement tracking
- Churn risk reduction
- Success score calculation

#### `mobile_push_notifications`
- Device token registration
- Device type and OS tracking
- Active status management

#### `push_notification_campaigns`
- Campaign configuration
- Delivery tracking
- Open/click rate metrics

#### `push_notification_delivery_log`
- Individual delivery records
- Status tracking (sent, delivered, failed)
- Open and click timestamps

#### `executive_reports`
- Generated reports
- Report data and summaries
- Key metrics and recommendations

#### `executive_dashboard_metrics`
- Daily metric snapshots
- Department-specific tracking
- Historical data for trends

#### `report_subscriptions`
- User report subscriptions
- Frequency and delivery preferences
- Next send date tracking

---

## Implementation Status

✅ **Completed:**
- Service implementations
- Database schema updates
- tRPC procedure definitions
- Type definitions and validation
- Test suite (257 tests passing)

🔄 **In Progress:**
- Integration testing
- Performance optimization
- Documentation

📋 **Next Steps:**
- Frontend integration
- Automated scheduling
- Email delivery integration
- Analytics dashboard
- Mobile app integration

---

## Usage Examples

### Intervention Automation

```typescript
// Create intervention for at-risk employee
const workflow = await trpc.interventions.create.mutate({
  userId: 123,
  churnProbability: 0.75,
  riskLevel: 'high',
  segment: 'at_risk',
  fwiScore: 35
});

// Record success after intervention
await trpc.interventions.recordSuccess.mutate({
  workflowId: workflow.id,
  userId: 123,
  interventionType: 'counseling',
  preInterventionFwi: 35,
  postInterventionFwi: 48,
  churnRiskBefore: 0.75,
  churnRiskAfter: 0.45,
  engagementIncrease: 25,
  estimatedSavings: 5000,
  actualSavings: 7500
});
```

### Push Notifications

```typescript
// Register device
await trpc.pushNotifications.registerDevice.mutate({
  deviceToken: 'abc123...',
  deviceType: 'ios',
  appVersion: '1.0.0'
});

// Create campaign
const campaign = await trpc.pushNotifications.createCampaign.mutate({
  campaignName: 'Churn Alert Campaign',
  campaignType: 'churn_alert',
  title: 'We miss you!',
  body: 'Your financial wellness score has improved. Check it out!',
  targetRiskLevel: 'high'
});

// Track engagement
await trpc.pushNotifications.recordOpen.mutate({
  campaignId: campaign.campaignId
});
```

### Executive Reporting

```typescript
// Subscribe to monthly reports
await trpc.executiveReports.subscribeToReport.mutate({
  reportType: 'monthly_summary',
  frequency: 'monthly',
  deliveryMethod: 'email'
});

// Get latest metrics
const metrics = await trpc.executiveReports.getLatestMetrics.useQuery();

// Generate custom report
const report = await trpc.executiveReports.generateReport.mutate({
  reportType: 'intervention_roi',
  reportPeriod: '2024-12',
  departmentId: 5
});
```

---

## Testing

All implementations have been tested with the existing test suite:

```bash
pnpm test
# Result: 257 tests passing
```

---

## Future Enhancements

1. **Real-time Notifications** - WebSocket integration for instant alerts
2. **Advanced Analytics** - ML-based prediction improvements
3. **Custom Reports** - User-defined report templates
4. **API Webhooks** - External system integration
5. **Mobile App Integration** - Native push notification support
6. **Automated Scheduling** - Cron job automation for reports
7. **Email Delivery** - Automated email report distribution
8. **Dashboard Visualization** - Interactive charts and graphs

---

## Support

For questions or issues with these implementations, please refer to:
- Service documentation in code comments
- Test files for usage examples
- tRPC procedure definitions for API contracts
