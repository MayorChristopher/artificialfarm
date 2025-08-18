-- Create lesson_progress table for tracking individual lesson completion
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for lesson_progress
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

-- Create trigger for updated_at
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample lesson progress data
INSERT INTO public.lesson_progress (user_id, course_id, lesson_id, lesson_title, completed, completion_date, time_spent, score)
SELECT 
    '0db95048-efdb-4249-9e3e-c906e17c4b63'::uuid,
    '6d1d89db-e25d-455d-8a1d-aeb4ddd38e5e'::uuid,
    'lesson-' || generate_series(1, 5),
    'Lesson ' || generate_series(1, 5) || ': Introduction to Smart Farming',
    CASE WHEN generate_series(1, 5) <= 2 THEN true ELSE false END,
    CASE WHEN generate_series(1, 5) <= 2 THEN NOW() - INTERVAL '1 day' * generate_series(1, 5) ELSE NULL END,
    30 + (generate_series(1, 5) * 10),
    CASE WHEN generate_series(1, 5) <= 2 THEN 85 + (generate_series(1, 5) * 5) ELSE 0 END
WHERE NOT EXISTS (
    SELECT 1 FROM public.lesson_progress 
    WHERE user_id = '0db95048-efdb-4249-9e3e-c906e17c4b63'::uuid 
    AND course_id = '6d1d89db-e25d-455d-8a1d-aeb4ddd38e5e'::uuid
);