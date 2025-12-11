/**
 * Seed Script - Datos de Demostración para Treevü
 * 
 * Este script genera datos realistas para probar la plataforma:
 * - Usuarios con diferentes roles
 * - Transacciones por categoría
 * - Metas financieras con progreso
 * - Solicitudes EWA
 * - TreePoints
 * - Departamentos
 * - Ofertas de merchants
 */

import mysql from 'mysql2/promise';

// Configuración
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no configurada');
  process.exit(1);
}

// Datos de ejemplo
const EXPENSE_CATEGORIES = ['food', 'transport', 'entertainment', 'services', 'health', 'shopping', 'other'];
const GOAL_CATEGORIES = ['emergency', 'vacation', 'purchase', 'investment', 'other'];
const OFFER_CATEGORIES = ['financial', 'lifestyle', 'emergency', 'investment'];

const DEPARTMENT_NAMES = [
  'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing', 
  'Operaciones', 'Ventas', 'Soporte', 'Legal'
];

const FIRST_NAMES = [
  'María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofia', 'Miguel',
  'Valentina', 'Diego', 'Camila', 'Andrés', 'Isabella', 'Luis', 'Gabriela'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández',
  'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez'
];

// Funciones de utilidad
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysAgo));
  date.setHours(randomInt(6, 22), randomInt(0, 59), 0, 0);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function futureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(30, daysAhead));
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function generateOpenId() {
  return 'demo_' + Math.random().toString(36).substring(2, 15);
}

