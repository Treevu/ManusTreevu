# Treevü Mobile Component Library

Complete React Native component library for the Treevü mobile application. These components are designed to accelerate mobile app development and ensure design consistency across all screens.

## Components

### 1. RewardsTierCard

Displays user's current reward tier, progress to the next tier, and available benefits.

**Features:**
- Visual tier display with icons and colors
- Progress bar showing points toward next tier
- Benefits list for current tier
- Action buttons for tier upgrade and viewing all tiers
- Light/dark theme support

**Props:**
```typescript
interface RewardsTierCardProps {
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  treePoints: number;
  pointsToNextTier: number;
  benefits?: string[];
  onTierUpgrade?: () => void;
  onViewDetails?: () => void;
  theme?: 'light' | 'dark';
}
```

**Example Usage:**
```tsx
<RewardsTierCard
  currentTier="Silver"
  treePoints={2500}
  pointsToNextTier={500}
  benefits={["5% discount", "Priority support", "Exclusive offers"]}
  onTierUpgrade={() => navigateToEarnPoints()}
  onViewDetails={() => navigateToTierInfo()}
  theme="light"
/>
```

**Tier Information:**
- **Bronze:** 0% discount, Basic support
- **Silver:** 5% discount, Priority support, Exclusive offers
- **Gold:** 10% discount, VIP support, Early access to features
- **Platinum:** 15% discount, Concierge service, Custom solutions

---

### 2. RecommendationCarousel

Horizontal scrollable carousel displaying personalized recommendations with swipe gestures and interaction tracking.

**Features:**
- Horizontal scrolling carousel with pagination
- Recommendation cards with images, descriptions, and savings
- Urgency badges (low, medium, high)
- Category badges with icons
- Relevance score visualization
- Dismiss functionality
- Call-to-action buttons

**Props:**
```typescript
interface RecommendationCarouselProps {
  recommendations: Recommendation[];
  onSwipe?: (id: string) => void;
  onPress?: (id: string) => void;
  onDismiss?: (id: string) => void;
  theme?: 'light' | 'dark';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  savings: number;
  relevanceScore: number; // 0-1
  urgency: 'low' | 'medium' | 'high';
  imageUrl?: string;
  cta: string;
}
```

**Example Usage:**
```tsx
<RecommendationCarousel
  recommendations={[
    {
      id: 'rec_1',
      title: 'Budget Optimization',
      description: 'Reduce spending by 15% with smart budgeting',
      category: 'savings',
      savings: 250,
      relevanceScore: 0.92,
      urgency: 'high',
      imageUrl: 'https://...',
      cta: 'Learn More'
    }
  ]}
  onPress={(id) => handleRecommendationClick(id)}
  onDismiss={(id) => handleDismiss(id)}
  theme="light"
/>
```

**Category Icons:**
- 💰 Savings
- 🏥 Health
- 🧘 Wellness
- 📚 Education
- 🎁 Offers

---

### 3. InterventionTracker

Displays active intervention progress with timeline, milestones, and completion tracking.

**Features:**
- Intervention header with type, title, and status
- Overall progress bar with percentage
- Milestone tracking with completion status
- Expandable milestone details
- Time remaining and ROI information
- Action buttons (pause, complete, resume)
- Status indicators

**Props:**
```typescript
interface InterventionTrackerProps {
  intervention: Intervention;
  onUpdate?: () => void;
  onComplete?: () => void;
  onPause?: () => void;
  theme?: 'light' | 'dark';
}

interface Intervention {
  id: string;
  type: 'education' | 'goals' | 'offers' | 'counseling' | 'manager_alert';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number; // 0-100
  milestones: Milestone[];
  estimatedROI: number;
  actualROI?: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
}
```

**Example Usage:**
```tsx
<InterventionTracker
  intervention={{
    id: 'int_1',
    type: 'education',
    title: 'Financial Literacy Program',
    description: 'Learn essential money management skills',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    status: 'active',
    progress: 65,
    milestones: [
      {
        id: 'm1',
        title: 'Complete Module 1',
        description: 'Budgeting Basics',
        dueDate: new Date('2024-01-15'),
        completed: true,
        completedDate: new Date('2024-01-14')
      }
    ],
    estimatedROI: 1500
  }}
  onComplete={() => handleComplete()}
  onPause={() => handlePause()}
  theme="light"
/>
```

**Intervention Types:**
- 📚 Education: Financial literacy and skill building
- 🎯 Goals: Goal-setting and achievement tracking
- 🎁 Offers: Personalized offers and deals
- 💬 Counseling: Financial counseling sessions
- ⚠️ Manager Alert: Manager notifications and support

---

## Theming

All components support light and dark themes through the `theme` prop:

```tsx
// Light theme (default)
<RewardsTierCard theme="light" {...props} />

// Dark theme
<RewardsTierCard theme="dark" {...props} />
```

## Styling

Components use React Native StyleSheet for performance and follow these design principles:

- **Spacing:** 4px, 8px, 12px, 16px, 24px, 32px
- **Border Radius:** 6px (small), 8px (medium), 12px (large)
- **Typography:** System fonts with weights: 500 (medium), 600 (semibold), 700 (bold)
- **Colors:** Brand colors with semantic meanings (success, warning, error)

## Accessibility

All components include:
- Proper touch targets (minimum 44x44 points)
- Clear visual hierarchy
- High contrast text
- Semantic labels for screen readers
- Keyboard navigation support

## Performance

Components are optimized for performance:
- Memoized components to prevent unnecessary re-renders
- Efficient list rendering with FlatList
- Lazy loading of images
- Minimal re-renders on prop changes

## Integration

Import components from the library:

```tsx
import {
  RewardsTierCard,
  RecommendationCarousel,
  InterventionTracker,
  type Recommendation,
  type Intervention
} from '@treevü/mobile-components';
```

## Contributing

When adding new components:

1. Create component file in `mobile/components/`
2. Include TypeScript interfaces for props
3. Add JSDoc comments with usage examples
4. Support light/dark themes
5. Include accessibility features
6. Export from `index.ts`
7. Update this documentation

## Component Status

| Component | Status | Version | Last Updated |
|-----------|--------|---------|--------------|
| RewardsTierCard | ✅ Stable | 1.0.0 | 2024-12-12 |
| RecommendationCarousel | ✅ Stable | 1.0.0 | 2024-12-12 |
| InterventionTracker | ✅ Stable | 1.0.0 | 2024-12-12 |

---

**Library Version:** 1.0.0  
**Last Updated:** December 12, 2024  
**Maintained By:** Treevü Engineering Team
