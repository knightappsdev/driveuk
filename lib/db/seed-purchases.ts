import { db } from './drizzle';
import { coursePurchases, courses } from './schema';

// Sample purchase data to seed the database
const samplePurchases = [
  {
    courseId: 1,
    studentName: 'Sarah M.',
    studentEmail: 'sarah.m@email.com',
    location: 'City Centre',
    purchaseAmount: 299,
    isRealPurchase: false,
  },
  {
    courseId: 2,
    studentName: 'James K.',
    studentEmail: 'james.k@email.com',
    location: 'North Region',
    purchaseAmount: 399,
    isRealPurchase: false,
  },
  {
    courseId: 3,
    studentName: 'Emily R.',
    studentEmail: 'emily.r@email.com',
    location: 'Central Region',
    purchaseAmount: 599,
    isRealPurchase: false,
  },
  {
    courseId: 1,
    studentName: 'David L.',
    studentEmail: 'david.l@email.com',
    location: 'North East',
    purchaseAmount: 289,
    isRealPurchase: false,
  },
  {
    courseId: 4,
    studentName: 'Lisa P.',
    studentEmail: 'lisa.p@email.com',
    location: 'West Region',
    purchaseAmount: 349,
    isRealPurchase: false,
  },
];

async function seedPurchases() {
  try {
    console.log('🛒 Seeding course purchases...');
    
    // Insert sample purchases with some time variation
    for (let i = 0; i < samplePurchases.length; i++) {
      const purchase = samplePurchases[i];
      
      // Create timestamps spread over the last few hours
      const hoursAgo = Math.floor(Math.random() * 6) + 1; // 1-6 hours ago
      const minutesAgo = Math.floor(Math.random() * 60); // Random minutes
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - hoursAgo, createdAt.getMinutes() - minutesAgo);
      
      await db.insert(coursePurchases).values({
        ...purchase,
        purchaseAmount: purchase.purchaseAmount.toString(),
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: `192.168.1.${100 + i}`,
        },
      });
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Add some additional random purchases from the last 24 hours
    const additionalPurchases = 15;
    const names = [
      'Michael S.', 'Anna T.', 'Chris W.', 'Jessica H.', 'Daniel B.',
      'Sophie C.', 'Ryan F.', 'Maria G.', 'Alex J.', 'Katie N.',
      'Tom V.', 'Emma D.', 'Luke H.', 'Grace L.', 'Ben M.'
    ];
    
    const locations = [
      'Central North', 'South West', 'East Midlands', 'North East', 'West Region',
      'North Region', 'Central Scotland', 'Northern Ireland', 'South Coast', 'South East'
    ];
    
    for (let i = 0; i < additionalPurchases; i++) {
      const courseId = Math.floor(Math.random() * 5) + 1; // Courses 1-5
      const basePrice = [299, 399, 599, 349, 329][courseId - 1];
      const priceVariation = (Math.random() - 0.5) * 0.2; // ±10%
      const purchaseAmount = Math.round(basePrice * (1 + priceVariation));
      
      // Create random timestamp within last 24 hours
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - hoursAgo, createdAt.getMinutes() - minutesAgo);
      
      await db.insert(coursePurchases).values({
        courseId,
        studentName: names[i] || `Student ${i + 1}`,
        studentEmail: `student${i + 1}@email.com`,
        location: locations[Math.floor(Math.random() * locations.length)],
        purchaseAmount: purchaseAmount.toString(),
        isRealPurchase: false,
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: `192.168.1.${150 + i}`,
        },
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`✅ Seeded ${samplePurchases.length + additionalPurchases} course purchases successfully!`);
    
    // Display summary
    const totalPurchases = await db
      .select()
      .from(coursePurchases);
    
    console.log(`📊 Total purchases in database: ${totalPurchases.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding purchases:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedPurchases()
    .then(() => {
      console.log('🎉 Purchase seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Purchase seeding failed:', error);
      process.exit(1);
    });
}

export default seedPurchases;