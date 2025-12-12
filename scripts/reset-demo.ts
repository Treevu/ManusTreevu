/**
 * Reset Demo Data Script
 * Limpia los datos de demo y los repuebla para una nueva demostración
 * Uso: npx tsx scripts/reset-demo.ts
 */

import { getDb } from '../server/db';
import { 
  transactions, 
  financialGoals, 
  ewaRequests, 
  treePointsTransactions,
  notifications,
  userBadges,
  educationProgress,
  offerRedemptions
} from '../drizzle/schema';
import { sql } from 'drizzle-orm';

async function resetDemoData() {
  console.log('🔄 Resetting demo data...\n');
  
  const db = await getDb();
  if (!db) {
    console.error('❌ Database not available');
    process.exit(1);
  }

  try {
    // 1. Limpiar datos transaccionales (mantener usuarios y configuración)
    console.log('🧹 Cleaning transactional data...');
    
    await db.delete(offerRedemptions);
    console.log('  ✓ Offer redemptions cleared');
    
    await db.delete(educationProgress);
    console.log('  ✓ Education progress cleared');
    
    await db.delete(userBadges);
    console.log('  ✓ User badges cleared');
    
    await db.delete(notifications);
    console.log('  ✓ Notifications cleared');
    
    await db.delete(treePointsTransactions);
    console.log('  ✓ TreePoints transactions cleared');
    
    await db.delete(ewaRequests);
    console.log('  ✓ EWA requests cleared');
    
    await db.delete(financialGoals);
    console.log('  ✓ Financial goals cleared');
    
    await db.delete(transactions);
    console.log('  ✓ Transactions cleared');

    console.log('\n✅ Demo data reset complete!');
    console.log('\n📝 Next step: Run "npx tsx scripts/seed-demo.ts" to repopulate data');
    
  } catch (error) {
    console.error('❌ Error resetting demo data:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

resetDemoData();
