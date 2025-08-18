-- Fix Supabase setup for lesson progress tracking
-- Run this in your Supabase SQL editor

-- 1. Create lesson_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    lesson_title TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- in minutes
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    watched_percentage INTEGER DEFAULT 0 CHECK (watched_percentage >= 0 AND watched_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for lesson_progress
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can insert their own lesson progress" ON public.lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

-- 4. Create trigger for updated_at (if function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON public.lesson_progress;
        CREATE TRIGGER update_lesson_progress_updated_at 
            BEFORE UPDATE ON public.lesson_progress
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 5. Add watched_percentage column to course_enrollments if it doesn't exist
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS current_lesson_id TEXT;

-- 6. Insert sample lesson progress data for testing
INSERT INTO public.lesson_progress (user_id, course_id, lesson_id, lesson_title, completed, completion_date, time_spent, score, watched_percentage)
SELECT 
    auth.uid(),
    ce.course_id,
    'lesson-' || s.num,
    'Lesson ' || s.num || ': Introduction to Smart Farming',
    CASE WHEN s.num <= 2 THEN true ELSE false END,
    CASE WHEN s.num <= 2 THEN NOW() - INTERVAL '1 day' * s.num ELSE NULL END,
    30 + (s.num * 10),
    CASE WHEN s.num <= 2 THEN 85 + (s.num * 5) ELSE 0 END,
    CASE WHEN s.num <= 2 THEN 100 ELSE s.num * 20 END
FROM public.course_enrollments ce
CROSS JOIN generate_series(1, 5) AS s(num)
WHERE ce.user_id = auth.uid()
AND NOT EXISTS (
    SELECT 1 FROM public.lesson_progress 
    WHERE user_id = auth.uid() 
    AND course_id = ce.course_id
)
LIMIT 5;