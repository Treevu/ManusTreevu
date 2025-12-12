/**
 * Seed Demo Data for Treevü Demo Day
 * Run with: npx tsx scripts/seed-demo.ts
 */

import { getDb } from '../server/db';
import { 
  users, departments, transactions, marketOffers, ewaRequests, 
  financialGoals, badges, userBadges, weeklyChallenges, activeChallenges 
} from '../drizzle/schema';
import { sql, eq } from 'drizzle-orm';

// Demo data configuration
const DEMO_COMPANY = {
  name: 'TechCorp México',
  departments: [
    { name: 'Ingeniería', employeeCount: 25, avgFwi: 72 },
    { name: 'Ventas', employeeCount: 15, avgFwi: 58 },
    { name: 'Marketing', employeeCount: 10, avgFwi: 65 },
    { name: 'Operaciones', employeeCount: 20, avgFwi: 55 },
    { name: 'Recursos Humanos', employeeCount: 8, avgFwi: 78 },
  ],
};

const FIRST_NAMES = [
  'Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía',
  'Diego', 'Valentina', 'Andrés', 'Camila', 'José', 'Isabella', 'Luis',
  'Daniela', 'Fernando', 'Gabriela', 'Ricardo', 'Paula', 'Roberto', 'Mariana',
  'Eduardo', 'Natalia', 'Alejandro', 'Carolina', 'Francisco', 'Andrea', 'Jorge', 'Lucía'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez',
  'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes',
  'Cruz', 'Morales', 'Ortiz', 'Gutiérrez', 'Chávez'
];

// Categories must match schema enum: food, transport, entertainment, services, health, shopping, other
const EXPENSE_CATEGORIES = [
  { name: 'food', descriptions: ['Almuerzo', 'Cena', 'Desayuno', 'Café', 'Snacks'] },
  { name: 'transport', descriptions: ['Uber', 'Gasolina', 'Metro', 'Estacionamiento', 'Taxi'] },
  { name: 'entertainment', descriptions: ['Netflix', 'Spotify', 'Cine', 'Concierto', 'Videojuegos'] },
  { name: 'shopping', descriptions: ['Ropa', 'Amazon', 'Mercado Libre', 'Electrónicos', 'Hogar'] },
  { name: 'services', descriptions: ['Luz', 'Agua', 'Gas', 'Internet', 'Teléfono'] },
  { name: 'health', descriptions: ['Farmacia', 'Doctor', 'Gimnasio', 'Dentista', 'Vitaminas'] },
];

const MERCHANT_OFFERS = [
  { title: 'Descuento 20% en Starbucks', merchant: 'Starbucks México', cost: 150, discount: '20%', category: 'lifestyle' as const },
  { title: 'Cashback 15% en Uber', merchant: 'Uber México', cost: 200, discount: '15%', category: 'lifestyle' as const },
  { title: '2x1 en Cinépolis', merchant: 'Cinépolis', cost: 100, discount: '2x1', category: 'lifestyle' as const },
  { title: 'Descuento 30% en Farmacia del Ahorro', merchant: 'Farmacia del Ahorro', cost: 250, discount: '30%', category: 'emergency' as const },
  { title: 'Tasa preferencial CETES', merchant: 'GBM+', cost: 500, discount: '0.5% extra', category: 'investment' as const },
  { title: '10% en Liverpool', merchant: 'Liverpool', cost: 300, discount: '10%', category: 'lifestyle' as const },
  { title: 'Mes gratis de Spotify', merchant: 'Spotify', cost: 120, discount: '1 mes', category: 'lifestyle' as const },
  { title: 'Descuento 25% en Rappi', merchant: 'Rappi', cost: 180, discount: '25%', category: 'lifestyle' as const },
  { title: 'Consulta médica gratis', merchant: 'Doctoralia', cost: 400, discount: '100%', category: 'emergency' as const },
  { title: 'Inversión sin comisión', merchant: 'Fintual', cost: 350, discount: 'Sin comisión', category: 'investment' as const },
];

