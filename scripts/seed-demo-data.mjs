/**
 * Seed Demo Data for Treevü Demo Day
 * Run with: node scripts/seed-demo-data.mjs
 */

import mysql from 'mysql2/promise';

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

const EXPENSE_CATEGORIES = [
  { name: 'food', descriptions: ['Almuerzo', 'Cena', 'Desayuno', 'Café', 'Snacks'] },
  { name: 'transport', descriptions: ['Uber', 'Gasolina', 'Metro', 'Estacionamiento', 'Taxi'] },
  { name: 'entertainment', descriptions: ['Netflix', 'Spotify', 'Cine', 'Concierto', 'Videojuegos'] },
  { name: 'shopping', descriptions: ['Ropa', 'Amazon', 'Mercado Libre', 'Electrónicos', 'Hogar'] },
  { name: 'utilities', descriptions: ['Luz', 'Agua', 'Gas', 'Internet', 'Teléfono'] },
  { name: 'health', descriptions: ['Farmacia', 'Doctor', 'Gimnasio', 'Dentista', 'Vitaminas'] },
];

const MERCHANT_OFFERS = [
  { title: 'Descuento 20% en Starbucks', merchant: 'Starbucks México', cost: 150, discount: '20%', category: 'lifestyle' },
  { title: 'Cashback 15% en Uber', merchant: 'Uber México', cost: 200, discount: '15%', category: 'lifestyle' },
  { title: '2x1 en Cinépolis', merchant: 'Cinépolis', cost: 100, discount: '2x1', category: 'lifestyle' },
  { title: 'Descuento 30% en Farmacia del Ahorro', merchant: 'Farmacia del Ahorro', cost: 250, discount: '30%', category: 'emergency' },
  { title: 'Tasa preferencial CETES', merchant: 'GBM+', cost: 500, discount: '0.5% extra', category: 'investment' },
  { title: '10% en Liverpool', merchant: 'Liverpool', cost: 300, discount: '10%', category: 'lifestyle' },
  { title: 'Mes gratis de Spotify', merchant: 'Spotify', cost: 120, discount: '1 mes', category: 'lifestyle' },
  { title: 'Descuento 25% en Rappi', merchant: 'Rappi', cost: 180, discount: '25%', category: 'lifestyle' },
  { title: 'Consulta médica gratis', merchant: 'Doctoralia', cost: 400, discount: '100%', category: 'emergency' },
  { title: 'Inversión sin comisión', merchant: 'Fintual', cost: 350, discount: 'Sin comisión', category: 'investment' },
];

const WEEKLY_CHALLENGES = [
  { code: 'track_expenses_7', title: 'Registra 7 gastos esta semana', icon: 'Receipt', color: 'blue', category: 'spending', target: 7, unit: 'gastos', points: 100, difficulty: 'easy' },
  { code: 'no_ant_expenses', title: 'Cero gastos hormiga por 5 días', icon: 'Bug', color: 'red', category: 'spending', target: 5, unit: 'días', points: 150, difficulty: 'medium' },
  { code: 'complete_tutorial', title: 'Completa un tutorial educativo', icon: 'GraduationCap', color: 'purple', category: 'education', target: 1, unit: 'tutorial', points: 75, difficulty: 'easy' },
  { code: 'login_streak_5', title: 'Inicia sesión 5 días seguidos', icon: 'Flame', color: 'orange', category: 'engagement', target: 5, unit: 'días', points: 100, difficulty: 'easy' },
  { code: 'refer_friend', title: 'Invita a un compañero', icon: 'UserPlus', color: 'green', category: 'social', target: 1, unit: 'referido', points: 200, difficulty: 'medium' },
  { code: 'improve_fwi_5', title: 'Mejora tu FWI en 5 puntos', icon: 'TrendingUp', color: 'emerald', category: 'fwi', target: 5, unit: 'puntos', points: 250, difficulty: 'hard' },
  { code: 'save_goal', title: 'Crea una meta de ahorro', icon: 'Target', color: 'teal', category: 'savings', target: 1, unit: 'meta', points: 100, difficulty: 'easy' },
  { code: 'redeem_offer', title: 'Canjea una oferta del marketplace', icon: 'Gift', color: 'pink', category: 'engagement', target: 1, unit: 'oferta', points: 75, difficulty: 'easy' },
];

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  date.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0);
  return date;
}

function generateEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techcorp.mx`;
}

function generateFwiScore(deptAvg) {
  // Generate FWI with some variance around department average
  const variance = randomInt(-15, 15);
  return Math.max(20, Math.min(95, deptAvg + variance));
}

async function seedDemoData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'treevu',
  });

  console.log('🌱 Starting Demo Day seed...\n');

  try {
    // 1. Create/Update Departments
    console.log('📁 Creating departments...');
    const departmentIds = [];
    
    for (const dept of DEMO_COMPANY.departments) {
      const [result] = await connection.execute(
        `INSERT INTO departments (name, employeeCount, avgFwiScore, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE employeeCount = ?, avgFwiScore = ?, updatedAt = NOW()`,
        [dept.name, dept.employeeCount, dept.avgFwi, dept.employeeCount, dept.avgFwi]
      );
      
      // Get the department ID
      const [rows] = await connection.execute(
        'SELECT id FROM departments WHERE name = ?',
        [dept.name]
      );
      departmentIds.push({ id: rows[0].id, ...dept });
      console.log(`  ✓ ${dept.name} (${dept.employeeCount} empleados, FWI avg: ${dept.avgFwi})`);
    }

    // 2. Create Demo Employees
    console.log('\n👥 Creating demo employees...');
    const employeeIds = [];
    let employeeIndex = 0;
    
    for (const dept of departmentIds) {
      for (let i = 0; i < dept.employeeCount && employeeIndex < 50; i++) {
        const firstName = randomElement(FIRST_NAMES);
        const lastName = randomElement(LAST_NAMES);
        const fwiScore = generateFwiScore(dept.avgFwi);
        const treePoints = randomInt(100, 2500);
        const level = Math.floor(treePoints / 500) + 1;
        const streakDays = randomInt(0, 30);
        const monthlyIncome = randomInt(15000, 80000);
        const openId = `demo_employee_${Date.now()}_${employeeIndex}`;
        
        try {
          const [result] = await connection.execute(
            `INSERT INTO users (openId, name, email, role, departmentId, monthlyIncome, fwiScore, treePoints, streakDays, level, status, createdAt, updatedAt, lastSignedIn)
             VALUES (?, ?, ?, 'employee', ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW(), NOW())`,
            [openId, `${firstName} ${lastName}`, generateEmail(firstName, lastName), dept.id, monthlyIncome, fwiScore, treePoints, streakDays, level]
          );
          employeeIds.push(result.insertId);
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
      const numTransactions = randomInt(10, 30);
      
      for (let i = 0; i < numTransactions; i++) {
        const category = randomElement(EXPENSE_CATEGORIES);
        const description = randomElement(category.descriptions);
        const amount = randomInt(50, 2000);
        const date = randomDate(60);
        
        await connection.execute(
          `INSERT INTO transactions (userId, amount, category, description, createdAt)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, amount, category.name, description, date]
        );
        totalTransactions++;
      }
    }
    console.log(`  ✓ Created ${totalTransactions} transactions`);

    // 4. Create Merchant Offers
    console.log('\n🎁 Creating merchant offers...');
    
    for (const offer of MERCHANT_OFFERS) {
      // First create or get merchant user
      const merchantOpenId = `merchant_${offer.merchant.toLowerCase().replace(/\s+/g, '_')}`;
      
      await connection.execute(
        `INSERT IGNORE INTO users (openId, name, role, status, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, 'merchant', 'active', NOW(), NOW(), NOW())`,
        [merchantOpenId, offer.merchant]
      );
      
      const [merchantRows] = await connection.execute(
        'SELECT id FROM users WHERE openId = ?',
        [merchantOpenId]
      );
      const merchantId = merchantRows[0].id;
      
      await connection.execute(
        `INSERT INTO market_offers (merchantId, title, description, costPoints, discountValue, category, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, TRUE, NOW(), NOW())
         ON DUPLICATE KEY UPDATE title = ?, costPoints = ?, updatedAt = NOW()`,
        [merchantId, offer.title, `Oferta exclusiva de ${offer.merchant}`, offer.cost, offer.discount, offer.category, offer.title, offer.cost]
      );
      console.log(`  ✓ ${offer.title}`);
    }

    // 5. Create EWA Requests
    console.log('\n💰 Creating EWA request history...');
    const ewaStatuses = ['pending', 'approved', 'disbursed', 'repaid'];
    let ewaCount = 0;
    
    for (const userId of employeeIds.slice(0, 20)) {
      const numRequests = randomInt(1, 3);
      
      for (let i = 0; i < numRequests; i++) {
        const amount = randomInt(1000, 5000);
        const status = randomElement(ewaStatuses);
        const date = randomDate(90);
        
        await connection.execute(
          `INSERT INTO ewa_requests (userId, amount, status, reason, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, amount, status, 'Gastos imprevistos', date, date]
        );
        ewaCount++;
      }
    }
    console.log(`  ✓ Created ${ewaCount} EWA requests`);

    // 6. Create Weekly Challenges
    console.log('\n🏆 Creating weekly challenges...');
    
    for (const challenge of WEEKLY_CHALLENGES) {
      await connection.execute(
        `INSERT INTO weekly_challenges (code, title, description, icon, color, category, targetValue, targetUnit, pointsReward, difficulty, isActive, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())
         ON DUPLICATE KEY UPDATE title = ?, pointsReward = ?`,
        [challenge.code, challenge.title, `Completa este desafío para ganar ${challenge.points} TreePoints`, challenge.icon, challenge.color, challenge.category, challenge.target, challenge.unit, challenge.points, challenge.difficulty, challenge.title, challenge.points]
      );
      console.log(`  ✓ ${challenge.title}`);
    }

    // 7. Create Active Challenge for this week
    console.log('\n📅 Creating active challenge for this week...');
    const now = new Date();
    const weekNumber = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const [challengeRows] = await connection.execute('SELECT id FROM weekly_challenges LIMIT 3');
    
    for (const challenge of challengeRows) {
      await connection.execute(
        `INSERT INTO active_challenges (challengeId, weekNumber, year, startsAt, endsAt, participantCount, completionCount, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [challenge.id, weekNumber, now.getFullYear(), startOfWeek, endOfWeek, randomInt(20, 50), randomInt(5, 15)]
      );
    }
    console.log(`  ✓ Activated ${challengeRows.length} challenges for week ${weekNumber}`);

    // 8. Seed Badges if not exist
    console.log('\n🏅 Verifying badges...');
    const [badgeCount] = await connection.execute('SELECT COUNT(*) as count FROM badges');
    if (badgeCount[0].count === 0) {
      const badges = [
        { code: 'streak_7', name: 'Racha de 7 días', desc: 'Mantén actividad por 7 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement', points: 100, rarity: 'common' },
        { code: 'streak_30', name: 'Racha de 30 días', desc: 'Mantén actividad por 30 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement', points: 300, rarity: 'rare' },
        { code: 'streak_90', name: 'Racha de 90 días', desc: 'Mantén actividad por 90 días consecutivos', icon: 'Flame', color: 'orange', category: 'engagement', points: 500, rarity: 'legendary' },
        { code: 'fwi_master', name: 'Maestro FWI', desc: 'Alcanza un FWI de 80+', icon: 'TrendingUp', color: 'emerald', category: 'financial', points: 200, rarity: 'rare' },
        { code: 'ewa_first', name: 'Primer EWA', desc: 'Solicita tu primer adelanto', icon: 'Wallet', color: 'blue', category: 'financial', points: 50, rarity: 'common' },
        { code: 'education_complete', name: 'Estudiante Estrella', desc: 'Completa todos los tutoriales', icon: 'GraduationCap', color: 'purple', category: 'education', points: 250, rarity: 'epic' },
        { code: 'referral_5', name: 'Embajador', desc: 'Refiere a 5 compañeros', icon: 'Users', color: 'green', category: 'social', points: 300, rarity: 'rare' },
        { code: 'challenge_10', name: 'Retador', desc: 'Completa 10 desafíos semanales', icon: 'Trophy', color: 'yellow', category: 'engagement', points: 400, rarity: 'epic' },
      ];
      
      for (const badge of badges) {
        await connection.execute(
          `INSERT INTO badges (code, name, description, icon, color, category, pointsReward, rarity, requirement, isActive, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, '{}', TRUE, NOW())`,
          [badge.code, badge.name, badge.desc, badge.icon, badge.color, badge.category, badge.points, badge.rarity]
        );
      }
      console.log(`  ✓ Created ${badges.length} badges`);
    } else {
      console.log(`  ✓ Badges already exist (${badgeCount[0].count})`);
    }

    // 9. Award some badges to demo users
    console.log('\n🎖️ Awarding badges to demo users...');
    const [allBadges] = await connection.execute('SELECT id, code FROM badges');
    let badgesAwarded = 0;
    
    for (const userId of employeeIds.slice(0, 30)) {
      const numBadges = randomInt(1, 4);
      const shuffledBadges = allBadges.sort(() => Math.random() - 0.5).slice(0, numBadges);
      
      for (const badge of shuffledBadges) {
        try {
          await connection.execute(
            `INSERT IGNORE INTO user_badges (userId, badgeId, earnedAt, notified)
             VALUES (?, ?, ?, TRUE)`,
            [userId, badge.id, randomDate(30)]
          );
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
    
    for (const userId of employeeIds.slice(0, 25)) {
      const goal = randomElement(goalTypes);
      const progress = randomInt(0, goal.target);
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + randomInt(1, 6));
      
      await connection.execute(
        `INSERT INTO goals (userId, name, targetAmount, currentAmount, deadline, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, goal.name, goal.target, progress, deadline, progress >= goal.target ? 'completed' : 'active']
      );
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
    console.log(`  🏆 Challenges: ${WEEKLY_CHALLENGES.length}`);
    console.log(`  🎖️ Badges Awarded: ${badgesAwarded}`);
    console.log(`  🎯 Goals: ${goalsCreated}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seed
seedDemoData().catch(console.error);
