-- Test Chatbot SQL Setup
-- Run this in your Supabase SQL editor to verify everything is working

-- 1. Check if all required tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('courses', 'success_stories', 'testimonials', 'course_enrollments', 'lesson_progress', 'ai_conversations', 'ai_patterns') 
        THEN '✅ Required for chatbot'
        ELSE '📋 Other table'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check courses table structure and sample data
SELECT 'Courses Table Check' as test_name;
SELECT COUNT(*) as total_courses FROM courses;
SELECT id, title, category, difficulty_level FROM courses LIMIT 3;

-- 3. Check success stories table
SELECT 'Success Stories Table Check' as test_name;
SELECT COUNT(*) as total_stories FROM success_stories;
SELECT id, title, description FROM success_stories LIMIT 2;

-- 4. Check if testimonials table exists (might be missing)
SELECT 'Testimonials Table Check' as test_name;
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'testimonials') THEN
        RAISE NOTICE 'Testimonials table exists';
    ELSE
        RAISE NOTICE 'Testimonials table is MISSING - this might cause chatbot issues';
    END IF;
END $$;

-- 5. Check AI learning tables
SELECT 'AI Learning Tables Check' as test_name;
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_conversations') 
        THEN 'ai_conversations: ✅ EXISTS'
        ELSE 'ai_conversations: ❌ MISSING'
    END as ai_conversations_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_patterns') 
        THEN 'ai_patterns: ✅ EXISTS'
        ELSE 'ai_patterns: ❌ MISSING'
    END as ai_patterns_status;

-- 6. Test a sample chatbot query (what the chatbot service does)
SELECT 'Sample Chatbot Query Test' as test_name;
SELECT 
    c.id, 
    c.title, 
    c.description, 
    c.category, 
    c.difficulty_level
FROM courses c 
WHERE c.is_published = true 
LIMIT 5;

-- 7. Check for any missing columns that might cause errors
SELECT 'Column Check' as test_name;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'courses' 
    AND column_name IN ('difficulty_level', 'is_published', 'category')
ORDER BY column_name;