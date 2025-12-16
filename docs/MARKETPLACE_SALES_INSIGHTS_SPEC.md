# Especificación Técnica: Sistema de Insights de Ventas para Marketplace

## 1. ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    TREEVÜ FOR MERCHANTS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRONTEND (Seller Dashboard)                               │
│  ├─ React 19 + Tailwind 4                                  │
│  ├─ Real-time updates (WebSocket)                          │
│  └─ Mobile responsive                                       │
│                                                             │
│  ↓                                                           │
│                                                             │
│  tRPC API LAYER                                             │
│  ├─ marketplace.getBuyerReadiness                           │
│  ├─ marketplace.getSegmentedBuyers                          │
│  ├─ marketplace.getPriceRecommendation                      │
│  ├─ marketplace.getDemandForecast                           │
│  ├─ marketplace.getConversionStrategies                     │
│  └─ marketplace.trackSalesMetrics                           │
│                                                             │
│  ↓                                                           │
│                                                             │
│  BACKEND SERVICES                                           │
│  ├─ Buyer Readiness Calculator                             │
│  ├─ Demand Forecaster                                       │
│  ├─ Price Optimizer                                         │
│  ├─ Conversion Analyzer                                     │
│  └─ Sales Metrics Aggregator                                │
│                                                             │
│  ↓                                                           │
│                                                             │
│  DATA LAYER                                                 │
│  ├─ Merchant data (listings, sales history)                │
│  ├─ Buyer data (FWI, behavior, interactions)               │
│  ├─ Market data (prices, demand, competitors)              │
│  └─ Analytics (conversions, metrics)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. BUYER READINESS SCORE ENGINE

### 2.1 Algoritmo Principal

```typescript
// server/marketplace/buyerReadiness.ts

interface BuyerProfile {
  buyerId: string;
  merchantId: string;
  productId: string;
  
  // Financial Data
  fwiScore: number;           // 0-100
  monthlyIncome: number;      // S/
  totalDebt: number;          // S/
  availableSavings: number;   // S/
  ewaUsageFrequency: number;  // 0-100
  
  // Behavioral Data
  searchFrequency: number;    // searches/week
  contactAttempts: number;    // count
  pageViews: number;          // count
  timeSpentOnListing: number; // seconds
  
  // Historical Data
  categorySpending: number;   // S/
  purchaseFrequency: number;  // purchases/year
  avgPurchaseAmount: number;  // S/
  lastPurchaseDate: Date;     // when
  
  // Life Events
  employmentChange: boolean;
  incomeChange: number;       // % change
  familyStatusChange: boolean;
  relocating: boolean;
  
  // Product Compatibility
  productPrice: number;       // S/
  productCategory: string;
}

interface BuyerReadinessScore {
  overallScore: number;       // 0-100
  riskLevel: 'VERY_READY' | 'READY' | 'POTENTIAL' | 'NOT_READY';
  
  // Component Scores
  financialCapacity: number;  // 0-100
  purchaseIntention: number;  // 0-100
  urgency: number;            // 0-100
  compatibility: number;      // 0-100
  
  // Detailed Breakdown
  details: {
    capacityFactors: string[];
    intentionFactors: string[];
    urgencyFactors: string[];
    compatibilityFactors: string[];
  };
  
  // Predictions
  estimatedClosureDate: Date;
  closureProbability: number; // 0-100
  recommendedActions: string[];
}

export async function calculateBuyerReadiness(
  profile: BuyerProfile
): Promise<BuyerReadinessScore> {
  
  // 1. FINANCIAL CAPACITY (40% weight)
  const financialCapacity = calculateFinancialCapacity(profile);
  
  // 2. PURCHASE INTENTION (30% weight)
  const purchaseIntention = calculatePurchaseIntention(profile);
  
  // 3. URGENCY (20% weight)
  const urgency = calculateUrgency(profile);
  
  // 4. COMPATIBILITY (10% weight)
  const compatibility = calculateCompatibility(profile);
  
  // Calculate overall score
  const overallScore = Math.round(
    (financialCapacity * 0.40) +
    (purchaseIntention * 0.30) +
    (urgency * 0.20) +
    (compatibility * 0.10)
  );
  
  // Determine risk level
  const riskLevel = getRiskLevel(overallScore);
  
  // Generate recommendations
  const recommendedActions = generateRecommendations(
    profile,
    overallScore,
    { financialCapacity, purchaseIntention, urgency, compatibility }
  );
  
  return {
    overallScore,
    riskLevel,
    financialCapacity,
    purchaseIntention,
    urgency,
    compatibility,
    details: {
      capacityFactors: getCapacityFactors(profile),
      intentionFactors: getIntentionFactors(profile),
      urgencyFactors: getUrgencyFactors(profile),
      compatibilityFactors: getCompatibilityFactors(profile),
    },
    estimatedClosureDate: estimateClosureDate(overallScore),
    closureProbability: estimateClosureProbability(overallScore),
    recommendedActions,
  };
}

// ─────────────────────────────────────────────────────────────

function calculateFinancialCapacity(profile: BuyerProfile): number {
  let score = 0;
  const factors: number[] = [];
  
  // Factor 1: FWI Score (0-100)
  // FWI > 70 = Good capacity
  const fwiScore = Math.min(100, (profile.fwiScore / 100) * 100);
  factors.push(fwiScore * 0.40);
  
  // Factor 2: Available Savings vs Product Price
  // Savings > 30% of price = Good
  const savingsRatio = Math.min(100, (profile.availableSavings / profile.productPrice) * 100);
  factors.push(savingsRatio * 0.30);
  
  // Factor 3: Debt Ratio (Debt / Monthly Income)
  // Debt < 40% of monthly income = Good
  const monthlyDebtRatio = (profile.totalDebt / (profile.monthlyIncome * 12)) * 100;
  const debtScore = Math.max(0, 100 - monthlyDebtRatio);
  factors.push(debtScore * 0.20);
  
  // Factor 4: Income to Product Price Ratio
  // Price < 6 months of income = Good
  const incomeRatio = Math.min(100, (profile.monthlyIncome * 6 / profile.productPrice) * 100);
  factors.push(incomeRatio * 0.10);
  
  return Math.round(factors.reduce((a, b) => a + b, 0));
}

function calculatePurchaseIntention(profile: BuyerProfile): number {
  let score = 0;
  const factors: number[] = [];
  
  // Factor 1: Search Frequency
  // 3+ searches/week = High intention
  const searchScore = Math.min(100, (profile.searchFrequency / 3) * 100);
  factors.push(searchScore * 0.30);
  
  // Factor 2: Loan Search Activity
  // Recent loan searches = High intention
  const loanSearchScore = profile.ewaUsageFrequency > 50 ? 100 : profile.ewaUsageFrequency;
  factors.push(loanSearchScore * 0.25);
  
  // Factor 3: Income Change
  // Recent income increase = High intention
  const incomeChangeScore = profile.incomeChange > 0 ? Math.min(100, profile.incomeChange * 10) : 50;
  factors.push(incomeChangeScore * 0.20);
  
  // Factor 4: Life Events
  // Employment change, family status = High intention
  const lifeEventScore = (profile.employmentChange || profile.familyStatusChange || profile.relocating) ? 80 : 40;
  factors.push(lifeEventScore * 0.15);
  
  // Factor 5: Category Spending
  // Regular spending in category = High intention
  const categoryScore = Math.min(100, (profile.categorySpending / profile.monthlyIncome) * 100);
  factors.push(categoryScore * 0.10);
  
  return Math.round(factors.reduce((a, b) => a + b, 0));
}

function calculateUrgency(profile: BuyerProfile): number {
  let score = 0;
  const factors: number[] = [];
  
  // Factor 1: EWA Usage Frequency
  // Frequent use = High urgency
  factors.push(profile.ewaUsageFrequency * 0.35);
  
  // Factor 2: Recent Employment Change
  // New job = High urgency
  const employmentScore = profile.employmentChange ? 90 : 40;
  factors.push(employmentScore * 0.30);
  
  // Factor 3: Time Since Last Purchase
  // Overdue for replacement = High urgency
  const daysSinceLastPurchase = Math.floor(
    (new Date().getTime() - profile.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const replacementCycle = getReplacementCycle(profile.productCategory);
  const urgencyScore = Math.min(100, (daysSinceLastPurchase / replacementCycle) * 100);
  factors.push(urgencyScore * 0.20);
  
  // Factor 4: Contact Attempts
  // Multiple contacts = High urgency
  const contactScore = Math.min(100, (profile.contactAttempts / 3) * 100);
  factors.push(contactScore * 0.15);
  
  return Math.round(factors.reduce((a, b) => a + b, 0));
}

function calculateCompatibility(profile: BuyerProfile): number {
  let score = 0;
  const factors: number[] = [];
  
  // Factor 1: Category Spending History
  // Regular spending in category = High compatibility
  const categoryScore = profile.categorySpending > 0 ? 90 : 30;
  factors.push(categoryScore * 0.50);
  
  // Factor 2: Price Range Compatibility
  // Product price within buyer's range = High compatibility
  const priceRangeScore = isPriceInRange(
    profile.productPrice,
    profile.avgPurchaseAmount
  ) ? 90 : 40;
  factors.push(priceRangeScore * 0.30);
  
  // Factor 3: Purchase Frequency
  // Regular buyer = High compatibility
  const frequencyScore = Math.min(100, (profile.purchaseFrequency / 4) * 100);
  factors.push(frequencyScore * 0.20);
  
  return Math.round(factors.reduce((a, b) => a + b, 0));
}

function getRiskLevel(score: number): 'VERY_READY' | 'READY' | 'POTENTIAL' | 'NOT_READY' {
  if (score >= 81) return 'VERY_READY';
  if (score >= 61) return 'READY';
  if (score >= 31) return 'POTENTIAL';
  return 'NOT_READY';
}

function estimateClosureProbability(score: number): number {
  // Empirical mapping based on historical data
  const mapping: Record<string, number> = {
    'VERY_READY': 75,
    'READY': 45,
    'POTENTIAL': 20,
    'NOT_READY': 5,
  };
  const level = getRiskLevel(score);
  return mapping[level];
}

function estimateClosureDate(score: number): Date {
  // Empirical mapping based on historical data
  const mapping: Record<string, number> = {
    'VERY_READY': 7,    // days
    'READY': 21,
    'POTENTIAL': 45,
    'NOT_READY': 90,
  };
  const level = getRiskLevel(score);
  const daysToAdd = mapping[level];
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

function generateRecommendations(
  profile: BuyerProfile,
  score: number,
  components: any
): string[] {
  const recommendations: string[] = [];
  const level = getRiskLevel(score);
  
  if (level === 'VERY_READY') {
    recommendations.push('Contact today - buyer is ready to purchase');
    recommendations.push('Offer flexible financing options');
    recommendations.push('Create urgency - mention other interested buyers');
    recommendations.push('Provide clear payment options');
  } else if (level === 'READY') {
    recommendations.push('Contact this week - buyer has capacity');
    recommendations.push('Educate about financing options');
    recommendations.push('Address common objections');
    recommendations.push('Offer multiple payment plans');
  } else if (level === 'POTENTIAL') {
    recommendations.push('Nurture relationship - weekly follow-up');
    recommendations.push('Provide financing calculator');
    recommendations.push('Share success stories from similar buyers');
    recommendations.push('Offer extended payment terms');
  } else {
    recommendations.push('Do not contact - save time and resources');
    recommendations.push('Save for future retargeting');
    recommendations.push('Monitor for FWI improvement');
  }
  
  return recommendations;
}
```

### 2.2 Data Models

```sql
-- drizzle/schema.ts

export const merchantListings = sqliteTable('merchant_listings', {
  id: int('id').primaryKey().autoincrement(),
  merchantId: int('merchant_id').notNull(),
  
  // Product Info
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // auto, property, equipment, etc
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  
  // Status
  status: text('status').notNull(), // active, sold, inactive
  listedAt: timestamp('listed_at').defaultNow(),
  soldAt: timestamp('sold_at'),
  
  // Metrics
  views: int('views').defaultValue(0),
  contacts: int('contacts').defaultValue(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const buyerInteractions = sqliteTable('buyer_interactions', {
  id: int('id').primaryKey().autoincrement(),
  buyerId: int('buyer_id').notNull(),
  listingId: int('listing_id').notNull(),
  merchantId: int('merchant_id').notNull(),
  
  // Interaction Type
  type: text('type').notNull(), // view, contact, message, offer
  
  // Timing
  interactedAt: timestamp('interacted_at').defaultNow(),
  
  // Details
  details: text('details'), // JSON
  
  createdAt: timestamp('created_at').defaultNow(),
});

export const buyerReadinessScores = sqliteTable('buyer_readiness_scores', {
  id: int('id').primaryKey().autoincrement(),
  buyerId: int('buyer_id').notNull(),
  listingId: int('listing_id').notNull(),
  merchantId: int('merchant_id').notNull(),
  
  // Scores
  overallScore: int('overall_score').notNull(),
  financialCapacity: int('financial_capacity').notNull(),
  purchaseIntention: int('purchase_intention').notNull(),
  urgency: int('urgency').notNull(),
  compatibility: int('compatibility').notNull(),
  
  // Predictions
  riskLevel: text('risk_level').notNull(), // VERY_READY, READY, POTENTIAL, NOT_READY
  estimatedClosureDate: timestamp('estimated_closure_date'),
  closureProbability: int('closure_probability'),
  
  // Recommendations
  recommendedActions: text('recommended_actions'), // JSON array
  
  // Metadata
  calculatedAt: timestamp('calculated_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const merchantSalesMetrics = sqliteTable('merchant_sales_metrics', {
  id: int('id').primaryKey().autoincrement(),
  merchantId: int('merchant_id').notNull(),
  
  // Period
  period: text('period').notNull(), // daily, weekly, monthly
  date: timestamp('date').notNull(),
  
  // Metrics
  totalListings: int('total_listings'),
  activeListings: int('active_listings'),
  totalViews: int('total_views'),
  totalContacts: int('total_contacts'),
  totalSales: int('total_sales'),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }),
  avgConversionRate: decimal('avg_conversion_rate', { precision: 5, scale: 2 }),
  avgSalesCycle: int('avg_sales_cycle'), // days
  
  // Buyer Segmentation
  veryReadyBuyers: int('very_ready_buyers'),
  readyBuyers: int('ready_buyers'),
  potentialBuyers: int('potential_buyers'),
  notReadyBuyers: int('not_ready_buyers'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## 3. tRPC PROCEDURES

```typescript
// server/routers/marketplace.ts

