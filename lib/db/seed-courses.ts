import { db } from './drizzle';
import { courses } from './schema';

// Sample courses based on the existing course data structure
const sampleCourses = [
  {
    title: 'Complete Beginner Course',
    description: 'Perfect for complete beginners with no driving experience. Comprehensive course covering all basics.',
    level: 'absolute-beginner' as const,
    totalHours: 40,
    price: '299.00',
    features: [
      'Highway Code included',
      'Theory test preparation',
      'Mock driving tests',
      '40 hours of lessons',
      'Flexible scheduling'
    ],
    color: 'blue',
    isRecommended: true,
    isActive: true,
  },
  {
    title: 'Advanced Driving Skills',
    description: 'For drivers looking to improve their skills and confidence on the road.',
    level: 'advanced' as const,
    totalHours: 20,
    price: '399.00',
    features: [
      'Advanced maneuvers',
      'Motorway driving',
      'Night driving',
      'Adverse weather conditions',
      'Defensive driving techniques'
    ],
    color: 'green',
    isRecommended: false,
    isActive: true,
  },
  {
    title: 'Intensive Weekly Course',
    description: 'Pass your test quickly with our intensive 1-week course.',
    level: 'intermediate' as const,
    totalHours: 30,
    price: '599.00',
    features: [
      'Fast track learning',
      'Daily 6-hour sessions',
      'Test booking included',
      'Guaranteed test date',
      'Pass protection'
    ],
    color: 'purple',
    isRecommended: true,
    isActive: true,
  },
  {
    title: 'Weekend Driving Course',
    description: 'Perfect for busy professionals who can only learn on weekends.',
    level: 'beginner' as const,
    totalHours: 25,
    price: '349.00',
    features: [
      'Weekend only sessions',
      'Flexible timing',
      'Professional instructors',
      'Theory support',
      '25 hours of training'
    ],
    color: 'orange',
    isRecommended: false,
    isActive: true,
  },
  {
    title: 'Automatic Transmission Course',
    description: 'Learn to drive with automatic transmission for easier learning.',
    level: 'beginner' as const,
    totalHours: 35,
    price: '329.00',
    features: [
      'Automatic cars only',
      'Easier to learn',
      'Modern vehicles',
      'Patient instructors',
      'Quick progress'
    ],
    color: 'teal',
    isRecommended: false,
    isActive: true,
  }
];

async function seedCourses() {
  try {
    console.log('📚 Seeding courses...');
    
    // Check if courses already exist
    const existingCourses = await db.select().from(courses);
    
    if (existingCourses.length > 0) {
      console.log(`ℹ️  Found ${existingCourses.length} existing courses, skipping seed.`);
      return;
    }
    
    // Insert sample courses
    for (const course of sampleCourses) {
      await db.insert(courses).values(course);
      console.log(`✅ Added course: ${course.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleCourses.length} courses!`);
    
    // Display summary
    const totalCourses = await db.select().from(courses);
    console.log(`📊 Total courses in database: ${totalCourses.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedCourses()
    .then(() => {
      console.log('🎉 Course seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Course seeding failed:', error);
      process.exit(1);
    });
}

export default seedCourses;