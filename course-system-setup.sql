-- Course System Setup for Video Learning Platform
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    category TEXT,
    instructor TEXT,
    lessons INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    level TEXT DEFAULT 'Beginner',
    rating DECIMAL(3,2) DEFAULT 0,
    students INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'video',
    video_url TEXT,
    duration TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    watched_percentage INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(course_id);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

-- RLS Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);

-- RLS Policies for enrollments
CREATE POLICY "Users can view their enrollments" ON public.course_enrollments 
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create enrollments" ON public.course_enrollments 
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their enrollments" ON public.course_enrollments 
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for lesson progress
CREATE POLICY "Users can manage their progress" ON public.lesson_progress 
    FOR ALL USING (user_id = auth.uid());

-- Insert sample courses
INSERT INTO public.courses (id, title, description, duration, category, instructor, lessons, level, rating, students) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Introduction to Smart Farming', 'Learn the basics of modern agricultural technology and IoT applications in farming', '4 weeks', 'Technology', 'Dr. Sarah Johnson', 8, 'Beginner', 4.5, 150),
('550e8400-e29b-41d4-a716-446655440002', 'Sustainable Agriculture Practices', 'Master eco-friendly farming techniques and sustainable crop management', '6 weeks', 'Sustainability', 'Prof. Michael Chen', 12, 'Intermediate', 4.8, 89),
('550e8400-e29b-41d4-a716-446655440003', 'Precision Agriculture with Drones', 'Advanced course on using drone technology for crop monitoring and analysis', '8 weeks', 'Technology', 'Dr. Emily Rodriguez', 15, 'Advanced', 4.7, 67)
ON CONFLICT (id) DO NOTHING;

-- Insert sample lessons for Smart Farming course
INSERT INTO public.lessons (course_id, title, description, type, video_url, duration, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Welcome to Smart Farming', 'Introduction to the course and overview of smart farming concepts', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '15:30', 1),
('550e8400-e29b-41d4-a716-446655440001', 'IoT Sensors in Agriculture', 'Understanding different types of sensors used in modern farming', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '22:45', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Data Collection and Analysis', 'How to collect and interpret agricultural data', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '18:20', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Automated Irrigation Systems', 'Setting up and managing smart irrigation', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '25:10', 4)
ON CONFLICT DO NOTHING;

-- Insert sample lessons for Sustainable Agriculture course
INSERT INTO public.lessons (course_id, title, description, type, video_url, duration, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Principles of Sustainability', 'Core concepts of sustainable farming practices', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '20:15', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Soil Health Management', 'Maintaining and improving soil quality naturally', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', '28:30', 2),
('550e8400-e29b-41d4-a716-446655440002', 'Organic Pest Control', 'Natural methods for managing pests and diseases', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', '24:45', 3)
ON CONFLICT DO NOTHING;

-- Create function to update course progress based on lesson completion
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.course_enrollments 
    SET progress = (
        SELECT COALESCE(
            ROUND(
                (COUNT(CASE WHEN lp.watched_percentage >= 80 THEN 1 END) * 100.0) / 
                COUNT(l.id)
            ), 0
        )
        FROM public.lessons l
        LEFT JOIN public.lesson_progress lp ON l.id = lp.lesson_id 
            AND lp.user_id = NEW.user_id
        WHERE l.course_id = NEW.course_id
    ),
    updated_at = NOW()
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update course progress
CREATE TRIGGER trigger_update_course_progress
    AFTER INSERT OR UPDATE ON public.lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_course_progress();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT ALL ON public.course_enrollments TO authenticated;
GRANT ALL ON public.lesson_progress TO authenticated;