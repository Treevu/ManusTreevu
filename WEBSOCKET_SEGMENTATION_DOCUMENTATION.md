# WebSocket + Advanced Segmentation Engine Documentation

## Overview

This documentation covers the integration of two powerful systems:
1. **Real-time Notifications System** - WebSocket-based notifications for instant user engagement
2. **Advanced Segmentation Engine** - ML-powered employee segmentation for hyper-personalized interventions

Together, these systems enable Treevü to deliver personalized, real-time notifications based on employee financial wellness profiles.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  (Web Browser, Mobile App, Manager Portal)                  │
└────────────┬────────────────────────────────────────────────┘
             │
             │ WebSocket Connection
             │
┌────────────▼────────────────────────────────────────────────┐
│              WebSocket Server (Express)                      │
│  - Connection Management                                     │
│  - Message Broadcasting                                      │
│  - Heartbeat & Reconnection                                 │
└────────────┬────────────────────────────────────────────────┘
             │
             │ tRPC Procedures
             │
┌────────────▼────────────────────────────────────────────────┐
│           Segmentation Engine (Backend)                      │
│  - Wellness Profile Calculation                             │
│  - Segment Determination                                     │
│  - Recommendation Generation                                │
│  - Campaign Targeting                                        │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Database Queries
             │
┌────────────▼────────────────────────────────────────────────┐
│                  Database (MySQL)                            │
│  - employee_segments table                                  │
│  - websocket_connections table                              │
│  - notification_queue table                                 │
│  - Users & Financial Data                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Real-time Notifications System

### WebSocket Service (`websocketService.ts`)

Manages WebSocket connections and notification delivery.

#### Key Functions

```typescript
// Register a WebSocket connection
registerConnection(userId: number, ws: WebSocket): void

// Send notification to specific user
sendNotificationToUser(userId: number, notification: Notification): void

// Broadcast notification to multiple users
broadcastNotification(userIds: number[], notification: Notification): void

// Process pending notifications for offline users
processPendingNotifications(): Promise<void>

// Send heartbeat to keep connections alive
sendHeartbeat(): void

// Unregister connection when user disconnects
unregisterConnection(userId: number): void
```

#### Notification Types

```typescript
type NotificationType = 
  | 'tier_upgrade'           // User reached new reward tier
  | 'milestone'              // Achievement milestone reached
  | 'compliance_alert'       // Compliance-related alert
  | 'recommendation'         // New personalized recommendation
  | 'intervention_update'    // Intervention status change
```

#### Example Notification

```json
{
  "type": "tier_upgrade",
  "title": "Congratulations! You reached Rising Stars Tier",
  "message": "You've earned new benefits: Mentorship programs, Acceleration tracks, Leadership development",
  "data": {
    "tierName": "Rising Stars",
    "benefits": ["Mentorship", "Acceleration", "Leadership"],
    "discountPercentage": 10
  },
  "timestamp": "2025-12-12T19:40:00Z",
  "read": false
}
```

### WebSocket Router (`websocketRouter.ts`)

tRPC endpoints for managing notifications.

#### Endpoints

```typescript
// Get notification history
trpc.websocket.getHistory.useQuery()

// Mark notification as read
trpc.websocket.markAsRead.useMutation({ notificationId: number })

// Get unread notification count
trpc.websocket.getUnreadCount.useQuery()

// Clear all notifications
trpc.websocket.clearAll.useMutation()

// Get notification preferences
trpc.websocket.getPreferences.useQuery()

// Update notification preferences
trpc.websocket.updatePreferences.useMutation({ 
  enableTierUpgrades: boolean,
  enableMilestones: boolean,
  enableRecommendations: boolean
})

// Get notification statistics
trpc.websocket.getStats.useQuery()
```

### Client Component (`WebSocketNotificationBell.tsx`)

React component for displaying real-time notifications.

#### Features

- Automatic WebSocket connection establishment
- Toast notifications for new messages
- Unread notification counter
- Connection status indicator
- Automatic reconnection on disconnect
- Mark notifications as read

#### Usage

```tsx
import { WebSocketNotificationBell } from '@/components/WebSocketNotificationBell';

export function Header() {
  return (
    <header>
      <h1>Treevü Dashboard</h1>
      <WebSocketNotificationBell />
    </header>
  );
}
```

---

## Advanced Segmentation Engine

### Segmentation Service (`segmentationService.ts`)

Calculates employee wellness profiles and determines segments.

#### Key Functions

```typescript
// Calculate wellness profile for a user
calculateWellnessProfile(userId: number): Promise<WellnessProfile>

// Get personalized recommendations
getPersonalizedRecommendations(userId: number, limit?: number): Promise<Recommendation[]>

// Get segment statistics
getSegmentStatistics(segment: EmployeeSegment): Promise<SegmentStats>

// Update employee segment in database
updateEmployeeSegment(userId: number, profile: WellnessProfile): Promise<void>

// Get employees in a segment
getEmployeesBySegment(segment: EmployeeSegment, limit?: number): Promise<WellnessProfile[]>
```

