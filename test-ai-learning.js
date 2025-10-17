// Test AI Learning System
import { supabase } from './src/lib/supabase.js';
import { aiLearningService } from './src/lib/aiLearningService.js';

async function testAILearning() {
  console.log('🧠 Testing AI Learning System...\n');

  try {
    // 1. Test database connection
    console.log('1. Testing database connection...');
    const { data: patterns, error } = await supabase
      .from('ai_patterns')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    console.log('✅ Database connected, found', patterns?.length || 0, 'patterns');

    // 2. Test pattern creation
    console.log('\n2. Testing pattern creation...');
    await aiLearningService.savePatterns([{
      pattern_type: 'test_pattern',
      trigger: 'hello test',
      response: 'This is a test response',
      confidence: 0.9,
      usage_count: 1,
      last_used: new Date().toISOString()
    }]);
    console.log('✅ Test pattern created');

    // 3. Test pattern retrieval
    console.log('\n3. Testing pattern retrieval...');
    const learnedPatterns = await aiLearningService.getLearnedPatterns();
    console.log('✅ Retrieved', learnedPatterns.length, 'patterns');

    // 4. Test conversation logging
    console.log('\n4. Testing conversation logging...');
    await aiLearningService.logConversation(
      'test-user-id',
      'Hello, how are you?',
      'I am doing well, thank you!',
      { source: 'test', timestamp: new Date().toISOString() }
    );
    console.log('✅ Conversation logged');

    // 5. Test learning stats
    console.log('\n5. Testing learning statistics...');
    const stats = await aiLearningService.getLearningStats();
    console.log('✅ Learning Stats:', stats);

    // 6. Test improved response generation
    console.log('\n6. Testing improved response generation...');
    const improvedResponse = await aiLearningService.generateImprovedResponse(
      'hello test',
      { userName: 'TestUser', userId: 'test-user-id' },
      learnedPatterns
    );
    console.log('✅ Improved response:', improvedResponse || 'No pattern match found');

    console.log('\n🎉 AI Learning System is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAILearning();