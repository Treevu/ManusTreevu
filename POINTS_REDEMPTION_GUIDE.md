# Points Redemption Feature - User & Developer Guide

## Overview

The Points Redemption feature allows employees to redeem their accumulated TreePoints for valuable rewards including gift cards, subscriptions, educational content, and experiences. This guide covers both user functionality and technical implementation details.

---

## User Features

### Viewing Available Offers

The redemption interface displays all available offers in a responsive grid layout with the following information for each offer:

**Offer Details:**
- Offer name and description
- Category badge (Gift, Service, Education, Experience, Discount)
- Points cost required
- Availability status and quantity remaining
- Expiration date (if applicable)

**Offer Categories:**

| Category | Examples | Typical Points Cost |
|----------|----------|-------------------|
| **Gift** | Amazon Gift Cards, Starbucks Cards | 250-500 |
| **Service** | Netflix, Spotify, Streaming subscriptions | 750-1200 |
| **Education** | Financial courses, skill development | 1000-1500 |
| **Experience** | Wellness packages, entertainment | 800-1200 |
| **Discount** | Exclusive discounts on products | 300-600 |

### Current Available Offers

1. **Amazon Gift Card $10** - 500 points
2. **Starbucks Card $5** - 250 points
3. **Netflix 1 Month** - 750 points
4. **Financial Course** - 1000 points
5. **Spotify 3 Months** - 1200 points
6. **Wellness Package** - 800 points

### Redeeming Points

**Step-by-step redemption process:**

1. Navigate to the Employee Dashboard
2. Click on the "TreePoints" tab
3. Scroll to "Ofertas Disponibles" section
4. Find the desired offer and click "Canjear" button
5. Review the confirmation dialog showing:
   - Offer name and details
   - Points to be used
   - Remaining points after redemption
   - Delivery timeline (24-48 hours)
6. Click "Confirmar Canje" to complete the transaction
7. Receive confirmation message and email notification

**Important notes:**
- Redemptions are final and cannot be reversed
- Rewards are delivered within 24-48 hours via email
- You must have sufficient points to redeem
- Offers may have limited quantity available

### Tracking Redemption History

The "Historial de Canjes" section displays all past redemptions with:
- Reward name
- Redemption date
- Current status (En proceso, Entregado)
- Delivery confirmation

**Status meanings:**
- **En proceso**: Reward is being prepared for delivery
- **Entregado**: Reward has been delivered to your email

### Earning More Points

The dashboard provides tips for earning additional TreePoints:

| Activity | Points Earned |
|----------|---------------|
| Register daily expenses | +10 pts |
| Maintain 7-day streak | +50 pts |
| Achieve savings goal | +100 pts |
| Improve FWI Score | +25 pts |
| Earn badges | +100-500 pts |

---

## Technical Implementation

### Component Structure

**File:** `client/src/components/PointsRedemption.tsx`

**Props:**
```typescript
interface PointsRedemptionProps {
  currentPoints: number;        // User's available points balance
  onRedemptionSuccess?: () => void;  // Callback after successful redemption
}
```

**Sub-components:**
- Points Balance Display
- Redemption Offers Grid
- Confirmation Dialog
- Redemption History
- Tips Section

### Offer Data Structure

```typescript
interface RedemptionOffer {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: 'gift' | 'discount' | 'service' | 'education' | 'experience';
  icon: React.ReactNode;
  image?: string;
  available: boolean;
  quantity?: number;
  expiresAt?: string;
}
```

### API Integration

**tRPC Procedures Required:**

1. **Get Available Offers**
   ```typescript
   trpc.treePoints.getOffers.useQuery()
   // Returns: RedemptionOffer[]
   ```

2. **Redeem Points**
   ```typescript
   trpc.treePoints.redeem.useMutation({
     offerId: number;
     pointsAmount: number;
   })
   // Returns: { success: boolean; message: string; }
   ```

3. **Get Redemption History**
   ```typescript
   trpc.treePoints.getRedemptionHistory.useQuery()
   // Returns: { id, offerId, pointsUsed, status, createdAt }[]
   ```

### Integration with Employee Dashboard

The component is integrated into the EmployeeDashboard's TreePoints tab:

```typescript
// In EmployeeDashboard.tsx
<TabsContent value="points" className="space-y-4">
  <PointsRedemption 
    currentPoints={displayTreePoints}
    onRedemptionSuccess={() => {
      // Refresh points balance
      refetchTreePoints();
    }}
  />
  {/* Other TreePoints content */}
</TabsContent>
```

### State Management

The component uses React hooks for state management:

```typescript
const [selectedOffer, setSelectedOffer] = useState<RedemptionOffer | null>(null);
const [isConfirming, setIsConfirming] = useState(false);

const redeemMutation = trpc.treePoints.redeem.useMutation({
  onSuccess: () => {
    toast.success('¡Canje exitoso!');
    setSelectedOffer(null);
    onRedemptionSuccess?.();
  },
  onError: (error) => {
    toast.error('Error al canjear puntos');
  },
});
```

### UI Components Used

- **Card** - Display offer and history cards
- **Button** - Redeem and action buttons
- **Badge** - Category and status badges
- **Dialog** - Confirmation dialog
- **Progress** - Visual indicators (if needed)
- **Icons** - Category and action icons from lucide-react

### Styling

The component uses Tailwind CSS with the following design system:

**Colors:**
- Primary: `brand-primary` (teal/green)
- Secondary: `brand-secondary`
- Background: `treevu-surface`
- Accents: Category-specific colors (pink, blue, purple, orange)

**Responsive Design:**
- Mobile: Single column grid
- Tablet: 2-column grid
- Desktop: 3-column grid

---

## Database Schema

**Required tables:**

1. **redemption_offers**
   ```sql
   - id (PK)
   - name (VARCHAR)
   - description (TEXT)
   - points_cost (INT)
   - category (ENUM)
   - available (BOOLEAN)
   - quantity (INT)
   - expires_at (DATETIME)
   - created_at (DATETIME)
   - updated_at (DATETIME)
   ```

2. **user_redemptions**
   ```sql
   - id (PK)
   - user_id (FK)
   - offer_id (FK)
   - points_used (INT)
   - status (ENUM: pending, delivered, cancelled)
   - created_at (DATETIME)
   - updated_at (DATETIME)
   ```

---

## Backend Implementation

### tRPC Router Procedures

```typescript
// server/routers.ts
export const appRouter = router({
  treePoints: router({
    // Get available offers
    getOffers: publicProcedure
      .query(async ({ ctx }) => {
        return await db.query.redemptionOffers
          .findMany({
            where: eq(redemptionOffers.available, true),
          });
      }),

    // Redeem points
    redeem: protectedProcedure
      .input(z.object({
        offerId: z.number(),
        pointsAmount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = ctx.user;
        
        // Verify user has enough points
        const balance = await getUserPointsBalance(user.id);
        if (balance < input.pointsAmount) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Insufficient points',
          });
        }

        // Create redemption record
        const redemption = await db.insert(userRedemptions).values({
          userId: user.id,
          offerId: input.offerId,
          pointsUsed: input.pointsAmount,
          status: 'pending',
        });

        // Deduct points
        await deductUserPoints(user.id, input.pointsAmount);

        // Send confirmation email
        await sendRedemptionEmail(user.email, redemption);

        return { success: true, message: 'Redemption successful' };
      }),

    // Get redemption history
    getRedemptionHistory: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.query.userRedemptions
          .findMany({
            where: eq(userRedemptions.userId, ctx.user.id),
            orderBy: desc(userRedemptions.createdAt),
          });
      }),
  }),
});
```

### Email Notification

When a redemption is successful, send a confirmation email:

```typescript
async function sendRedemptionEmail(email: string, redemption: any) {
  await resend.emails.send({
    from: 'rewards@treevü.com',
    to: email,
    subject: '¡Tu canje de TreePoints fue exitoso!',
    html: `
      <h2>Canje Confirmado</h2>
      <p>Tu premio será entregado en 24-48 horas.</p>
      <p>Detalles:</p>
      <ul>
        <li>Puntos usados: ${redemption.pointsUsed}</li>
        <li>Fecha: ${redemption.createdAt}</li>
      </ul>
    `,
  });
}
```

---

## Error Handling

**Common error scenarios:**

| Error | Message | Solution |
|-------|---------|----------|
| Insufficient points | "No tienes suficientes puntos" | Earn more points |
| Offer unavailable | "Esta oferta no está disponible" | Choose different offer |
| Quantity exhausted | "Esta oferta se agotó" | Wait for restock |
| Network error | "Error al canjear puntos" | Retry later |

---

## Best Practices

### For Users

1. **Plan redemptions** - Save points for high-value offers
2. **Check expiration** - Some offers may expire
3. **Verify email** - Ensure email is current for delivery
4. **Track history** - Monitor redemption status in history
5. **Earn consistently** - Daily activities help accumulate points

### For Developers

1. **Validate points** - Always verify sufficient balance before redemption
2. **Atomic transactions** - Use database transactions for points deduction
3. **Audit trail** - Log all redemption activities
4. **Rate limiting** - Prevent abuse with rate limits
5. **Email confirmation** - Always send confirmation emails
6. **Offer management** - Regularly update available offers
7. **Error handling** - Provide clear error messages

---

## Testing

### Unit Tests

```typescript
describe('PointsRedemption', () => {
  it('should display available offers', () => {
    // Test offer rendering
  });

  it('should disable redeem button when insufficient points', () => {
    // Test button state
  });

  it('should show confirmation dialog on redeem click', () => {
    // Test dialog display
  });

  it('should call mutation on confirm', () => {
    // Test mutation call
  });
});
```

### Integration Tests

```typescript
describe('Points Redemption Flow', () => {
  it('should successfully redeem points', async () => {
    // Test full redemption flow
  });

  it('should update points balance after redemption', async () => {
    // Test balance update
  });

  it('should send confirmation email', async () => {
    // Test email sending
  });
});
```

---

## Future Enhancements

1. **Tiered Offers** - Premium offers for high-tier members
2. **Seasonal Promotions** - Limited-time special offers
3. **Referral Bonuses** - Extra points for referrals
4. **Charity Donations** - Redeem points for charitable causes
5. **Custom Rewards** - Partner with local businesses
6. **Points Marketplace** - User-to-user point trading
7. **Gamification** - Unlock special offers through achievements

---

## Support & Troubleshooting

**User Support:**
- Email: support@treevü.com
- FAQ: https://help.treevü.com/points-redemption
- Live chat: Available in dashboard

**Developer Support:**
- API Documentation: `/docs/api`
- GitHub Issues: Issues tracker
- Slack: #treevü-dev channel

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial release with 6 offers |

---

**Last Updated**: December 2024
**Component Version**: 1.0
