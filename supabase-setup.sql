-- Artificial Farm Academy & Consultants (AFAC) Database Setup
-- This script sets up all necessary tables and policies for the AFAC application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to existing tables if they don't exist
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE public.success_stories ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.journey_content ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'instructor')),
    is_admin BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    category TEXT,
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    content JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    score INTEGER DEFAULT 0,
    hours_spent INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create site statistics table
CREATE TABLE IF NOT EXISTS public.site_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farmers_trained INTEGER DEFAULT 0,
    certificates_issued INTEGER DEFAULT 0,
    yield_improvement INTEGER DEFAULT 0,
    sustainable_projects INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    active_courses INTEGER DEFAULT 0,
    consultations INTEGER DEFAULT 0,
    content_items INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create success stories table
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journey content table
CREATE TABLE IF NOT EXISTS public.journey_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    author TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Only admins can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Only admins can update courses" ON public.courses;
DROP POLICY IF EXISTS "Only admins can delete courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can enroll in courses" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Site stats are viewable by everyone" ON public.site_stats;
DROP POLICY IF EXISTS "Only admins can modify site stats" ON public.site_stats;
DROP POLICY IF EXISTS "Published success stories are viewable by everyone" ON public.success_stories;
DROP POLICY IF EXISTS "Only admins can manage success stories" ON public.success_stories;
DROP POLICY IF EXISTS "Published journey content is viewable by everyone" ON public.journey_content;
DROP POLICY IF EXISTS "Only admins can manage journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Anyone can create consultations" ON public.consultations;
DROP POLICY IF EXISTS "Only admins can update consultations" ON public.consultations;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (is_admin = true);

-- Courses policies
CREATE POLICY "Courses are viewable by everyone" ON public.courses
    FOR SELECT USING (is_published = true OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Only admins can insert courses" ON public.courses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can update courses" ON public.courses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can delete courses" ON public.courses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can enroll in courses" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

-- Site stats policies
CREATE POLICY "Site stats are viewable by everyone" ON public.site_stats
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify site stats" ON public.site_stats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Success stories policies
CREATE POLICY "Published success stories are viewable by everyone" ON public.success_stories
    FOR SELECT USING (is_published = true OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Only admins can manage success stories" ON public.success_stories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Journey content policies
CREATE POLICY "Published journey content is viewable by everyone" ON public.journey_content
    FOR SELECT USING (is_published = true OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Only admins can manage journey content" ON public.journey_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Consultations policies
CREATE POLICY "Users can view their own consultations" ON public.consultations
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Anyone can create consultations" ON public.consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update consultations" ON public.consultations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Insert initial site stats if not exists
INSERT INTO public.site_stats (farmers_trained, certificates_issued, yield_improvement, sustainable_projects)
SELECT 2500, 1800, 45, 320
WHERE NOT EXISTS (SELECT 1 FROM public.site_stats);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON public.course_enrollments;
DROP TRIGGER IF EXISTS update_site_stats_updated_at ON public.site_stats;
DROP TRIGGER IF EXISTS update_success_stories_updated_at ON public.success_stories;
DROP TRIGGER IF EXISTS update_journey_content_updated_at ON public.journey_content;
DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_stats_updated_at BEFORE UPDATE ON public.site_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at BEFORE UPDATE ON public.success_stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journey_content_updated_at BEFORE UPDATE ON public.journey_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();