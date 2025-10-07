import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { ukTheoryCategories, achievements, forumCategories, courses } from './schema';

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

/**
 * Seed UK DVSA Theory Test Categories
 * Official categories with accurate question counts and pass requirements
 */
const theoryCategories = [
  {
    categoryCode: 'ALERTNESS' as const,
    categoryName: 'Alertness',
    description: 'Being aware of your surroundings, anticipating hazards, and maintaining concentration while driving',
    totalQuestions: 30,
    passRequirement: 24,
    displayOrder: 1,
  },
  {
    categoryCode: 'ATTITUDE' as const,
    categoryName: 'Attitude',
    description: 'Showing consideration for other road users, patience, and responsible driving behavior',
    totalQuestions: 25,
    passRequirement: 20,
    displayOrder: 2,
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE' as const,
    categoryName: 'Safety and Your Vehicle',
    description: 'Vehicle maintenance, safety checks, loading, and ensuring your vehicle is roadworthy',
    totalQuestions: 35,
    passRequirement: 28,
    displayOrder: 3,
  },
  {
    categoryCode: 'SAFETY_MARGINS' as const,
    categoryName: 'Safety Margins',
    description: 'Maintaining safe following distances, speed limits, and stopping distances in various conditions',
    totalQuestions: 30,
    passRequirement: 24,
    displayOrder: 4,
  },
  {
    categoryCode: 'HAZARD_AWARENESS' as const,
    categoryName: 'Hazard Awareness',
    description: 'Identifying potential dangers, anticipating problems, and responding appropriately to hazards',
    totalQuestions: 40,
    passRequirement: 32,
    displayOrder: 5,
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS' as const,
    categoryName: 'Vulnerable Road Users',
    description: 'Interacting safely with pedestrians, cyclists, motorcyclists, and other vulnerable road users',
    totalQuestions: 28,
    passRequirement: 22,
    displayOrder: 6,
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE' as const,
    categoryName: 'Other Types of Vehicle',
    description: 'Understanding the characteristics and behaviors of different vehicle types on the road',
    totalQuestions: 22,
    passRequirement: 18,
    displayOrder: 7,
  },
  {
    categoryCode: 'VEHICLE_SAFETY' as const,
    categoryName: 'Vehicle Safety',
    description: 'Safety features, crash protection, child safety, and emergency procedures',
    totalQuestions: 25,
    passRequirement: 20,
    displayOrder: 8,
  },
  {
    categoryCode: 'VEHICLE_LOADING' as const,
    categoryName: 'Vehicle Loading',
    description: 'Proper loading techniques, weight distribution, and securing loads safely',
    totalQuestions: 18,
    passRequirement: 14,
    displayOrder: 9,
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES' as const,
    categoryName: 'Incidents, Accidents and Emergencies',
    description: 'Responding to breakdowns, accidents, and emergency situations on the road',
    totalQuestions: 30,
    passRequirement: 24,
    displayOrder: 10,
  },
  {
    categoryCode: 'VEHICLE_HANDLING' as const,
    categoryName: 'Vehicle Handling',
    description: 'Controlling your vehicle in different conditions, steering, and maneuvering techniques',
    totalQuestions: 32,
    passRequirement: 26,
    displayOrder: 11,
  },
  {
    categoryCode: 'MOTORWAY_RULES' as const,
    categoryName: 'Motorway Rules',
    description: 'Motorway driving rules, lane discipline, joining and leaving motorways safely',
    totalQuestions: 28,
    passRequirement: 22,
    displayOrder: 12,
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD' as const,
    categoryName: 'Rules of the Road',
    description: 'Traffic laws, right of way, road markings, and general driving regulations',
    totalQuestions: 45,
    passRequirement: 36,
    displayOrder: 13,
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS' as const,
    categoryName: 'Road and Traffic Signs',
    description: 'Understanding and interpreting road signs, traffic signals, and road markings',
    totalQuestions: 35,
    passRequirement: 28,
    displayOrder: 14,
  },
  {
    categoryCode: 'DOCUMENTS' as const,
    categoryName: 'Documents',
    description: 'Required documents for driving, insurance, MOT, and legal requirements',
    totalQuestions: 20,
    passRequirement: 16,
    displayOrder: 15,
  },
];

/**
 * Seed Achievement System
 * Gamification achievements for student motivation
 */
