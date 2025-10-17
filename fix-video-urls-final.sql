-- Fix Video URLs Script
-- This script checks and standardizes video URLs in the lessons table

-- First, let's see what we have
SELECT 
    id,
    title,
    video_url,
    CASE 
        WHEN video_url LIKE '%youtu.be%' THEN 'YouTube Short URL'
        WHEN video_url LIKE '%youtube.com/embed%' THEN 'YouTube Embed URL'
        WHEN video_url LIKE '%youtube.com/watch%' THEN 'YouTube Watch URL'
        WHEN video_url LIKE '%commondatastorage.googleapis.com%' THEN 'Google Test Video'
        WHEN video_url LIKE '%samplelib.com%' THEN 'Sample Library Video'
        ELSE 'Other Video Source'
    END as url_type
FROM public.lessons
ORDER BY title;

-- Check if any URLs are problematic
SELECT 
    id,
    title,
    video_url,
    LENGTH(video_url) as url_length,
    CASE 
        WHEN video_url IS NULL THEN 'NULL URL'
        WHEN video_url = '' THEN 'Empty URL'
        WHEN LENGTH(video_url) < 10 THEN 'Too Short'
        WHEN video_url NOT LIKE 'http%' THEN 'Invalid Protocol'
        ELSE 'OK'
    END as url_status
FROM public.lessons
WHERE video_url IS NULL 
   OR video_url = '' 
   OR LENGTH(video_url) < 10 
   OR video_url NOT LIKE 'http%'
ORDER BY title;

-- Update any problematic YouTube URLs to ensure they work
-- This will standardize YouTube URLs to embed format
UPDATE public.lessons 
SET video_url = CASE 
    -- Convert youtu.be URLs to embed format
    WHEN video_url LIKE '%youtu.be/%' THEN 
        'https://www.youtube.com/embed/' || 
        SPLIT_PART(SPLIT_PART(video_url, 'youtu.be/', 2), '?', 1)
    -- Keep embed URLs as they are (just clean them up)
    WHEN video_url LIKE '%youtube.com/embed/%' THEN video_url
    -- Convert watch URLs to embed format
    WHEN video_url LIKE '%youtube.com/watch?v=%' THEN 
        'https://www.youtube.com/embed/' || 
        SPLIT_PART(SPLIT_PART(video_url, 'v=', 2), '&', 1)
    ELSE video_url
END
WHERE video_url LIKE '%youtube%' OR video_url LIKE '%youtu.be%';

-- Verify the updates
SELECT 
    id,
    title,
    video_url,
    CASE 
        WHEN video_url LIKE '%youtube.com/embed%' THEN 'YouTube Embed (Good)'
        WHEN video_url LIKE '%commondatastorage.googleapis.com%' THEN 'Google Test Video (Good)'
        WHEN video_url LIKE '%samplelib.com%' THEN 'Sample Library Video (Good)'
        ELSE 'Check This URL'
    END as url_status
FROM public.lessons
ORDER BY title;