-- Fix Video URLs - Run this to update existing lessons with working video URLs
-- These are free test videos from Google that should work reliably
-- NOTE: YouTube URLs (youtu.be/xxx) will NOT work with the current HTML5 video player
-- YouTube requires iframe embedding or YouTube API, not direct video URLs

UPDATE public.lessons 
SET video_url = CASE 
    WHEN order_index = 1 AND course_id = '550e8400-e29b-41d4-a716-446655440001' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    WHEN order_index = 2 AND course_id = '550e8400-e29b-41d4-a716-446655440001' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    WHEN order_index = 3 AND course_id = '550e8400-e29b-41d4-a716-446655440001' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    WHEN order_index = 4 AND course_id = '550e8400-e29b-41d4-a716-446655440001' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    WHEN order_index = 1 AND course_id = '550e8400-e29b-41d4-a716-446655440002' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    WHEN order_index = 2 AND course_id = '550e8400-e29b-41d4-a716-446655440002' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    WHEN order_index = 3 AND course_id = '550e8400-e29b-41d4-a716-446655440002' 
        THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    ELSE video_url
END
WHERE course_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');

-- Verify the update
SELECT course_id, title, video_url, order_index 
FROM public.lessons 
WHERE course_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002')
ORDER BY course_id, order_index;