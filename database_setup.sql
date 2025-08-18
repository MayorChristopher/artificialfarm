-- Create update function for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fix lesson_progress table - drop and recreate with correct data types
DROP TABLE IF EXISTS public.lesson_progress CASCADE;

CREATE TABLE public.lesson_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  course_id uuid,
  lesson_id uuid NOT NULL,
  lesson_title text,
  completed boolean DEFAULT false,
  completion_date timestamp with time zone,
  time_spent integer DEFAULT 0,
  score integer DEFAULT 0,
  watched_percentage integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_progress_user_id_course_id_lesson_id_key UNIQUE (user_id, course_id, lesson_id),
  CONSTRAINT lesson_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
  CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT lesson_progress_score_check CHECK (score >= 0 AND score <= 100),
  CONSTRAINT lesson_progress_watched_percentage_check CHECK (watched_percentage >= 0 AND watched_percentage <= 100)
);

-- Create/recreate triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;

CREATE TRIGGER update_courses_updated_at 
BEFORE UPDATE ON courses 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
BEFORE UPDATE ON lessons 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at 
BEFORE UPDATE ON lesson_progress 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample course if it doesn't exist
INSERT INTO public.courses (title, description, category, duration, lessons, students, rating, level, price, thumbnail, instructor) 
SELECT 
  'Smart Farming Fundamentals',
  'Complete guide to modern agricultural technology and smart farming practices.',
  'Agriculture',
  '2 hours',
  4,
  150,
  4.8,
  'Beginner',
  'Free',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
  'Dr. John Smith'
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE title = 'Smart Farming Fundamentals');

-- Update existing lessons with YouTube URLs
UPDATE public.lessons SET video_url = 'https://www.youtube.com/embed/heTxEsrPVdQ?si=oMa2GC-AngDrEQFH';

-- Insert sample lessons with YouTube embed URLs
INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index, type) 
SELECT 
  (SELECT id FROM courses WHERE title = 'Smart Farming Fundamentals'),
  'Introduction to Smart Farming',
  'Learn the basics of smart farming technology and its applications.',
  'https://www.youtube.com/embed/heTxEsrPVdQ?si=oMa2GC-AngDrEQFH',
  '15:30',
  1,
  'video'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Introduction to Smart Farming');

INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index, type) 
SELECT 
  (SELECT id FROM courses WHERE title = 'Smart Farming Fundamentals'),
  'Soil Analysis Techniques',
  'Understanding soil composition and testing methods.',
  'https://www.youtube.com/embed/heTxEsrPVdQ?si=oMa2GC-AngDrEQFH',
  '12:45',
  2,
  'video'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Soil Analysis Techniques');

INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index, type) 
SELECT 
  (SELECT id FROM courses WHERE title = 'Smart Farming Fundamentals'),
  'Irrigation Systems',
  'Modern irrigation techniques and water management.',
  'https://www.youtube.com/embed/heTxEsrPVdQ?si=oMa2GC-AngDrEQFH',
  '18:20',
  3,
  'video'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Irrigation Systems');

INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index, type) 
SELECT 
  (SELECT id FROM courses WHERE title = 'Smart Farming Fundamentals'),
  'Crop Monitoring',
  'Using technology to monitor crop health and growth.',
  'https://www.youtube.com/embed/heTxEsrPVdQ?si=oMa2GC-AngDrEQFH',
  '20:15',
  4,
  'video'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Crop Monitoring');