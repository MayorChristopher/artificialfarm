-- Test YouTube Video URL - Run this to test YouTube video support
-- This will update the first lesson to use your YouTube URL

UPDATE public.lessons 
SET video_url = 'https://youtu.be/jl6aEFjZDb0?si=BzzBZ0shUP3cIuQX'
WHERE order_index = 1 AND course_id = '550e8400-e29b-41d4-a716-446655440001';

-- Verify the update
SELECT course_id, title, video_url, order_index 
FROM public.lessons 
WHERE order_index = 1 AND course_id = '550e8400-e29b-41d4-a716-446655440001';