async function seed() {
  console.log('🌱 Iniciando seed de datos de demostración...\n');

  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    // 1. Crear departamentos
    console.log('📁 Creando departamentos...');
    const departmentIds = [];
    
    for (const name of DEPARTMENT_NAMES) {
      const [result] = await connection.execute(
        `INSERT INTO departments (name, companyId, employeeCount, avgFwiScore, createdAt, updatedAt) 
         VALUES (?, 1, ?, ?, NOW(), NOW())`,
        [name, randomInt(5, 50), randomInt(45, 85)]
      );
      departmentIds.push(result.insertId);
    }
    console.log(`   ✅ ${departmentIds.length} departamentos creados\n`);

    // 2. Crear usuarios de demostración
    console.log('👥 Creando usuarios...');
    const userIds = { employees: [], merchants: [], b2bAdmins: [] };

    // Admin principal
    await connection.execute(
      `INSERT INTO users (openId, name, email, role, monthlyIncome, fwiScore, level, treePoints, workModality, status, createdAt, updatedAt, lastSignedIn) 
       VALUES (?, ?, ?, 'admin', ?, ?, ?, ?, 'hybrid', 'active', NOW(), NOW(), NOW())`,
      ['demo_admin_001', 'Admin Demo', 'admin@treevu-demo.com', 15000000, 85, 10, 5000]
    );

    // B2B Admins (3)
    for (let i = 0; i < 3; i++) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      const [result] = await connection.execute(
        `INSERT INTO users (openId, name, email, role, departmentId, monthlyIncome, fwiScore, level, treePoints, workModality, status, createdAt, updatedAt, lastSignedIn) 
         VALUES (?, ?, ?, 'b2b_admin', ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW(), NOW())`,
        [
          generateOpenId(),
          `${firstName} ${lastName}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@empresa-demo.com`,
          randomElement(departmentIds),
          randomInt(8000000, 12000000),
          randomInt(60, 90),
          randomInt(5, 8),
          randomInt(1000, 3000),
          randomElement(['remote', 'hybrid', 'onsite'])
        ]
      );
      userIds.b2bAdmins.push(result.insertId);
    }
    console.log(`   ✅ 3 B2B Admins creados`);

    // Merchants (5)
    const merchantNames = [
      'Café Treevü', 'Gym FitLife', 'Librería Saber', 'Farmacia Salud+', 'Restaurante Sabor'
    ];
    for (let i = 0; i < 5; i++) {
      const [result] = await connection.execute(
        `INSERT INTO users (openId, name, email, role, monthlyIncome, fwiScore, level, treePoints, merchantLevel, workModality, status, createdAt, updatedAt, lastSignedIn) 
         VALUES (?, ?, ?, 'merchant', ?, ?, ?, ?, ?, 'onsite', 'active', NOW(), NOW(), NOW())`,
        [
          generateOpenId(),
          merchantNames[i],
          `contacto@${merchantNames[i].toLowerCase().replace(/\s/g, '').replace(/\+/g, '')}.com`,
          randomInt(20000000, 50000000),
          randomInt(70, 95),
          randomInt(3, 7),
          randomInt(500, 2000),
          randomElement(['bronze', 'silver', 'gold'])
        ]
      );
      userIds.merchants.push(result.insertId);
    }
    console.log(`   ✅ 5 Merchants creados`);

    // Empleados (30)
    for (let i = 0; i < 30; i++) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      const fwiScore = randomInt(25, 95);
      const [result] = await connection.execute(
        `INSERT INTO users (openId, name, email, role, departmentId, monthlyIncome, fwiScore, level, treePoints, streakDays, workModality, status, createdAt, updatedAt, lastSignedIn) 
         VALUES (?, ?, ?, 'employee', ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW(), NOW())`,
        [
          generateOpenId(),
          `${firstName} ${lastName}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@empresa-demo.com`,
          randomElement(departmentIds),
          randomInt(1500000, 8000000),
          fwiScore,
          Math.floor(fwiScore / 10),
          randomInt(100, 2000),
          randomInt(0, 30),
          randomElement(['remote', 'hybrid', 'onsite'])
        ]
      );
      userIds.employees.push(result.insertId);
    }
    console.log(`   ✅ 30 Empleados creados\n`);

    // 3. Crear transacciones para cada empleado
    console.log('💳 Creando transacciones...');
    let transactionCount = 0;

    for (const userId of userIds.employees) {
      const numTransactions = randomInt(15, 40);
      
      for (let j = 0; j < numTransactions; j++) {
        const category = randomElement(EXPENSE_CATEGORIES);
        
        // Montos realistas por categoría (en centavos)
        let amount;
        switch (category) {
          case 'food': amount = randomInt(5000, 50000); break;
          case 'transport': amount = randomInt(3000, 30000); break;
          case 'entertainment': amount = randomInt(10000, 100000); break;
          case 'services': amount = randomInt(20000, 200000); break;
          case 'health': amount = randomInt(10000, 200000); break;
          case 'shopping': amount = randomInt(10000, 300000); break;
          default: amount = randomInt(5000, 100000);
        }

        const merchants = ['Tienda Local', 'Supermercado', 'Farmacia', 'Restaurante', 'Transporte', 'Online Store'];

        await connection.execute(
          `INSERT INTO transactions (userId, merchant, amount, category, isDiscretionary, aiConfidence, description, transactionDate, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            randomElement(merchants),
            amount,
            category,
            Math.random() < 0.6,
            randomInt(70, 99),
            `Gasto en ${category}`,
            randomDate(90)
          ]
        );
        transactionCount++;
      }
    }
    console.log(`   ✅ ${transactionCount} transacciones creadas\n`);

    // 4. Crear metas financieras
    console.log('🎯 Creando metas financieras...');
    let goalCount = 0;

    const goalNames = [
      'Fondo de emergencia', 'Vacaciones', 'Pago de deuda',
      'Curso de idiomas', 'Nuevo celular', 'Ahorro para auto',
      'Inversión inicial', 'Remodelación casa'
    ];

    for (const userId of userIds.employees) {
      const numGoals = randomInt(1, 4);
      
      for (let j = 0; j < numGoals; j++) {
        const targetAmount = randomInt(500000, 10000000); // En centavos
        const progress = randomInt(0, 100);
        const currentAmount = Math.floor((targetAmount * progress) / 100);

        await connection.execute(
          `INSERT INTO financial_goals (userId, name, targetAmount, currentAmount, category, deadline, isPriority, isCompleted, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            userId,
            randomElement(goalNames),
            targetAmount,
            currentAmount,
            randomElement(GOAL_CATEGORIES),
            futureDate(365),
            Math.random() < 0.3,
            progress >= 100
          ]
        );
        goalCount++;
      }
    }
    console.log(`   ✅ ${goalCount} metas financieras creadas\n`);

    // 5. Crear solicitudes EWA
    console.log('💰 Creando solicitudes EWA...');
    let ewaCount = 0;

    const ewaStatuses = ['pending_approval', 'processing_transfer', 'disbursed', 'rejected'];

    for (const userId of userIds.employees.slice(0, 20)) {
      const numRequests = randomInt(1, 3);
      
      for (let j = 0; j < numRequests; j++) {
        const amount = randomInt(50000, 500000); // En centavos
        const status = randomElement(ewaStatuses);
        
        await connection.execute(
          `INSERT INTO ewa_requests (userId, amount, fee, status, approvedBy, daysWorked, monthlyIncome, fwiScoreAtRequest, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            amount,
            Math.floor(amount * 0.02), // 2% fee
            status,
            status !== 'pending_approval' ? randomElement(userIds.b2bAdmins) : null,
            randomInt(5, 25),
            randomInt(1500000, 8000000),
            randomInt(40, 80),
            randomDate(60)
          ]
        );
        ewaCount++;
      }
    }
    console.log(`   ✅ ${ewaCount} solicitudes EWA creadas\n`);

    // 6. Crear TreePoints transactions
    console.log('🌳 Creando TreePoints...');
    let treepointsCount = 0;

    const treePointsTypes = ['earned', 'redeemed', 'bonus'];
    const earnReasons = ['Pago a tiempo', 'Meta completada', 'Racha de 7 días', 'Primer adelanto', 'Referido registrado', 'Nivel alcanzado'];
    const redeemReasons = ['Canje en Café Treevü', 'Descuento en Gym FitLife', 'Compra en Librería Saber', 'Farmacia Salud+'];

    for (const userId of userIds.employees) {
      const numTransactions = randomInt(5, 15);
      
      for (let j = 0; j < numTransactions; j++) {
        const type = randomElement(treePointsTypes);
        const isEarned = type !== 'redeemed';
        const points = randomInt(10, 200);
        
        await connection.execute(
          `INSERT INTO tree_points_transactions (userId, amount, type, reason, offerId, departmentId, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            isEarned ? points : -points,
            type,
            isEarned ? randomElement(earnReasons) : randomElement(redeemReasons),
            !isEarned ? randomInt(1, 8) : null,
            randomElement(departmentIds),
            randomDate(90)
          ]
        );
        treepointsCount++;
      }
    }
    console.log(`   ✅ ${treepointsCount} transacciones de TreePoints creadas\n`);

    // 7. Crear ofertas de merchants
    console.log('🏷️ Creando ofertas...');
    const offerData = [
      { title: 'Café gratis', description: 'Un café americano gratis con tu compra', points: 100 },
      { title: '20% descuento', description: '20% de descuento en tu próxima compra', points: 200 },
      { title: 'Clase gratis', description: 'Una clase de prueba gratis en el gym', points: 150 },
      { title: 'Libro de regalo', description: 'Libro de bolsillo de regalo', points: 300 },
      { title: '2x1 en medicamentos', description: '2x1 en vitaminas seleccionadas', points: 250 },
      { title: 'Postre gratis', description: 'Postre del día gratis con tu comida', points: 180 },
      { title: 'Mes gratis gym', description: 'Un mes de membresía gratis', points: 500 },
      { title: '50% en libros', description: '50% de descuento en libros de texto', points: 400 },
    ];

    for (let i = 0; i < offerData.length; i++) {
      const offer = offerData[i];
      await connection.execute(
        `INSERT INTO market_offers (merchantId, title, description, costPoints, discountValue, category, targetFwiSegment, origin, isActive, totalRedemptions, totalConversions, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'global', true, ?, ?, NOW(), NOW())`,
        [
          userIds.merchants[i % userIds.merchants.length],
          offer.title,
          offer.description,
          offer.points,
          `${randomInt(10, 50)}%`,
          randomElement(OFFER_CATEGORIES),
          randomElement(['low', 'mid', 'high', 'all']),
          randomInt(0, 50),
          randomInt(0, 30)
        ]
      );
    }
    console.log(`   ✅ ${offerData.length} ofertas creadas\n`);

    // 8. Crear notificaciones de ejemplo
    console.log('🔔 Creando notificaciones de ejemplo...');
    const notificationTypes = [
      { type: 'ewa_approved', title: '¡Adelanto aprobado!', message: 'Tu solicitud de adelanto por $2,000 ha sido aprobada.' },
      { type: 'treepoints_received', title: '+50 TreePoints', message: 'Has ganado 50 TreePoints por completar tu meta.' },
      { type: 'goal_completed', title: '¡Meta alcanzada!', message: 'Felicidades, has completado tu meta de ahorro.' },
      { type: 'fwi_improved', title: 'FWI Score mejorado', message: 'Tu score ha subido 5 puntos este mes.' },
      { type: 'offer_available', title: 'Nueva oferta disponible', message: 'Café Treevü tiene una nueva oferta para ti.' },
    ];

    let notifCount = 0;
    for (const userId of userIds.employees.slice(0, 15)) {
      const numNotifications = randomInt(2, 5);
      for (let j = 0; j < numNotifications; j++) {
        const notif = randomElement(notificationTypes);
        await connection.execute(
          `INSERT INTO notifications (userId, type, title, message, isRead, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            notif.type,
            notif.title,
            notif.message,
            Math.random() < 0.5,
            randomDate(30)
          ]
        );
        notifCount++;
      }
    }
    console.log(`   ✅ ${notifCount} notificaciones creadas\n`);

    // 9. Crear análisis de riesgo para empleados
    console.log('📊 Creando análisis de riesgo...');
    const riskLevels = ['low', 'medium', 'high', 'critical'];

    for (const userId of userIds.employees) {
      await connection.execute(
        `INSERT INTO employee_risk_analysis (userId, departmentId, absenteeismRisk, turnoverPropensity, ewaFrequency, lastFwiScore, tenure, age, projectedLoss, lastAnalysisDate, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
         ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        [
          userId,
          randomElement(departmentIds),
          randomElement(riskLevels),
          randomInt(5, 85),
          randomInt(0, 5),
          randomInt(30, 90),
          randomInt(1, 60),
          randomInt(22, 55),
          randomInt(50000, 500000)
        ]
      );
    }
    console.log(`   ✅ ${userIds.employees.length} análisis de riesgo creados\n`);

    console.log('═══════════════════════════════════════════');
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════');
    console.log(`
Resumen:
  • ${departmentIds.length} departamentos
  • 1 admin + 3 B2B admins + 5 merchants + 30 empleados
  • ${transactionCount} transacciones
  • ${goalCount} metas financieras
  • ${ewaCount} solicitudes EWA
  • ${treepointsCount} transacciones de TreePoints
  • ${offerData.length} ofertas de merchants
  • ${notifCount} notificaciones de ejemplo
  • ${userIds.employees.length} análisis de riesgo

Para acceder como admin de demo:
  OpenID: demo_admin_001
  Email: admin@treevu-demo.com
`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