const WEEKLY_CHALLENGES_DATA = [
  { code: 'track_expenses_7', title: 'Registra 7 gastos esta semana', icon: 'Receipt', color: 'blue', category: 'spending' as const, target: 7, unit: 'gastos', points: 100, difficulty: 'easy' as const },
  { code: 'no_ant_expenses', title: 'Cero gastos hormiga por 5 días', icon: 'Bug', color: 'red', category: 'spending' as const, target: 5, unit: 'días', points: 150, difficulty: 'medium' as const },
  { code: 'complete_tutorial', title: 'Completa un tutorial educativo', icon: 'GraduationCap', color: 'purple', category: 'education' as const, target: 1, unit: 'tutorial', points: 75, difficulty: 'easy' as const },
  { code: 'login_streak_5', title: 'Inicia sesión 5 días seguidos', icon: 'Flame', color: 'orange', category: 'engagement' as const, target: 5, unit: 'días', points: 100, difficulty: 'easy' as const },
  { code: 'refer_friend', title: 'Invita a un compañero', icon: 'UserPlus', color: 'green', category: 'social' as const, target: 1, unit: 'referido', points: 200, difficulty: 'medium' as const },
  { code: 'improve_fwi_5', title: 'Mejora tu FWI en 5 puntos', icon: 'TrendingUp', color: 'emerald', category: 'fwi' as const, target: 5, unit: 'puntos', points: 250, difficulty: 'hard' as const },
  { code: 'save_goal', title: 'Crea una meta de ahorro', icon: 'Target', color: 'teal', category: 'savings' as const, target: 1, unit: 'meta', points: 100, difficulty: 'easy' as const },
  { code: 'redeem_offer', title: 'Canjea una oferta del marketplace', icon: 'Gift', color: 'pink', category: 'engagement' as const, target: 1, unit: 'oferta', points: 75, difficulty: 'easy' as const },
];

const BADGES_DATA = [
  { code: 'streak_7', name: 'Racha de 7 días', desc: 'Mantén actividad por 7 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement' as const, points: 100, rarity: 'common' as const },
  { code: 'streak_30', name: 'Racha de 30 días', desc: 'Mantén actividad por 30 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement' as const, points: 300, rarity: 'rare' as const },
  { code: 'streak_90', name: 'Racha de 90 días', desc: 'Mantén actividad por 90 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement' as const, points: 500, rarity: 'legendary' as const },
  { code: 'fwi_master', name: 'Maestro FWI', desc: 'Alcanza un FWI de 80+', icon: 'TrendingUp', color: 'emerald', category: 'financial' as const, points: 200, rarity: 'rare' as const },
  { code: 'ewa_first', name: 'Primer EWA', desc: 'Solicita tu primer adelanto', icon: 'Wallet', color: 'blue', category: 'financial' as const, points: 50, rarity: 'common' as const },
  { code: 'education_complete', name: 'Estudiante Estrella', desc: 'Completa todos los tutoriales', icon: 'GraduationCap', color: 'purple', category: 'education' as const, points: 250, rarity: 'epic' as const },
  { code: 'referral_5', name: 'Embajador', desc: 'Refiere a 5 compañeros', icon: 'Users', color: 'green', category: 'social' as const, points: 300, rarity: 'rare' as const },
  { code: 'challenge_10', name: 'Retador', desc: 'Completa 10 desafíos semanales', icon: 'Trophy', color: 'yellow', category: 'engagement' as const, points: 400, rarity: 'epic' as const },
];

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  date.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0);
  return date;
}

function generateEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techcorp.mx`;
}

function generateFwiScore(deptAvg: number): number {
  const variance = randomInt(-15, 15);
  return Math.max(20, Math.min(95, deptAvg + variance));
}

async function seedDemoData() {
  const db = await getDb();
  if (!db) {
    console.error('❌ Could not connect to database');
    return;
  }

  console.log('🌱 Starting Demo Day seed...\n');

  try {
    // 1. Create Departments
    console.log('📁 Creating departments...');
    const departmentIds: { id: number; name: string; avgFwi: number; employeeCount: number }[] = [];
    
    for (const dept of DEMO_COMPANY.departments) {
      // Check if department exists
      const existing = await db.select().from(departments).where(eq(departments.name, dept.name));
      
      if (existing.length > 0) {
        await db.update(departments)
          .set({ employeeCount: dept.employeeCount, avgFwiScore: dept.avgFwi })
          .where(eq(departments.name, dept.name));
        departmentIds.push({ id: existing[0].id, ...dept });
      } else {
        const result = await db.insert(departments).values({
          name: dept.name,
          employeeCount: dept.employeeCount,
          avgFwiScore: dept.avgFwi,
        });
        departmentIds.push({ id: Number(result[0].insertId), ...dept });
      }
      console.log(`  ✓ ${dept.name} (${dept.employeeCount} empleados, FWI avg: ${dept.avgFwi})`);
    }

    // 2. Create Demo Employees
    console.log('\n👥 Creating demo employees...');
    const employeeIds: number[] = [];
    let employeeIndex = 0;
    
    for (const dept of departmentIds) {
      for (let i = 0; i < Math.min(dept.employeeCount, 10) && employeeIndex < 50; i++) {
        const firstName = randomElement(FIRST_NAMES);
        const lastName = randomElement(LAST_NAMES);
        const fwiScore = generateFwiScore(dept.avgFwi);
        const treePoints = randomInt(100, 2500);
        const level = Math.floor(treePoints / 500) + 1;
        const streakDays = randomInt(0, 30);
        const monthlyIncome = randomInt(15000, 80000);
        const openId = `demo_employee_${Date.now()}_${employeeIndex}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
          const result = await db.insert(users).values({
            openId,
            name: `${firstName} ${lastName}`,
            email: generateEmail(firstName, lastName),
            role: 'employee',
            departmentId: dept.id,
            monthlyIncome,
            fwiScore,
            treePoints,
            streakDays,
            level,
            status: 'active',
          });
          employeeIds.push(Number(result[0].insertId));
          employeeIndex++;
        } catch (e) {
          // Skip if duplicate
        }
      }
    }
    console.log(`  ✓ Created ${employeeIds.length} demo employees`);

    // 3. Create Transactions for each employee
    console.log('\n💳 Creating transaction history...');
    let totalTransactions = 0;
    
    for (const userId of employeeIds) {
      const numTransactions = randomInt(5, 15);
      
      for (let i = 0; i < numTransactions; i++) {
        const category = randomElement(EXPENSE_CATEGORIES);
        const description = randomElement(category.descriptions);
        const amount = randomInt(50, 2000);
        
        await db.insert(transactions).values({
          userId,
          merchant: description,
          amount: amount * 100, // Convert to cents
          category: category.name as any,
          description,
        });
        totalTransactions++;
      }
    }
    console.log(`  ✓ Created ${totalTransactions} transactions`);

    // 4. Create Merchant Offers
    console.log('\n🎁 Creating merchant offers...');
    
    for (const offer of MERCHANT_OFFERS) {
      const merchantOpenId = `merchant_${offer.merchant.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 5)}`;
      
      // Create merchant user
      let merchantId: number;
      try {
        const result = await db.insert(users).values({
          openId: merchantOpenId,
          name: offer.merchant,
          role: 'merchant',
          status: 'active',
        });
        merchantId = Number(result[0].insertId);
      } catch (e) {
        // Use existing merchant
        const existing = await db.select().from(users).where(sql`${users.name} = ${offer.merchant} AND ${users.role} = 'merchant'`);
        if (existing.length > 0) {
          merchantId = existing[0].id;
        } else {
          continue;
        }
      }
      
      await db.insert(marketOffers).values({
        merchantId,
        title: offer.title,
        description: `Oferta exclusiva de ${offer.merchant}`,
        costPoints: offer.cost,
        discountValue: offer.discount,
        category: offer.category,
        isActive: true,
      });
      console.log(`  ✓ ${offer.title}`);
    }

    // 5. Create EWA Requests
    console.log('\n💰 Creating EWA request history...');
    const ewaStatuses = ['pending_approval', 'processing_transfer', 'disbursed', 'rejected'] as const;
    let ewaCount = 0;
    
    for (const userId of employeeIds.slice(0, 15)) {
      const numRequests = randomInt(1, 2);
      
      for (let i = 0; i < numRequests; i++) {
        const amount = randomInt(100000, 500000); // In cents (1000-5000 MXN)
        const fee = Math.floor(amount * 0.03); // 3% fee
        const status = randomElement([...ewaStatuses]);
        const monthlyIncome = randomInt(1500000, 8000000); // 15k-80k MXN in cents
        const daysWorked = randomInt(5, 25);
        const fwiScore = randomInt(40, 85);
        
        await db.insert(ewaRequests).values({
          userId,
          amount,
          fee,
          status,
          daysWorked,
          monthlyIncome,
          fwiScoreAtRequest: fwiScore,
        });
        ewaCount++;
      }
    }
    console.log(`  ✓ Created ${ewaCount} EWA requests`);

    // 6. Create Weekly Challenges
    console.log('\n🏆 Creating weekly challenges...');
    
    for (const challenge of WEEKLY_CHALLENGES_DATA) {
      try {
        await db.insert(weeklyChallenges).values({
          code: challenge.code,
          title: challenge.title,
          description: `Completa este desafío para ganar ${challenge.points} TreePoints`,
          icon: challenge.icon,
          color: challenge.color,
          category: challenge.category,
          targetValue: challenge.target,
          targetUnit: challenge.unit,
          pointsReward: challenge.points,
          difficulty: challenge.difficulty,
          isActive: true,
        });
        console.log(`  ✓ ${challenge.title}`);
      } catch (e) {
        // Skip if exists
      }
    }

    // 7. Create Active Challenge for this week
    console.log('\n📅 Creating active challenges for this week...');
    const now = new Date();
    const weekNumber = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const challengeRows = await db.select().from(weeklyChallenges).limit(3);
    
    for (const challenge of challengeRows) {
      try {
        await db.insert(activeChallenges).values({
          challengeId: challenge.id,
          weekNumber,
          year: now.getFullYear(),
          startsAt: startOfWeek,
          endsAt: endOfWeek,
          participantCount: randomInt(20, 50),
          completionCount: randomInt(5, 15),
        });
      } catch (e) {
        // Skip if exists
      }
    }
    console.log(`  ✓ Activated ${challengeRows.length} challenges for week ${weekNumber}`);

    // 8. Seed Badges
    console.log('\n🏅 Creating badges...');
    const existingBadges = await db.select().from(badges);
    
    if (existingBadges.length < 5) {
      for (const badge of BADGES_DATA) {
        try {
          await db.insert(badges).values({
            code: badge.code,
            name: badge.name,
            description: badge.desc,
            icon: badge.icon,
            color: badge.color,
            category: badge.category,
            pointsReward: badge.points,
            rarity: badge.rarity,
            requirement: '{}',
            isActive: true,
          });
        } catch (e) {
          // Skip if exists
        }
      }
      console.log(`  ✓ Created ${BADGES_DATA.length} badges`);
    } else {
      console.log(`  ✓ Badges already exist (${existingBadges.length})`);
    }

    // 9. Award some badges to demo users
    console.log('\n🎖️ Awarding badges to demo users...');
    const allBadges = await db.select().from(badges);
    let badgesAwarded = 0;
    
    for (const userId of employeeIds.slice(0, 20)) {
      const numBadges = randomInt(1, 3);
      const shuffledBadges = [...allBadges].sort(() => Math.random() - 0.5).slice(0, numBadges);
      
      for (const badge of shuffledBadges) {
        try {
          await db.insert(userBadges).values({
            userId,
            badgeId: badge.id,
            notified: true,
          });
          badgesAwarded++;
        } catch (e) {
          // Skip duplicates
        }
      }
    }
    console.log(`  ✓ Awarded ${badgesAwarded} badges`);

    // 10. Create some goals
    console.log('\n🎯 Creating savings goals...');
    const goalTypes = [
      { name: 'Fondo de emergencia', target: 10000 },
      { name: 'Vacaciones', target: 15000 },
      { name: 'Nuevo celular', target: 8000 },
      { name: 'Curso de inglés', target: 5000 },
      { name: 'Pago de deuda', target: 20000 },
    ];
    let goalsCreated = 0;
    
    for (const userId of employeeIds.slice(0, 20)) {
      const goal = randomElement(goalTypes);
      const progress = randomInt(0, goal.target);
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + randomInt(1, 6));
      
      await db.insert(financialGoals).values({
        userId,
        name: goal.name,
        targetAmount: goal.target,
        currentAmount: progress,
        category: 'other',
        deadline,
        isCompleted: progress >= goal.target,
      });
      goalsCreated++;
    }
    console.log(`  ✓ Created ${goalsCreated} savings goals`);

    // Summary
    console.log('\n✅ Demo Day seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  📁 Departments: ${departmentIds.length}`);
    console.log(`  👥 Employees: ${employeeIds.length}`);
    console.log(`  💳 Transactions: ${totalTransactions}`);
    console.log(`  🎁 Offers: ${MERCHANT_OFFERS.length}`);
    console.log(`  💰 EWA Requests: ${ewaCount}`);
    console.log(`  🏆 Challenges: ${WEEKLY_CHALLENGES_DATA.length}`);
    console.log(`  🎖️ Badges Awarded: ${badgesAwarded}`);
    console.log(`  🎯 Goals: ${goalsCreated}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Run the seed
seedDemoData().then(() => process.exit(0)).catch(() => process.exit(1));
