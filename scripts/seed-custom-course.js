import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { customCourseSettings, customCourseSkills } from '../lib/db/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

// UK Practical Driving Skills as tested by DVSA
const ukPracticalSkills = [
  { skillId: 'mirrors', name: 'Mirror Usage', category: 'safety', description: 'Proper use of mirrors for observation', displayOrder: 1 },
  { skillId: 'signals', name: 'Signalling', category: 'safety', description: 'Correct timing and positioning of signals', displayOrder: 2 },
  { skillId: 'position', name: 'Road Position', category: 'control', description: 'Maintaining correct position on the road', displayOrder: 3 },
  { skillId: 'speed', name: 'Speed Control', category: 'control', description: 'Appropriate speed for conditions', displayOrder: 4 },
  { skillId: 'following', name: 'Following Distance', category: 'safety', description: 'Safe following distances', displayOrder: 5 },
  { skillId: 'progress', name: 'Making Progress', category: 'control', description: 'Driving at appropriate speed and making progress', displayOrder: 6 },
  { skillId: 'junctions', name: 'Junctions', category: 'manoeuvres', description: 'Approach, observation, and negotiation of junctions', displayOrder: 7 },
  { skillId: 'roundabouts', name: 'Roundabouts', category: 'manoeuvres', description: 'Safe navigation of roundabouts', displayOrder: 8 },
  { skillId: 'dual-carriageways', name: 'Dual Carriageways', category: 'manoeuvres', description: 'Joining and leaving dual carriageways', displayOrder: 9 },
  { skillId: 'pedestrian-crossings', name: 'Pedestrian Crossings', category: 'safety', description: 'Approach and behaviour at crossings', displayOrder: 10 },
  { skillId: 'vulnerable-users', name: 'Vulnerable Road Users', category: 'safety', description: 'Awareness of cyclists, pedestrians, motorcyclists', displayOrder: 11 },
  { skillId: 'independent-driving', name: 'Independent Driving', category: 'navigation', description: 'Following directions or sat nav', displayOrder: 12 },
  { skillId: 'parallel-parking', name: 'Parallel Parking', category: 'manoeuvres', description: 'Reversing into a parking space', displayOrder: 13 },
  { skillId: 'bay-parking', name: 'Bay Parking', category: 'manoeuvres', description: 'Forward or reverse bay parking', displayOrder: 14 },
  { skillId: 'pull-up-right', name: 'Pull Up on Right', category: 'manoeuvres', description: 'Pulling up on the right and reversing', displayOrder: 15 },
  { skillId: 'emergency-stop', name: 'Emergency Stop', category: 'safety', description: 'Stopping quickly and safely in an emergency', displayOrder: 16 },
  { skillId: 'hill-starts', name: 'Hill Starts', category: 'control', description: 'Starting on an uphill gradient', displayOrder: 17 },
  { skillId: 'clutch-control', name: 'Clutch Control', category: 'control', description: 'Smooth operation of clutch (manual cars)', displayOrder: 18 },
  { skillId: 'steering', name: 'Steering Control', category: 'control', description: 'Smooth and controlled steering', displayOrder: 19 },
  { skillId: 'hazard-awareness', name: 'Hazard Awareness', category: 'safety', description: 'Identifying and responding to hazards', displayOrder: 20 },
];

async function seedCustomCourse() {
  try {
    console.log('🚀 Starting custom course seeding...');

    // Insert default custom course settings
    console.log('📝 Creating custom course settings...');
    const settingsResult = await db
      .insert(customCourseSettings)
      .values({
        title: 'Custom Course',
        description: 'Build your personalized driving course with the skills you need most',
        hourlyRate: '30.00',
        minHours: 1,
        maxHours: 10,
        isActive: true,
        cardColor: 'orange',
        cardIcon: 'settings',
      })
      .onConflictDoNothing()
      .returning();

    if (settingsResult.length > 0) {
      console.log('✅ Custom course settings created');
    } else {
      console.log('ℹ️ Custom course settings already exist');
    }

    // Insert UK practical driving skills
    console.log('🎯 Creating driving skills...');
    let skillsCreated = 0;

    for (const skill of ukPracticalSkills) {
      try {
        const result = await db
          .insert(customCourseSkills)
          .values({
            skillId: skill.skillId,
            name: skill.name,
            category: skill.category,
            description: skill.description,
            isActive: true,
            displayOrder: skill.displayOrder,
          })
          .onConflictDoNothing()
          .returning();

        if (result.length > 0) {
          skillsCreated++;
        }
      } catch (error) {
        console.log(`⚠️ Skill ${skill.skillId} already exists or error occurred`);
      }
    }

    console.log(`✅ Created ${skillsCreated} new driving skills`);
    console.log(`📊 Total skills available: ${ukPracticalSkills.length}`);

    console.log('🎉 Custom course seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Custom course settings: ${settingsResult.length > 0 ? 'Created' : 'Already exists'}`);
    console.log(`- Driving skills created: ${skillsCreated}`);
    console.log(`- Total skills available: ${ukPracticalSkills.length}`);

  } catch (error) {
    console.error('❌ Error seeding custom course:', error);
  } finally {
    await client.end();
  }
}

// Run seeding
seedCustomCourse();