-- Verify Progress Synchronization Script
-- Run this to check if progress tracking is working properly

-- 1. Check lesson_progress table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;

-- 2. Check current lesson progress data
SELECT 
    lp.user_id,
    lp.course_id,
    lp.lesson_id,
    lp.lesson_title,
    lp.watched_percentage,
    lp.completed,
    lp.updated_at,
    c.title as course_title
FROM public.lesson_progress lp
LEFT JOIN public.courses c ON lp.course_id = c.id
ORDER BY lp.updated_at DESC
LIMIT 20;

-- 3. Check course enrollment progress sync
SELECT 
    ce.user_id,
    ce.course_id,
    ce.progress as enrollment_progress,
    ce.last_accessed,
    c.title as course_title,
    COUNT(lp.lesson_id) as total_lessons_tracked,
    COUNT(CASE WHEN lp.watched_percentage >= 80 THEN 1 END) as completed_lessons,
    ROUND(AVG(lp.watched_percentage), 2) as avg_watch_percentage
FROM public.course_enrollments ce
LEFT JOIN public.courses c ON ce.course_id = c.id
LEFT JOIN public.lesson_progress lp ON ce.course_id = lp.course_id AND ce.user_id = lp.user_id
GROUP BY ce.user_id, ce.course_id, ce.progress, ce.last_accessed, c.title
ORDER BY ce.last_accessed DESC;

-- 4. Check for any progress inconsistencies
SELECT 
    ce.course_id,
    c.title as course_title,
    ce.progress as enrollment_progress,
    ROUND((COUNT(CASE WHEN lp.watched_percentage >= 80 THEN 1 END) * 100.0 / NULLIF(COUNT(lp.lesson_id), 0)), 0) as calculated_progress,
    CASE 
        WHEN ce.progress != ROUND((COUNT(CASE WHEN lp.watched_percentage >= 80 THEN 1 END) * 100.0 / NULLIF(COUNT(lp.lesson_id), 0)), 0) 
        THEN 'INCONSISTENT'
        ELSE 'CONSISTENT'
    END as sync_status
FROM public.course_enrollments ce
LEFT JOIN public.courses c ON ce.course_id = c.id
LEFT JOIN public.lesson_progress lp ON ce.course_id = lp.course_id AND ce.user_id = lp.user_id
GROUP BY ce.course_id, c.title, ce.progress
HAVING COUNT(lp.lesson_id) > 0;

-- 5. Show recent video progress updates (last 24 hours)
SELECT 
    lp.lesson_title,
    lp.watched_percentage,
    lp.updated_at,
    c.title as course_title,
    EXTRACT(EPOCH FROM (NOW() - lp.updated_at))/60 as minutes_ago
FROM public.lesson_progress lp
LEFT JOIN public.courses c ON lp.course_id = c.id
WHERE lp.updated_at > NOW() - INTERVAL '24 hours'
ORDER BY lp.updated_at DESC;