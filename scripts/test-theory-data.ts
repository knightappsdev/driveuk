import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ukTheoryCategories, ukTheoryQuestions } from '../lib/db/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function testTheoryData() {
  try {
    console.log('🧪 Testing Theory Database Data...\n');
    
    // Get all categories
    const categories = await db.select().from(ukTheoryCategories);
    console.log(`✅ Found ${categories.length} theory categories:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.categoryName} (${cat.categoryCode}) - ${cat.totalQuestions} questions expected`);
    });
    
    console.log('\n');
    
    // Get all questions
    const questions = await db.select().from(ukTheoryQuestions);
    console.log(`✅ Found ${questions.length} theory questions:`);
    
    // Group questions by category
    const questionsByCategory: Record<string, number> = {};
    questions.forEach(q => {
      const category = categories.find(c => c.id === q.categoryId);
      if (category) {
        questionsByCategory[category.categoryCode] = (questionsByCategory[category.categoryCode] || 0) + 1;
      }
    });
    
    console.log('\n📊 Questions per category:');
    Object.entries(questionsByCategory).forEach(([code, count]) => {
      const category = categories.find(c => c.categoryCode === code);
      console.log(`   - ${category?.categoryName}: ${count} questions`);
    });
    
    // Show sample questions
    console.log('\n📝 Sample questions:');
    questions.slice(0, 3).forEach((q, i) => {
      const category = categories.find(c => c.id === q.categoryId);
      console.log(`   ${i + 1}. [${category?.categoryCode}] ${q.questionText}`);
      console.log(`      Answer: ${q.correctAnswer} - ${q.explanation}`);
      console.log('');
    });
    
    console.log('✅ Theory database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing theory data:', error);
  } finally {
    await client.end();
  }
}

testTheoryData().catch(console.error);