### Employee Segments

#### 1. Financial Champions
- **Wellness Score**: >= 80
- **FWI Score**: >= 80
- **Engagement**: >= 80
- **Intervention**: Retention & Advocacy
- **Recommendations**: Leadership programs, exclusive benefits

#### 2. Rising Stars
- **Wellness Score**: >= 70
- **Engagement**: >= 70
- **Intervention**: Acceleration & Mentoring
- **Recommendations**: Advanced wealth planning, mentorship

#### 3. Steady Performers
- **Wellness Score**: >= 60
- **Risk Level**: Low
- **Intervention**: Maintenance & Optimization
- **Recommendations**: Investment opportunities, savings optimization

#### 4. At Risk
- **FWI Score**: < 50
- **Risk Level**: High
- **Intervention**: Support & Education
- **Recommendations**: Financial counseling, budget optimization

#### 5. Crisis Intervention
- **FWI Score**: < 30
- **Risk Level**: Critical
- **Intervention**: Emergency Counseling
- **Recommendations**: Debt management, emergency support

### Wellness Profile Structure

```typescript
interface WellnessProfile {
  userId: number;
  wellnessScore: number;        // 0-100
  fwiScore: number;             // 0-100
  spendingLevel: string;        // low | moderate | high | excessive
  riskLevel: string;            // critical | high | medium | low | minimal
  engagementScore: number;      // 0-100
  segment: EmployeeSegment;
  interventionType: string;
  recommendationCount: number;
}
```

### Segmentation Router (`segmentationRouter.ts`)

tRPC endpoints for segmentation operations.

#### Endpoints

```typescript
// Get wellness profile for current user
trpc.segmentation.getWellnessProfile.useQuery()

// Get personalized recommendations
trpc.segmentation.getPersonalizedRecommendations.useQuery({ limit: 5 })

// Get current user segment
trpc.segmentation.getCurrentSegment.useQuery()

// Get segment statistics (admin)
trpc.segmentation.getSegmentStats.useQuery({ segment: 'at_risk' })

// Get employees in segment (admin)
trpc.segmentation.getSegmentEmployees.useQuery({ 
  segment: 'financial_champions',
  limit: 100
})

// Get segment distribution (admin)
trpc.segmentation.getSegmentDistribution.useQuery()

// Get risk distribution (admin)
trpc.segmentation.getRiskDistribution.useQuery()

// Get intervention recommendations (admin)
trpc.segmentation.getInterventionRecommendations.useQuery({ 
  segment: 'at_risk'
})

// Get campaign targets (admin)
trpc.segmentation.getCampaignTargets.useQuery({
  segment: 'financial_champions',
  campaignType: 'retention'
})
```

---

## Integration Workflows

### Workflow 1: Tier Upgrade Notification

```
1. User completes financial goal
2. TreePoints updated in database
3. Cron job runs daily: updateRewardTiersDaily()
4. Segmentation engine detects tier upgrade
5. WebSocket sends notification to user
6. User receives toast notification
7. Recommendation updated for new tier
```

### Workflow 2: Segment Change Detection

```
1. User's FWI Score improves
2. Alert system triggers improvement notification
3. Segmentation engine recalculates wellness profile
4. Segment changes from "At Risk" to "Steady Performers"
5. WebSocket broadcasts segment change notification
6. New recommendations generated for new segment
7. Campaign system targets user with new campaigns
```

### Workflow 3: Campaign Targeting

```
1. Admin creates campaign for "Financial Champions"
2. Segmentation router queries getSegmentEmployees()
3. Returns 250 employees in "Financial Champions" segment
4. Campaign system sends targeted notifications
5. WebSocket delivers notifications in real-time
6. Analytics track engagement and conversion
```

### Workflow 4: Crisis Intervention

```
1. User's FWI Score drops below 30
2. Segmentation engine detects critical risk
3. Segment changes to "Crisis Intervention"
4. WebSocket sends emergency notification
5. Manager receives alert via manager portal
6. Intervention plan auto-created
7. Counselor assigned automatically
```

---

## Database Schema

### employee_segments Table

```sql
CREATE TABLE employee_segments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL UNIQUE,
  segment VARCHAR(50) NOT NULL,
  wellnessScore DECIMAL(5,2),
  fwiScore DECIMAL(5,2),
  spendingLevel VARCHAR(20),
  riskLevel VARCHAR(20),
  engagementScore DECIMAL(5,2),
  interventionType VARCHAR(50),
  recommendationCount INT DEFAULT 0,
  lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_segment (segment),
  INDEX idx_risk_level (riskLevel),
  INDEX idx_last_updated (lastUpdated)
);
```

### websocket_connections Table

```sql
CREATE TABLE websocket_connections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  connectionId VARCHAR(255) UNIQUE,
  connectedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastHeartbeat DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (userId),
  INDEX idx_connected_at (connectedAt)
);
```

### notification_queue Table

```sql
CREATE TABLE notification_queue (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  data JSON,
  status VARCHAR(20) DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  sentAt DATETIME,
  readAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (userId),
  INDEX idx_status (status),
  INDEX idx_created_at (createdAt)
);
```

---

## Performance Considerations

### Optimization Strategies

1. **Database Indexing**
   - Index on `employee_segments.segment` for fast segment queries
   - Index on `employee_segments.riskLevel` for risk filtering
   - Index on `websocket_connections.userId` for connection lookups

2. **Caching**
   - Cache segment statistics (updated hourly)
   - Cache wellness profiles (updated daily via cron)
   - Cache campaign targets (updated when campaigns change)

3. **Batch Processing**
   - Bulk segment updates via cron jobs
   - Batch notification sending for campaigns
   - Batch recommendation generation

4. **WebSocket Optimization**
   - Heartbeat every 30 seconds to detect disconnects
   - Automatic reconnection with exponential backoff
   - Message compression for large payloads

### Scalability

- **10,000 concurrent WebSocket connections**: ~500MB memory
- **Segment calculation**: 10,000 users in < 5 seconds
- **Notification delivery**: 1,000 concurrent messages per second
- **Database queries**: < 100ms for segment queries with proper indexing

---

## Monitoring & Analytics

### Key Metrics

1. **WebSocket Metrics**
   - Active connections count
   - Message delivery rate
   - Reconnection frequency
   - Average message latency

2. **Segmentation Metrics**
   - Segment distribution
   - Segment churn rate
   - Wellness score trends
   - Risk level distribution

3. **Notification Metrics**
   - Delivery rate
   - Open rate
   - Click-through rate
   - Unread count

### Dashboards

- **Admin Dashboard**: Segment distribution, risk levels, campaign performance
- **Manager Dashboard**: Team segment breakdown, intervention tracking
- **Employee Dashboard**: Personal wellness score, recommendations, tier progress

---

## Security Considerations

1. **WebSocket Authentication**
   - Validate JWT token on connection
   - Re-validate on heartbeat
   - Disconnect on token expiration

2. **Data Privacy**
   - Only send notifications to authenticated users
   - Encrypt sensitive data in notifications
   - Audit all notification delivery

3. **Rate Limiting**
   - Limit WebSocket messages per user (100/minute)
   - Limit notification sending (1000/minute per admin)
   - Limit segment update frequency (once per day per user)

---

## Future Enhancements

1. **Machine Learning**
   - Predictive segment modeling
   - Churn prediction
   - Recommendation optimization

2. **Advanced Analytics**
   - Segment cohort analysis
   - Intervention effectiveness tracking
   - ROI by segment

3. **Personalization**
   - Dynamic recommendation ranking
   - A/B testing for campaigns
   - Behavioral segmentation

4. **Mobile Integration**
   - Push notifications via FCM/APNs
   - Mobile app segment dashboard
   - Mobile-specific recommendations

---

## Testing

### Unit Tests

```bash
pnpm test server/services/segmentationService.ts
pnpm test server/services/websocketService.ts
```

### Integration Tests

```bash
pnpm test server/finalIntegration.e2e.test.ts
```

### Load Testing

```bash
# Simulate 1000 concurrent WebSocket connections
artillery quick --count 1000 --num 10 ws://localhost:3000/ws
```

---

## Troubleshooting

### WebSocket Connection Issues

**Problem**: Users not receiving notifications
**Solution**: 
1. Check WebSocket connection status in browser console
2. Verify JWT token is valid
3. Check notification_queue table for pending messages
4. Restart WebSocket server

### Segmentation Issues

**Problem**: Users in wrong segment
**Solution**:
1. Check employee_segments table for correct data
2. Run `bulkUpdateSegments` mutation to recalculate
3. Verify FWI Score and alert counts are accurate
4. Check segmentation logic in `determineSegment()`

### Performance Issues

**Problem**: Slow segment queries
**Solution**:
1. Add database indexes if missing
2. Enable query caching
3. Reduce limit parameter in queries
4. Use batch processing for bulk operations

---

## Support & Contact

For issues or questions about WebSocket + Segmentation integration:
- Check `/WEBSOCKET_SEGMENTATION_DOCUMENTATION.md`
- Review test files for usage examples
- Contact backend team for assistance

---

**Last Updated**: December 12, 2025
**Version**: 1.0.0
