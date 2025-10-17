import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { lessonProgressService } from '@/lib/lessonProgress';

const UniversalVideoPlayer = ({ courseId, lessonId, videoUrl, onProgressUpdate }) => {
  const { user } = useAuth();
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [actualVideoTime, setActualVideoTime] = useState({ current: 0, total: 0 });
  const progressUpdateRef = useRef(null);
  const videoRef = useRef(null);
  const storageKey = `video_progress_${courseId}_${lessonId}`;

  // Detect if URL is YouTube
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    let videoId = '';
    
    // Handle different YouTube URL formats
    if (url.includes('youtu.be/')) {
      // Format: https://youtu.be/VIDEO_ID?si=...
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      // Format: https://www.youtube.com/embed/VIDEO_ID?si=...
      videoId = url.split('embed/')[1].split('?')[0].split('&')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1`;
    }
    
    return url; // Return original URL if we can't parse it
  };

  // Load saved progress once on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadProgress = async () => {
      if (!user || !courseId || !lessonId || !isMounted) return;
      
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('watched_percentage, current_time, video_duration')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('lesson_id', lessonId)
          .single();
        
        if (data && !error && isMounted) {
          setWatchedPercentage(data.watched_percentage || 0);
          setCurrentTime(data.current_time || 0);
          setDuration(data.video_duration || 0);
          return;
        }
      } catch (error) {
        // Silently handle missing progress
      }
      
      // Clear any stale localStorage data
      if (isMounted) {
        localStorage.removeItem(storageKey);
        setWatchedPercentage(0);
        setCurrentTime(0);
        setDuration(0);
      }
    };
    
    loadProgress();
    
    return () => {
      isMounted = false;
    };
  }, [user?.id, courseId, lessonId, storageKey]);

  // Enhanced video event listeners with improved accuracy and metadata sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTubeUrl(videoUrl)) return;

    let metadataLoaded = false;
    let lastValidTime = 0;
    let isInitialized = false;

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration;
      if (videoDuration && !isNaN(videoDuration) && videoDuration > 0 && !isInitialized) {
        setDuration(videoDuration);
        setActualVideoTime(prev => ({ ...prev, total: videoDuration }));
        metadataLoaded = true;
        isInitialized = true;
        
        // Restore from database progress only
        if (currentTime > 0 && currentTime < videoDuration) {
          video.currentTime = currentTime;
        }
      }
    };

    const handleTimeUpdate = () => {
      if (!metadataLoaded || !isInitialized) return;
      
      const current = video.currentTime;
      const total = video.duration;
      
      if (!isNaN(current) && !isNaN(total) && total > 0 && Math.abs(current - lastValidTime) < 30) {
        lastValidTime = current;
        
        // Update local state immediately for UI responsiveness
        setCurrentTime(current);
        setActualVideoTime({ current, total });
        
        const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
        setWatchedPercentage(percentage);
        
        // Save to localStorage immediately
        localStorage.setItem(storageKey, JSON.stringify({
          watchedPercentage: percentage,
          currentTime: current,
          duration: total,
          timestamp: Date.now()
        }));
        
        // Debounced database update only
        if (progressUpdateRef.current) {
          clearTimeout(progressUpdateRef.current);
        }
        progressUpdateRef.current = setTimeout(() => {
          updateLessonProgress(percentage, current, total);
        }, 3000);
      }
    };

    const handleEnded = () => {
      if (metadataLoaded && video.duration && !isNaN(video.duration)) {
        updateLessonProgress(100, video.duration, video.duration);
      }
    };

    // Only use loadedmetadata event to prevent multiple initializations
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, storageKey]); // Removed currentTime from dependencies to prevent infinite loop

  const updateLessonProgress = async (percentage, currentVideoTime = 0, videoDuration = 0) => {
    try {
      // Prevent recursion by checking if update is meaningful
      if (Math.abs(percentage - watchedPercentage) < 2 && percentage < 100) {
        return;
      }

      // Update database only
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          watched_percentage: percentage,
          current_time: currentVideoTime,
          video_duration: videoDuration,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      // Call parent callback without triggering state updates
      if (onProgressUpdate) {
        onProgressUpdate(percentage);
      }

      // Handle completion
      if (percentage >= 100) {
        localStorage.removeItem(storageKey);
        toast({
          title: "Lesson Complete!",
          description: "You've finished watching this lesson.",
        });
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  // Manual progress update for YouTube videos (since we can't track automatically)
  const handleManualProgress = async (percentage) => {
    // Prevent duplicate manual updates
    if (Math.abs(percentage - watchedPercentage) < 5 && percentage < 100) {
      return;
    }
    
    // Estimate video time based on percentage for YouTube videos
    const estimatedDuration = 600; // 10 minutes default
    const estimatedCurrentTime = (percentage / 100) * estimatedDuration;
    
    await updateLessonProgress(percentage, estimatedCurrentTime, estimatedDuration);
    
    // Show feedback for manual updates
    toast({
      title: `Progress Updated: ${percentage}%`,
      description: percentage >= 100 ? "Lesson completed!" : "Progress saved successfully.",
    });
  };

  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show placeholder if no video URL
  if (!videoUrl) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-12 h-12 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Video Coming Soon</h3>
        <p className="text-white/70 mb-4">
          This lesson video is being prepared. Please check back later or contact support.
        </p>
        <Button 
          onClick={() => updateLessonProgress(100)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg"
        >
          Mark as Complete
        </Button>
      </div>
    );
  }

  const isYouTube = isYouTubeUrl(videoUrl);
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div className="glass-effect rounded-2xl overflow-hidden">
      <div 
        className="relative bg-black group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {isYouTube && embedUrl ? (
          // YouTube Embed
          <div className="relative">
            <iframe
              className="w-full aspect-video"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* YouTube Progress Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-between">
                <div className="text-white text-sm">
                  YouTube Video - Manual Progress Tracking
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleManualProgress(25)}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded"
                  >
                    25%
                  </Button>
                  <Button
                    onClick={() => handleManualProgress(50)}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded"
                  >
                    50%
                  </Button>
                  <Button
                    onClick={() => handleManualProgress(75)}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded"
                  >
                    75%
                  </Button>
                  <Button
                    onClick={() => handleManualProgress(100)}
                    className="bg-green-500/80 hover:bg-green-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Regular HTML5 Video with enhanced timing
          <video
            ref={videoRef}
            className="w-full aspect-video"
            src={videoUrl}
            controls
            poster="/images/video-placeholder.jpg"
          />
        )}
      </div>

      {/* Video Info with Accurate Timing */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white/70 text-sm mb-1">Watch Progress</div>
            <div className="w-full max-w-md h-2 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/60 mt-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>
                  {isYouTube ? (
                    'YouTube Video'
                  ) : (
                    `${formatTime(actualVideoTime.current)} / ${formatTime(actualVideoTime.total)}`
                  )}
                </span>
              </div>
              {isYouTube && (
                <span className="text-white/50">
                  Manual progress tracking
                </span>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-yellow-400">{watchedPercentage}%</div>
            <div className="text-white/70 text-sm">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalVideoPlayer;