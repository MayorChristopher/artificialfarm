-- Database Cleanup and Optimization Script
-- This script removes dummy data and optimizes the database structure

-- 1. Clean up dummy/test data from courses table
DELETE FROM public.courses 
WHERE title LIKE '%Test%' 
   OR title LIKE '%Demo%' 
   OR title LIKE '%Sample%'
   OR description LIKE '%dummy%'
   OR description LIKE '%test%';

-- 2. Clean up any invalid lesson progress entries
DELETE FROM public.lesson_progress 
WHERE watched_percentage < 0 
   OR watched_percentage > 100
   OR current_time < 0;

-- 3. Clean up orphaned lesson progress (lessons that don't exist)
DELETE FROM public.lesson_progress 
WHERE lesson_id NOT IN (SELECT id FROM public.lessons);

-- 4. Clean up orphaned course enrollments
DELETE FROM public.course_enrollments 
WHERE course_id NOT IN (SELECT id FROM public.courses);

-- 5. Reset any corrupted progress data
UPDATE public.lesson_progress 
SET watched_percentage = 0, current_time = 0 
WHERE watched_percentage IS NULL OR current_time IS NULL;

-- 6. Clean up invalid video URLs
UPDATE public.lessons 
SET video_url = NULL 
WHERE video_url = '' 
   OR video_url LIKE '%example.com%'
   OR video_url LIKE '%placeholder%'
   OR video_url LIKE '%dummy%';

-- 7. Optimize lesson_progress table structure
ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS lesson_title TEXT,
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS completion_date TIMESTAMPTZ;

-- 8. Update completion status based on watched percentage
UPDATE public.lesson_progress 
SET completed = (watched_percentage >= 80),
    completion_date = CASE 
        WHEN watched_percentage >= 80 AND completion_date IS NULL 
        THEN updated_at 
        ELSE completion_date 
    END;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course 
ON public.lesson_progress(user_id, course_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson 
ON public.lesson_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user 
ON public.course_enrollments(user_id);

-- 10. Add constraints to prevent data corruption
ALTER TABLE public.lesson_progress 
ADD CONSTRAINT check_watched_percentage 
CHECK (watched_percentage >= 0 AND watched_percentage <= 100);

ALTER TABLE public.lesson_progress 
ADD CONSTRAINT check_current_time 
CHECK (current_time >= 0);

-- 11. Clean up user profiles with invalid data
UPDATE public.profiles 
SET phone = NULL 
WHERE phone = '' OR phone = 'N/A' OR phone LIKE '%test%';

-- 12. Remove test users (keep only real users)
DELETE FROM auth.users 
WHERE email LIKE '%test%@%' 
   OR email LIKE '%demo%@%' 
   OR email LIKE '%example%@%';

-- 13. Verify data integrity
SELECT 
    'Courses' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) as valid_titles
FROM public.courses
UNION ALL
SELECT 
    'Lessons' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN video_url IS NOT NULL AND video_url != '' THEN 1 END) as valid_videos
FROM public.lessons
UNION ALL
SELECT 
    'Lesson Progress' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN watched_percentage BETWEEN 0 AND 100 THEN 1 END) as valid_progress
FROM public.lesson_progress;

-- 14. Create a view for clean course data
CREATE OR REPLACE VIEW public.clean_courses AS
SELECT 
    c.*,
    COUNT(l.id) as lesson_count,
    COUNT(ce.id) as enrollment_count
FROM public.courses c
LEFT JOIN public.lessons l ON c.id = l.course_id
LEFT JOIN public.course_enrollments ce ON c.id = ce.course_id
WHERE c.title IS NOT NULL 
  AND c.title != ''
  AND c.description IS NOT NULL
GROUP BY c.id;

-- 15. Create a function to maintain data integrity
CREATE OR REPLACE FUNCTION maintain_lesson_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure watched_percentage is within valid range
    NEW.watched_percentage := GREATEST(0, LEAST(100, NEW.watched_percentage));
    
    -- Ensure current_time is not negative
    NEW.current_time := GREATEST(0, NEW.current_time);
    
    -- Auto-set completion status
    NEW.completed := (NEW.watched_percentage >= 80);
    
    -- Set completion date if just completed
    IF NEW.completed AND OLD.completed IS FALSE THEN
        NEW.completion_date := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the function
DROP TRIGGER IF EXISTS trigger_maintain_lesson_progress ON public.lesson_progress;
CREATE TRIGGER trigger_maintain_lesson_progress
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION maintain_lesson_progress();

-- 16. Final verification query
SELECT 
    'Database Cleanup Complete' as status,
    (SELECT COUNT(*) FROM public.courses WHERE title IS NOT NULL) as clean_courses,
    (SELECT COUNT(*) FROM public.lessons WHERE video_url IS NOT NULL) as lessons_with_videos,
    (SELECT COUNT(*) FROM public.lesson_progress WHERE watched_percentage BETWEEN 0 AND 100) as valid_progress_records;