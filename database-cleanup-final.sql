-- Comprehensive Database Cleanup and Structure Optimization
-- This script removes dummy data and ensures proper database structure

-- 1. Clean up any test/dummy data (keep only essential structure)
DELETE FROM public.lesson_progress WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%dummy%'
);

DELETE FROM public.course_enrollments WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%dummy%'
);

-- 2. Update lesson_progress table structure to handle text lesson_id
ALTER TABLE public.lesson_progress 
DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;

-- Change lesson_id to text to handle string identifiers
ALTER TABLE public.lesson_progress 
ALTER COLUMN lesson_id TYPE text;

-- Add watched_percentage and current_time columns if they don't exist
ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS watched_percentage integer DEFAULT 0 CHECK (watched_percentage >= 0 AND watched_percentage <= 100);

ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS current_time numeric DEFAULT 0;

ALTER TABLE public.lesson_progress 
ADD COLUMN IF NOT EXISTS video_duration numeric DEFAULT 0;

-- 3. Ensure proper RLS policies
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON public.lesson_progress;

CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can insert their own lesson progress" ON public.lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

-- 4. Clean up courses table - remove dummy courses, keep only real ones
DELETE FROM public.courses WHERE title LIKE '%Test%' OR title LIKE '%Dummy%' OR title LIKE '%Sample%';

-- 5. Ensure courses have proper structure
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'Beginner';

ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;

ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- 6. Update course_enrollments table
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS current_lesson_id text;

ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS hours_spent numeric DEFAULT 0;

ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON public.lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON public.lesson_progress(completed);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- 8. Create a function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id uuid, p_course_id uuid)
RETURNS TABLE(
    total_lessons integer,
    completed_lessons integer,
    progress_percentage integer,
    total_time_spent integer,
    average_score numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::integer as total_lessons,
        COUNT(CASE WHEN completed = true THEN 1 END)::integer as completed_lessons,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(CASE WHEN completed = true THEN 1 END)::numeric / COUNT(*)::numeric) * 100)::integer
            ELSE 0
        END as progress_percentage,
        COALESCE(SUM(time_spent), 0)::integer as total_time_spent,
        COALESCE(AVG(CASE WHEN score > 0 THEN score END), 0) as average_score
    FROM public.lesson_progress 
    WHERE user_id = p_user_id AND course_id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create a function to update course enrollment progress
CREATE OR REPLACE FUNCTION update_course_enrollment_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the course enrollment progress when lesson progress changes
    UPDATE public.course_enrollments 
    SET 
        progress = (
            SELECT progress_percentage 
            FROM calculate_course_progress(NEW.user_id, NEW.course_id)
        ),
        hours_spent = (
            SELECT ROUND(total_time_spent / 60.0, 1)
            FROM calculate_course_progress(NEW.user_id, NEW.course_id)
        ),
        score = (
            SELECT ROUND(average_score)
            FROM calculate_course_progress(NEW.user_id, NEW.course_id)
        ),
        last_accessed = NOW(),
        updated_at = NOW()
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to automatically update course progress
DROP TRIGGER IF EXISTS trigger_update_course_progress ON public.lesson_progress;
CREATE TRIGGER trigger_update_course_progress
    AFTER INSERT OR UPDATE ON public.lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_course_enrollment_progress();

-- 11. Clean up any orphaned records
DELETE FROM public.lesson_progress 
WHERE course_id NOT IN (SELECT id FROM public.courses);

DELETE FROM public.course_enrollments 
WHERE course_id NOT IN (SELECT id FROM public.courses);

-- 12. Ensure admin user exists (replace with actual admin email)
-- This should be done manually by the admin
-- INSERT INTO public.profiles (id, email, full_name, is_admin, created_at, updated_at)
-- SELECT id, email, 'Admin User', true, NOW(), NOW()
-- FROM auth.users 
-- WHERE email = 'admin@artificialfarm.com'
-- ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- 13. Create a view for course statistics
CREATE OR REPLACE VIEW course_statistics AS
SELECT 
    c.id,
    c.title,
    c.category,
    COUNT(DISTINCT ce.user_id) as enrolled_students,
    AVG(ce.progress) as average_progress,
    COUNT(CASE WHEN ce.progress >= 100 THEN 1 END) as completed_students,
    AVG(ce.score) as average_score
FROM public.courses c
LEFT JOIN public.course_enrollments ce ON c.id = ce.course_id
WHERE c.is_published = true
GROUP BY c.id, c.title, c.category;

-- 14. Grant necessary permissions
GRANT SELECT ON course_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_course_progress TO authenticated;

-- 15. Final cleanup - remove any remaining test data
UPDATE public.courses 
SET 
    students = (SELECT COUNT(*) FROM public.course_enrollments WHERE course_id = courses.id),
    updated_at = NOW()
WHERE students != (SELECT COUNT(*) FROM public.course_enrollments WHERE course_id = courses.id);

-- Success message
SELECT 'Database cleanup completed successfully!' as status;