export const marketplaceRouter = router({
  // Get buyer readiness for a specific listing
  getBuyerReadiness: protectedProcedure
    .input(z.object({
      buyerId: z.string(),
      listingId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const buyer = await db.getBuyerProfile(input.buyerId);
      const listing = await db.getListing(input.listingId);
      
      const profile: BuyerProfile = {
        buyerId: input.buyerId,
        merchantId: ctx.user.id,
        productId: input.listingId,
        fwiScore: buyer.fwiScore,
        monthlyIncome: buyer.monthlyIncome,
        totalDebt: buyer.totalDebt,
        availableSavings: buyer.availableSavings,
        ewaUsageFrequency: buyer.ewaUsageFrequency,
        searchFrequency: await db.getSearchFrequency(input.buyerId),
        contactAttempts: await db.getContactAttempts(input.buyerId, input.listingId),
        pageViews: await db.getPageViews(input.buyerId, input.listingId),
        timeSpentOnListing: await db.getTimeSpent(input.buyerId, input.listingId),
        categorySpending: await db.getCategorySpending(input.buyerId, listing.category),
        purchaseFrequency: buyer.purchaseFrequency,
        avgPurchaseAmount: buyer.avgPurchaseAmount,
        lastPurchaseDate: buyer.lastPurchaseDate,
        employmentChange: buyer.employmentChange,
        incomeChange: buyer.incomeChange,
        familyStatusChange: buyer.familyStatusChange,
        relocating: buyer.relocating,
        productPrice: listing.price,
        productCategory: listing.category,
      };
      
      const readiness = await calculateBuyerReadiness(profile);
      
      // Save to database
      await db.saveBuyerReadinessScore(readiness);
      
      return readiness;
    }),
  
  // Get segmented buyers for a merchant
  getSegmentedBuyers: protectedProcedure
    .query(async ({ ctx }) => {
      const buyers = await db.getBuyersForMerchant(ctx.user.id);
      
      const segmented = {
        veryReady: [],
        ready: [],
        potential: [],
        notReady: [],
      };
      
      for (const buyer of buyers) {
        const readiness = await calculateBuyerReadiness(buyer);
        
        switch (readiness.riskLevel) {
          case 'VERY_READY':
            segmented.veryReady.push(readiness);
            break;
          case 'READY':
            segmented.ready.push(readiness);
            break;
          case 'POTENTIAL':
            segmented.potential.push(readiness);
            break;
          case 'NOT_READY':
            segmented.notReady.push(readiness);
            break;
        }
      }
      
      return {
        summary: {
          total: buyers.length,
          veryReady: segmented.veryReady.length,
          ready: segmented.ready.length,
          potential: segmented.potential.length,
          notReady: segmented.notReady.length,
        },
        buyers: segmented,
      };
    }),
  
  // Get sales metrics for a merchant
  getSalesMetrics: protectedProcedure
    .input(z.object({
      period: z.enum(['daily', 'weekly', 'monthly']),
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      const metrics = await db.getMerchantMetrics(
        ctx.user.id,
        input.period,
        input.days
      );
      
      return {
        summary: {
          totalListings: metrics.totalListings,
          activeListings: metrics.activeListings,
          totalViews: metrics.totalViews,
          totalContacts: metrics.totalContacts,
          totalSales: metrics.totalSales,
          totalRevenue: metrics.totalRevenue,
          avgConversionRate: metrics.avgConversionRate,
          avgSalesCycle: metrics.avgSalesCycle,
        },
        segmentation: {
          veryReady: metrics.veryReadyBuyers,
          ready: metrics.readyBuyers,
          potential: metrics.potentialBuyers,
          notReady: metrics.notReadyBuyers,
        },
        trend: await calculateTrend(metrics),
      };
    }),
});
```

---

## 4. FRONTEND INTEGRATION

```typescript
// client/src/pages/MerchantDashboard.tsx

import { trpc } from '@/lib/trpc';
import { SegmentedBuyersChart } from '@/components/marketplace/SegmentedBuyersChart';
import { BuyerList } from '@/components/marketplace/BuyerList';
import { SalesMetrics } from '@/components/marketplace/SalesMetrics';

export function MerchantDashboard() {
  const { data: segmented } = trpc.marketplace.getSegmentedBuyers.useQuery();
  const { data: metrics } = trpc.marketplace.getSalesMetrics.useQuery({
    period: 'monthly',
    days: 30,
  });
  
  return (
    <div className="space-y-6">
      {/* Sales Overview */}
      <SalesMetrics metrics={metrics} />
      
      {/* Buyer Segmentation */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded">
          <div className="text-sm font-semibold text-red-900">Very Ready</div>
          <div className="text-2xl font-bold text-red-600">{segmented?.summary.veryReady}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <div className="text-sm font-semibold text-yellow-900">Ready</div>
          <div className="text-2xl font-bold text-yellow-600">{segmented?.summary.ready}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm font-semibold text-blue-900">Potential</div>
          <div className="text-2xl font-bold text-blue-600">{segmented?.summary.potential}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-sm font-semibold text-gray-900">Not Ready</div>
          <div className="text-2xl font-bold text-gray-600">{segmented?.summary.notReady}</div>
        </div>
      </div>
      
      {/* Segmented Buyers Chart */}
      <SegmentedBuyersChart data={segmented} />
      
      {/* Buyer Lists by Segment */}
      <BuyerList segment="veryReady" buyers={segmented?.buyers.veryReady} />
      <BuyerList segment="ready" buyers={segmented?.buyers.ready} />
      <BuyerList segment="potential" buyers={segmented?.buyers.potential} />
    </div>
  );
}
```

---

## 5. CRON JOBS

```typescript
// server/cronJobs/updateBuyerReadiness.ts

export async function updateBuyerReadinessScores() {
  const merchants = await db.getAllMerchants();
  
  for (const merchant of merchants) {
    const buyers = await db.getBuyersForMerchant(merchant.id);
    
    for (const buyer of buyers) {
      const readiness = await calculateBuyerReadiness(buyer);
      await db.saveBuyerReadinessScore(readiness);
    }
  }
  
  console.log(`Updated readiness scores for ${merchants.length} merchants`);
}

// Schedule: Every 6 hours
schedule.scheduleJob('0 */6 * * *', updateBuyerReadinessScores);
```

---

## 6. PERFORMANCE CONSIDERATIONS

```
OPTIMIZATION STRATEGIES:

1. CACHING
   ├─ Cache buyer profiles (TTL: 1 hour)
   ├─ Cache readiness scores (TTL: 6 hours)
   └─ Cache metrics (TTL: 1 hour)

2. BATCH PROCESSING
   ├─ Calculate scores in batches (100 at a time)
   ├─ Use background jobs for large calculations
   └─ Async updates for non-critical data

3. DATABASE INDEXING
   ├─ Index on (buyerId, listingId)
   ├─ Index on (merchantId, date)
   ├─ Index on riskLevel for segmentation
   └─ Index on calculatedAt for time-based queries

4. QUERY OPTIMIZATION
   ├─ Use SELECT only needed columns
   ├─ Limit results with pagination
   ├─ Use aggregations for metrics
   └─ Denormalize frequently accessed data

EXPECTED PERFORMANCE:
├─ Single buyer readiness: <500ms
├─ Segmented buyers (100): <2s
├─ Sales metrics: <1s
└─ Dashboard load: <3s
```

---

Este documento proporciona la especificación técnica completa para implementar el sistema de insights de ventas.
