const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { ukTheoryCategories, ukTheoryQuestions, achievements } = require('../lib/db/schema');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

// DVSA Theory Test Categories (using enum values from schema)
const categories = [
  {
    categoryCode: 'ALERTNESS',
    categoryName: 'Alertness',
    description: 'Being aware of hazards and maintaining concentration while driving',
    totalQuestions: 50,
    passRequirement: 4,
    displayOrder: 1,
    isActive: true
  },
  {
    categoryCode: 'ATTITUDE',
    categoryName: 'Attitude',
    description: 'Showing consideration and courtesy to other road users',
    totalQuestions: 45,
    passRequirement: 4,
    displayOrder: 2,
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    categoryName: 'Safety and Your Vehicle',
    description: 'Vehicle safety checks, fault recognition, and maintenance',
    totalQuestions: 55,
    passRequirement: 4,
    displayOrder: 3,
    isActive: true
  },
  {
    categoryCode: 'HAZARD_AWARENESS',
    categoryName: 'Hazard Awareness',
    description: 'Recognizing and responding to potential hazards',
    totalQuestions: 60,
    passRequirement: 5,
    displayOrder: 4,
    isActive: true
  },
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    categoryName: 'Vulnerable Road Users',
    description: 'Sharing the road safely with pedestrians, cyclists, and motorcyclists',
    totalQuestions: 48,
    passRequirement: 4,
    displayOrder: 5,
    isActive: true
  },
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    categoryName: 'Other Types of Vehicle',
    description: 'Understanding the characteristics of different vehicle types',
    totalQuestions: 42,
    passRequirement: 4,
    displayOrder: 6,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_HANDLING',
    categoryName: 'Vehicle Handling',
    description: 'Safe vehicle control in various conditions',
    totalQuestions: 38,
    passRequirement: 3,
    displayOrder: 7,
    isActive: true
  },
  {
    categoryCode: 'MOTORWAY_RULES',
    categoryName: 'Motorway Rules',
    description: 'Safe driving on motorways and dual carriageways',
    totalQuestions: 35,
    passRequirement: 3,
    displayOrder: 8,
    isActive: true
  },
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    categoryName: 'Rules of the Road',
    description: 'Traffic signs, road markings, and traffic regulations',
    totalQuestions: 52,
    passRequirement: 4,
    displayOrder: 9,
    isActive: true
  },
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    categoryName: 'Road and Traffic Signs',
    description: 'Understanding and responding to road signs and signals',
    totalQuestions: 58,
    passRequirement: 5,
    displayOrder: 10,
    isActive: true
  },
  {
    categoryCode: 'DOCUMENTS',
    categoryName: 'Documents',
    description: 'Legal requirements for driving licenses and vehicle documents',
    totalQuestions: 28,
    passRequirement: 2,
    displayOrder: 11,
    isActive: true
  },
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    categoryName: 'Incidents, Accidents and Emergencies',
    description: 'What to do in emergency situations and at accident scenes',
    totalQuestions: 44,
    passRequirement: 4,
    displayOrder: 12,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_LOADING',
    categoryName: 'Vehicle Loading',
    description: 'Safe loading and securing of passengers and cargo',
    totalQuestions: 25,
    passRequirement: 2,
    displayOrder: 13,
    isActive: true
  },
  {
    categoryCode: 'SAFETY_MARGINS',
    categoryName: 'Safety Margins and Environment',
    description: 'Reducing environmental impact and maintaining safe distances',
    totalQuestions: 30,
    passRequirement: 3,
    displayOrder: 14,
    isActive: true
  },
  {
    categoryCode: 'VEHICLE_SAFETY',
    categoryName: 'Vehicle Safety',
    description: 'Understanding braking distances and vehicle safety systems',
    totalQuestions: 20,
    passRequirement: 2,
    displayOrder: 15,
    isActive: true
  }
];

