-- Check current courses and lessons in the database
-- Run this to see what courses are currently available for testing

-- Check all courses
SELECT 
    id,
    title,
    description,
    category,
    instructor,
    lessons,
    level,
    rating,
    students,
    created_at
FROM public.courses
ORDER BY created_at DESC;

-- Check all lessons with their course information
SELECT 
    c.title as course_title,
    l.title as lesson_title,
    l.description,
    l.video_url,
    l.duration,
    l.order_index,
    l.type,
    c.id as course_id,
    l.id as lesson_id
FROM public.courses c
LEFT JOIN public.lessons l ON c.id = l.course_id
ORDER BY c.title, l.order_index;

-- Check video URLs specifically to see which ones are working
SELECT 
    c.title as course_title,
    l.title as lesson_title,
    l.video_url,
    CASE 
        WHEN l.video_url LIKE '%commondatastorage.googleapis.com%' THEN 'Google Test Video (Should Work)'
        WHEN l.video_url LIKE '%youtube.com%' OR l.video_url LIKE '%youtu.be%' THEN 'YouTube (May Need Iframe)'
        ELSE 'Other Video Source'
    END as video_source_type
FROM public.courses c
LEFT JOIN public.lessons l ON c.id = l.course_id
WHERE l.video_url IS NOT NULL
ORDER BY c.title, l.order_index;