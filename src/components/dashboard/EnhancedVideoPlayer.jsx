import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedVideoPlayer = ({ courseId, lessonId, videoUrl, onProgressUpdate }) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [actualVideoTime, setActualVideoTime] = useState({ current: 0, total: 0 });
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const progressUpdateRef = useRef(null);
  const completionRef = useRef(false);
  const storageKey = `video_progress_${courseId}_${lessonId}`;

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const { watchedPercentage: savedPercentage, completed } = JSON.parse(saved);
        if (completed) {
          setHasCompleted(true);
          setWatchedPercentage(100);
          completionRef.current = true;
        } else {
          setWatchedPercentage(savedPercentage || 0);
        }
      } catch (e) {
        console.warn('Failed to parse saved progress:', e);
      }
    }
  }, [storageKey]);

  // Enhanced video event handling with completion prevention
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || hasCompleted) return;

    let isInitialized = false;

    const handleLoadedMetadata = () => {
      const videoDuration = video.duration;
      if (videoDuration && !isNaN(videoDuration) && videoDuration > 0 && !isInitialized) {
        setDuration(videoDuration);
        setActualVideoTime(prev => ({ ...prev, total: videoDuration }));
        setMetadataLoaded(true);
        isInitialized = true;
        
        // Restore saved position only if not completed
        if (!hasCompleted) {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            try {
              const { currentTime: savedTime, completed } = JSON.parse(saved);
              if (!completed && savedTime > 0 && savedTime < videoDuration - 5) {
                video.currentTime = savedTime;
              }
            } catch (e) {
              console.warn('Failed to restore video position:', e);
            }
          }
        }
      }
    };

    const handleTimeUpdate = () => {
      if (!isInitialized || completionRef.current) return;
      
      const current = video.currentTime;
      const total = video.duration;
      
      if (!isNaN(current) && !isNaN(total) && total > 0) {
        setCurrentTime(current);
        setActualVideoTime({ current, total });
        
        const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
        setWatchedPercentage(percentage);
        
        // Save progress frequently but don't mark as completed until video ends
        if (percentage < 95) {
          localStorage.setItem(storageKey, JSON.stringify({
            watchedPercentage: percentage,
            currentTime: current,
            duration: total,
            timestamp: Date.now(),
            videoUrl,
            completed: false
          }));
          
          // Debounced progress updates
          if (progressUpdateRef.current) clearTimeout(progressUpdateRef.current);
          progressUpdateRef.current = setTimeout(() => {
            updateProgress(percentage, current, total, false);
          }, 2000);
        }
      }
    };

    const handleEnded = () => {
      if (!completionRef.current && video.duration && !isNaN(video.duration)) {
        completionRef.current = true;
        setHasCompleted(true);
        setWatchedPercentage(100);
        
        // Mark as completed in storage
        localStorage.setItem(storageKey, JSON.stringify({
          watchedPercentage: 100,
          currentTime: video.duration,
          duration: video.duration,
          timestamp: Date.now(),
          videoUrl,
          completed: true
        }));
        
        // Final completion update
        updateProgress(100, video.duration, video.duration, true);
        
        if (progressUpdateRef.current) {
          clearTimeout(progressUpdateRef.current);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
      if (video) {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [videoUrl, storageKey, hasCompleted]);

  const updateProgress = async (percentage, currentVideoTime, videoDuration, isCompleted = false) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          watched_percentage: percentage,
          current_time: currentVideoTime,
          video_duration: videoDuration,
          completed: isCompleted || percentage >= 100,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_id,lesson_id' });

      if (error) {
        console.error('Database update error:', error);
        return;
      }

      if (onProgressUpdate) onProgressUpdate(percentage);
      
      if (isCompleted && !hasCompleted) {
        toast({ 
          title: "Lesson Complete!", 
          description: "Great job! You've successfully completed this lesson.",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <Play className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Video Coming Soon</h3>
        <Button onClick={() => updateProgress(100, 0, 0)} className="btn-primary">
          Mark as Complete
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={videoUrl}
          controls
        />
        
        {/* Enhanced Progress Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-green/90 to-transparent p-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-secondary-yellow" />
              <span>{formatTime(actualVideoTime.current)} / {formatTime(actualVideoTime.total)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-secondary-yellow">{watchedPercentage}% watched</span>
              {hasCompleted && (
                <span className="text-secondary-yellow text-xs">✅ Complete</span>
              )}
              {metadataLoaded && !hasCompleted && (
                <div className="w-2 h-2 bg-secondary-yellow rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-primary-green/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Lesson Progress</span>
          <span className="text-secondary-yellow font-bold">{watchedPercentage}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
          <div 
            className="bg-gradient-to-r from-secondary-yellow to-accent-green h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${watchedPercentage}%` }}
          />
        </div>
        {hasCompleted && (
          <div className="mt-2 text-center">
            <span className="text-secondary-yellow text-sm font-medium">✅ Lesson Completed!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;