// Sample DVSA Theory Questions (representative examples from each category)
const sampleQuestions = [
  // Alertness Questions
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What should you do when you feel tired while driving?',
    optionA: 'Turn up the radio',
    optionB: 'Open the windows',
    optionC: 'Stop and rest',
    optionD: 'Drink coffee',
    correctAnswer: 'C',
    explanation: 'When you feel tired, the safest thing to do is to stop and rest. No amount of fresh air or stimulants can substitute for proper rest.',
    officialReference: 'HC Rule 91',
    isActive: true
  },
  {
    categoryCode: 'ALERTNESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You are driving at night and are dazzled by the headlights of an oncoming vehicle. What should you do?',
    optionA: 'Flash your headlights',
    optionB: 'Slow down and look to the left',
    optionC: 'Close one eye',
    optionD: 'Brake hard',
    correctAnswer: 'B',
    explanation: 'When dazzled by oncoming headlights, slow down and look to the left side of the road to maintain your path while your eyes readjust.',
    officialReference: 'HC Rule 115',
    isActive: true
  },

  // Attitude Questions
  {
    categoryCode: 'ATTITUDE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'A driver pulls out of a side road in front of you. They clearly have not seen you. What should you do?',
    optionA: 'Flash your lights and sound your horn',
    optionB: 'Overtake as soon as possible',
    optionC: 'Drop back to regain a safe separation distance',
    optionD: 'Drive close behind and flash your lights',
    correctAnswer: 'C',
    explanation: 'The safest response is to drop back and regain a safe following distance. This shows consideration and reduces the risk of an accident.',
    officialReference: 'HC Rule 126',
    isActive: true
  },

  // Safety and Your Vehicle
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'How often should you check your engine oil level?',
    optionA: 'Before every journey',
    optionB: 'Weekly',
    optionC: 'Monthly',
    optionD: 'Every 6 months',
    correctAnswer: 'B',
    explanation: 'You should check your engine oil level at least weekly, and always before long journeys.',
    officialReference: 'HC Rule 89',
    isActive: true
  },
  {
    categoryCode: 'SAFETY_AND_YOUR_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'What is the legal minimum tread depth for car tyres?',
    optionA: '1.6mm',
    optionB: '2.0mm',
    optionC: '2.5mm',
    optionD: '3.0mm',
    correctAnswer: 'A',
    explanation: 'The legal minimum tread depth for car tyres is 1.6mm across the central three-quarters of the tyre width.',
    officialReference: 'Road Traffic Act',
    isActive: true
  },

  // Hazard Awareness
  {
    categoryCode: 'HAZARD_AWARENESS',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'You see a ball bouncing out from behind a parked car. What should you do?',
    optionA: 'Continue at the same speed',
    optionB: 'Slow down and be prepared to stop',
    optionC: 'Swerve around the ball',
    optionD: 'Sound your horn',
    correctAnswer: 'B',
    explanation: 'A ball bouncing into the road often means a child may follow. Slow down and be prepared to stop immediately.',
    officialReference: 'HC Rule 206',
    isActive: true
  },

  // Vulnerable Road Users
  {
    categoryCode: 'VULNERABLE_ROAD_USERS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'You are approaching a roundabout. A cyclist is signalling to turn right. What should you do?',
    optionA: 'Overtake on the left',
    optionB: 'Give the cyclist plenty of room',
    optionC: 'Sound your horn',
    optionD: 'Assume the cyclist will give way',
    correctAnswer: 'B',
    explanation: 'Give cyclists plenty of room, especially when they are turning right at roundabouts. They may need to position themselves towards the centre of the lane.',
    officialReference: 'HC Rule 187',
    isActive: true
  },

  // Other Types of Vehicle
  {
    categoryCode: 'OTHER_TYPES_OF_VEHICLE',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'Why should you be especially careful when overtaking a large goods vehicle?',
    optionA: 'They are faster than they look',
    optionB: 'They have larger blind spots',
    optionC: 'They always indicate late',
    optionD: 'They brake more quickly',
    correctAnswer: 'B',
    explanation: 'Large goods vehicles have extensive blind spots where the driver cannot see other vehicles. Always ensure you can be seen before overtaking.',
    officialReference: 'HC Rule 164',
    isActive: true
  },

  // Vehicle Handling
  {
    categoryCode: 'VEHICLE_HANDLING',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'In icy conditions, how should you brake?',
    optionA: 'Firmly and quickly',
    optionB: 'Gently and progressively',
    optionC: 'By pumping the brakes',
    optionD: 'Use the handbrake only',
    correctAnswer: 'B',
    explanation: 'In icy conditions, brake gently and progressively to avoid skidding. Sudden braking can cause loss of control.',
    officialReference: 'HC Rule 231',
    isActive: true
  },

  // Motorway Rules
  {
    categoryCode: 'MOTORWAY_RULES',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What is the national speed limit for cars on a motorway?',
    optionA: '60 mph',
    optionB: '70 mph',
    optionC: '80 mph',
    optionD: '90 mph',
    correctAnswer: 'B',
    explanation: 'The national speed limit for cars on motorways is 70 mph, unless signs indicate otherwise.',
    officialReference: 'HC Rule 261',
    isActive: true
  },

  // Rules of the Road
  {
    categoryCode: 'RULES_OF_THE_ROAD',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does a solid white line along the centre of the road mean?',
    optionA: 'You may overtake if safe',
    optionB: 'No overtaking',
    optionC: 'Overtake only if no oncoming traffic',
    optionD: 'Two-way traffic',
    correctAnswer: 'B',
    explanation: 'A solid white line along the centre of the road means you must not cross or straddle it unless entering a side road or passing a stationary vehicle.',
    officialReference: 'HC Rule 128',
    isActive: true
  },

  // Road and Traffic Signs
  {
    categoryCode: 'ROAD_AND_TRAFFIC_SIGNS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'What does a circular sign with a red border mean?',
    optionA: 'Warning',
    optionB: 'Information',
    optionC: 'Prohibition or restriction',
    optionD: 'Mandatory',
    correctAnswer: 'C',
    explanation: 'Circular signs with red borders indicate prohibitions or restrictions - things you must not do.',
    officialReference: 'HC Signs',
    isActive: true
  },

  // Documents
  {
    categoryCode: 'DOCUMENTS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'For how long is a provisional driving licence valid?',
    optionA: '1 year',
    optionB: '5 years',
    optionC: '10 years',
    optionD: '15 years',
    correctAnswer: 'C',
    explanation: 'A provisional driving licence is valid for 10 years from the date of issue.',
    officialReference: 'DVLA Guidelines',
    isActive: true
  },

  // Incidents, Accidents and Emergencies
  {
    categoryCode: 'INCIDENTS_ACCIDENTS_EMERGENCIES',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'At the scene of an accident, what is your first priority?',
    optionA: 'Get the traffic moving',
    optionB: 'Take photos for insurance',
    optionC: 'Ensure the safety of everyone',
    optionD: 'Clear the vehicles from the road',
    correctAnswer: 'C',
    explanation: 'Your first priority at any accident scene is to ensure the safety of everyone involved. This includes making the area safe and calling emergency services if needed.',
    officialReference: 'HC Rule 283',
    isActive: true
  },

  // Vehicle Loading
  {
    categoryCode: 'VEHICLE_LOADING',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'When loading your vehicle, where should you place the heaviest items?',
    optionA: 'On the roof',
    optionB: 'In the boot',
    optionC: 'On the back seat',
    optionD: 'As low as possible',
    correctAnswer: 'D',
    explanation: 'Heavy items should be placed as low as possible in the vehicle to keep the centre of gravity low and maintain stability.',
    officialReference: 'HC Rule 98',
    isActive: true
  },

  // Safety Margins
  {
    categoryCode: 'SAFETY_MARGINS',
    questionType: 'multiple_choice',
    difficultyLevel: 'foundation',
    questionText: 'How can you reduce fuel consumption while driving?',
    optionA: 'Accelerate quickly',
    optionB: 'Drive at higher speeds',
    optionC: 'Plan your route',
    optionD: 'Use air conditioning continuously',
    correctAnswer: 'C',
    explanation: 'Planning your route helps reduce fuel consumption by avoiding traffic jams and finding the most efficient path to your destination.',
    officialReference: 'HC Rule 123',
    isActive: true
  },

  // Vehicle Safety
  {
    categoryCode: 'VEHICLE_SAFETY',
    questionType: 'multiple_choice',
    difficultyLevel: 'intermediate',
    questionText: 'What is the typical stopping distance at 70 mph in good conditions?',
    optionA: '53 metres (175 feet)',
    optionB: '73 metres (240 feet)',
    optionC: '96 metres (315 feet)',
    optionD: '120 metres (394 feet)',
    correctAnswer: 'C',
    explanation: 'At 70 mph, the typical stopping distance is 96 metres (315 feet). This includes thinking distance of 21 metres and braking distance of 75 metres.',
    officialReference: 'HC Rule 126',
    isActive: true
  }
];

// Gamification achievements for theory test system (matching actual database schema)
const theoryAchievements = [
  {
    name: 'Theory First Steps',
    description: 'Complete your first theory practice session',
    achievementType: 'milestone',
    icon: '🎯',
    badgeColor: '#10B981',
    criteria: { type: 'sessions_completed', threshold: 1 },
    pointsAwarded: 10,
    isActive: true,
    rarityLevel: 'common'
  },
  {
    name: 'Perfect Theory Score',
    description: 'Achieve 100% in any practice session',
    achievementType: 'score',
    icon: '⭐',
    badgeColor: '#F59E0B',
    criteria: { type: 'perfect_score', threshold: 100 },
    pointsAwarded: 50,
    isActive: true,
    rarityLevel: 'rare'
  },
  {
    name: 'Theory Streak Master',
    description: 'Answer 10 questions correctly in a row',
    achievementType: 'streak',
    icon: '🔥',
    badgeColor: '#3B82F6',
    criteria: { type: 'correct_streak', threshold: 10 },
    pointsAwarded: 25,
    isActive: true,
    rarityLevel: 'common'
  },
  {
    name: 'Theory Category Expert',
    description: 'Master all questions in any category (90%+ average)',
    achievementType: 'mastery',
    icon: '🏆',
    badgeColor: '#8B5CF6',
    criteria: { type: 'category_mastery', threshold: 90 },
    pointsAwarded: 100,
    isActive: true,
    rarityLevel: 'epic'
  },
  {
    name: 'Theory Speed Demon',
    description: 'Complete a practice session in under 5 minutes',
    achievementType: 'speed',
    icon: '⚡',
    badgeColor: '#EF4444',
    criteria: { type: 'completion_time', threshold: 300 },
    pointsAwarded: 30,
    isActive: true,
    rarityLevel: 'rare'
  },
  {
    name: 'Theory Dedicated Learner',
    description: 'Complete theory practice for 7 consecutive days',
    achievementType: 'consistency',
    icon: '📚',
    badgeColor: '#F97316',
    criteria: { type: 'daily_streak', threshold: 7 },
    pointsAwarded: 75,
    isActive: true,
    rarityLevel: 'epic'
  },
  {
    name: 'Theory Master',
    description: 'Complete 100 practice sessions',
    achievementType: 'milestone',
    icon: '👑',
    badgeColor: '#6366F1',
    criteria: { type: 'sessions_completed', threshold: 100 },
    pointsAwarded: 200,
    isActive: true,
    rarityLevel: 'legendary'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting DVSA Theory Test database seeding...');
    
    // Check existing categories
    console.log('📚 Checking existing theory test categories...');
    const existingCategories = await db.select().from(ukTheoryCategories);
    console.log(`Found ${existingCategories.length} existing categories`);
    
    let categoryMap = {};
    
    if (existingCategories.length === 0) {
      // Insert categories only if none exist
      console.log('� Seeding theory test categories...');
      const insertedCategories = await db.insert(ukTheoryCategories).values(categories).returning();
      console.log(`✅ Successfully seeded ${insertedCategories.length} categories`);
      
      // Create category map from newly inserted categories
      insertedCategories.forEach(cat => {
        categoryMap[cat.categoryCode] = cat.id;
      });
    } else {
      // Use existing categories
      console.log('📋 Using existing categories...');
      existingCategories.forEach(cat => {
        categoryMap[cat.categoryCode] = cat.id;
      });
    }
    
    // Check existing questions
    console.log('❓ Checking existing theory test questions...');
    const existingQuestions = await db.select().from(ukTheoryQuestions);
    console.log(`Found ${existingQuestions.length} existing questions`);
    
    if (existingQuestions.length === 0) {
      // Insert questions with proper category IDs
      console.log('💾 Seeding theory test questions...');
      const questionsWithCategoryIds = sampleQuestions.map(question => ({
        ...question,
        categoryId: categoryMap[question.categoryCode]
      }));
      
      const insertedQuestions = await db.insert(ukTheoryQuestions).values(questionsWithCategoryIds).returning();
      console.log(`✅ Successfully seeded ${insertedQuestions.length} sample questions`);
    } else {
      console.log('📋 Questions already exist, skipping...');
    }
    
    // Check existing achievements
    console.log('🏆 Checking existing achievements...');
    try {
      const existingAchievements = await db.select().from(achievements);
      console.log(`Found ${existingAchievements.length} existing achievements`);
    } catch (error) {
      console.log('⚠️ Could not check achievements (table might not match schema), continuing...');
      console.log('🎉 Theory test system is ready without achievements!');
      console.log(`
      📊 Final Summary:
      - ${Object.keys(categoryMap).length} Theory Categories available
      - 17 Sample questions ready for practice
      
      🚀 Your DVSA Theory Test system is now ready!
      - Visit /theory to start practicing
      - Visit /admin/theory to manage questions
      `);
      return;
    }
    
    if (existingAchievements.length === 0) {
      // Insert achievements
      console.log('💾 Seeding theory test achievements...');
      const insertedAchievements = await db.insert(achievements).values(theoryAchievements).returning();
      console.log(`✅ Successfully seeded ${insertedAchievements.length} achievements`);
    } else {
      console.log('📋 Achievements already exist, skipping...');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`
    📊 Final Summary:
    - ${Object.keys(categoryMap).length} Theory Categories available
    - Questions and achievements ready for use
    
    🚀 Your DVSA Theory Test system is now ready!
    - Visit /theory to start practicing
    - Visit /admin/theory to manage questions
    `);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seeding
seedDatabase().catch(console.error);