const achievementsList = [
  {
    name: 'First Steps',
    description: 'Complete your first theory test practice session',
    achievementType: 'milestone' as const,
    icon: 'trophy',
    badgeColor: '#10B981',
    criteria: { practiceTestsCompleted: 1 },
    pointsAwarded: 10,
    rarityLevel: 'common',
  },
  {
    name: 'Perfect Score',
    description: 'Achieve 100% on a practice test',
    achievementType: 'test_pass' as const,
    icon: 'star',
    badgeColor: '#F59E0B',
    criteria: { perfectScoreAchieved: true },
    pointsAwarded: 50,
    rarityLevel: 'rare',
  },
  {
    name: 'Study Streak',
    description: 'Complete practice tests for 7 consecutive days',
    achievementType: 'study_streak' as const,
    icon: 'fire',
    badgeColor: '#EF4444',
    criteria: { consecutiveDays: 7 },
    pointsAwarded: 100,
    rarityLevel: 'epic',
  },
  {
    name: 'Category Master',
    description: 'Achieve 90%+ average in all 15 theory categories',
    achievementType: 'knowledge_master' as const,
    icon: 'crown',
    badgeColor: '#8B5CF6',
    criteria: { categoriesMastered: 15, requiredAccuracy: 90 },
    pointsAwarded: 200,
    rarityLevel: 'legendary',
  },
  {
    name: 'Speed Demon',
    description: 'Complete a practice test in under 20 minutes with 80%+ score',
    achievementType: 'milestone' as const,
    icon: 'zap',
    badgeColor: '#06B6D4',
    criteria: { timeLimit: 1200, minScore: 80 },
    pointsAwarded: 75,
    rarityLevel: 'rare',
  },
  {
    name: 'Helper',
    description: 'Help 10 fellow students in the community forums',
    achievementType: 'community_helper' as const,
    icon: 'heart',
    badgeColor: '#EC4899',
    criteria: { helpfulAnswers: 10 },
    pointsAwarded: 50,
    rarityLevel: 'uncommon',
  },
  {
    name: 'Mentor',
    description: 'Become a verified mentor and help 50+ students',
    achievementType: 'community_helper' as const,
    icon: 'academic-cap',
    badgeColor: '#7C3AED',
    criteria: { studentsHelped: 50, mentorStatus: true },
    pointsAwarded: 300,
    rarityLevel: 'legendary',
  },
  {
    name: 'Theory Champion',
    description: 'Pass the official DVSA theory test',
    achievementType: 'test_pass' as const,
    icon: 'certificate',
    badgeColor: '#059669',
    criteria: { officialTestPassed: true },
    pointsAwarded: 500,
    rarityLevel: 'legendary',
  },
];

/**
 * Seed Forum Categories
 * Community discussion categories
 */
const forumCategoriesList = [
  {
    name: 'General Discussion',
    description: 'General driving theory discussions and questions',
    category: 'general_discussion' as const,
    icon: 'chat-bubble-left-right',
    color: '#3B82F6',
    displayOrder: 1,
  },
  {
    name: 'Theory Test Help',
    description: 'Help with specific theory test questions and explanations',
    category: 'theory_test_help' as const,
    icon: 'question-mark-circle',
    color: '#10B981',
    displayOrder: 2,
  },
  {
    name: 'Practical Test Tips',
    description: 'Practical driving test tips, techniques, and advice',
    category: 'practical_test_tips' as const,
    icon: 'eye',
    color: '#F59E0B',
    displayOrder: 3,
  },
  {
    name: 'Study Groups',
    description: 'Find and join study groups with other learners',
    category: 'study_groups' as const,
    icon: 'chart-bar',
    color: '#8B5CF6',
    displayOrder: 4,
  },
  {
    name: 'Driving Tips',
    description: 'General driving tips and road safety advice',
    category: 'driving_tips' as const,
    icon: 'light-bulb',
    color: '#EC4899',
    displayOrder: 5,
  },
  {
    name: 'Pass Stories',
    description: 'Share your test success stories and celebrate achievements',
    category: 'pass_stories' as const,
    icon: 'trophy',
    color: '#059669',
    displayOrder: 6,
  },
];

/**
 * Seed Course System
 * Essential driving courses with different skill levels
 */
const coursesList = [
  {
    title: 'Intensive Crash Course',
    description: 'Complete your driving lessons in just 1-2 weeks with our intensive program. Perfect for fast learners who want to get on the road quickly.',
    level: 'intermediate',
    duration: 120,
    price: '899.00',
    maxStudents: 1,
    transmissionType: 'manual' as const,
    isRecommended: true,
    isActive: true,
  },
  {
    title: 'Pass Plus Course',
    description: 'Advanced driving course for newly qualified drivers. Improve your skills in different driving conditions and potentially reduce insurance costs.',
    level: 'advanced',
    duration: 90,
    price: '299.00',
    maxStudents: 1,
    transmissionType: 'both' as const,
    isRecommended: false,
    isActive: true,
  },
  {
    title: 'Refresher Course',
    description: 'Perfect for drivers who haven\'t driven for a while or want to boost their confidence. Tailored lessons to get you back on the road safely.',
    level: 'intermediate',
    duration: 60,
    price: '199.00',
    maxStudents: 1,
    transmissionType: 'both' as const,
    isRecommended: false,
    isActive: true,
  },
  {
    title: 'Mock Test Preparation',
    description: 'Practice your driving test with our experienced instructors. Includes test route familiarization and detailed feedback on your performance.',
    level: 'advanced',
    duration: 75,
    price: '79.00',
    maxStudents: 1,
    transmissionType: 'manual' as const,
    isRecommended: true,
    isActive: true,
  },
];

/**
 * Main seeding function
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed UK Theory Categories
    console.log('📚 Seeding UK Theory Categories...');
    for (const category of theoryCategories) {
      await db.insert(ukTheoryCategories).values(category).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${theoryCategories.length} theory categories`);

    // Seed Achievements
    console.log('🏆 Seeding Achievement System...');
    for (const achievement of achievementsList) {
      await db.insert(achievements).values(achievement).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${achievementsList.length} achievements`);

    // Seed Forum Categories
    console.log('💬 Seeding Forum Categories...');
    for (const forumCategory of forumCategoriesList) {
      await db.insert(forumCategories).values(forumCategory).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${forumCategoriesList.length} forum categories`);

    // Seed Courses
    console.log('🚗 Seeding Driving Courses...');
    for (const course of coursesList) {
      await db.insert(courses).values(course).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${coursesList.length} driving courses`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Seeding Summary:
- ${theoryCategories.length} UK DVSA Theory Categories
- ${achievementsList.length} Achievement Types
- ${forumCategoriesList.length} Forum Categories
- ${coursesList.length} Driving Courses

🚀 Your UK Driving Platform is ready for development!
    `);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };