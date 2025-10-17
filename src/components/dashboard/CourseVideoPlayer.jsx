import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const CourseVideoPlayer = ({ courseId, lessonId, videoUrl, onProgressUpdate }) => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const progressUpdateRef = useRef(null);
  const storageKey = `video_progress_${courseId}_${lessonId}`;

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const { currentTime: savedTime, watchedPercentage: savedPercentage } = JSON.parse(savedProgress);
      setCurrentTime(savedTime || 0);
      setWatchedPercentage(savedPercentage || 0);
    }
  }, [storageKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isInitialized = false;

    const handleTimeUpdate = () => {
      if (!isInitialized) return;
      
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const percentage = Math.round((current / total) * 100);
        setWatchedPercentage(percentage);
        
        // Save progress to localStorage
        localStorage.setItem(storageKey, JSON.stringify({
          currentTime: current,
          watchedPercentage: percentage,
          duration: total,
          timestamp: Date.now()
        }));
        
        // Update progress in database with debouncing
        if (progressUpdateRef.current) {
          clearTimeout(progressUpdateRef.current);
        }
        progressUpdateRef.current = setTimeout(() => {
          updateLessonProgress(percentage);
        }, 2000);
      }
    };

    const handleLoadedMetadata = () => {
      if (isInitialized) return;
      
      setDuration(video.duration);
      isInitialized = true;
      
      // Restore saved video position
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        try {
          const { currentTime: savedTime } = JSON.parse(savedProgress);
          if (savedTime && savedTime > 0 && savedTime < video.duration) {
            video.currentTime = savedTime;
          }
        } catch (e) {
          console.warn('Failed to parse saved progress:', e);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      updateLessonProgress(100);
      // Clear saved progress when video is completed
      localStorage.removeItem(storageKey);
      toast({
        title: "Lesson Complete!",
        description: "You've finished watching this lesson.",
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, [lessonId, storageKey]);

  // Save progress when component unmounts or lesson changes
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video && video.currentTime > 0 && video.duration > 0) {
        const percentage = Math.round((video.currentTime / video.duration) * 100);
        if (percentage < 100) { // Don't save if completed
          localStorage.setItem(storageKey, JSON.stringify({
            currentTime: video.currentTime,
            watchedPercentage: percentage,
            duration: video.duration,
            timestamp: Date.now()
          }));
        }
      }
    };
  }, [storageKey]);

  const updateLessonProgress = async (percentage) => {
    try {
      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          watched_percentage: percentage,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (onProgressUpdate) {
        onProgressUpdate(percentage);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
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

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  return (
    <div className="glass-effect rounded-2xl overflow-hidden">
      <div 
        className="relative bg-black group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={videoUrl}
          poster="/images/video-placeholder.jpg"
        />
        
        {/* Video Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div 
              className="w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={togglePlay}
                  className="bg-transparent hover:bg-white/20 p-2"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </Button>

                <Button
                  onClick={() => skipTime(-10)}
                  className="bg-transparent hover:bg-white/20 p-2"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </Button>

                <Button
                  onClick={() => skipTime(10)}
                  className="bg-transparent hover:bg-white/20 p-2"
                >
                  <RotateCw className="w-5 h-5 text-white" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={toggleMute}
                    className="bg-transparent hover:bg-white/20 p-2"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/20 rounded-full appearance-none slider"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium">
                  {watchedPercentage}% watched
                </span>
                <Button
                  onClick={toggleFullscreen}
                  className="bg-transparent hover:bg-white/20 p-2"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/70 text-sm mb-1">Watch Progress</div>
            <div className="w-48 h-2 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{watchedPercentage}%</div>
            <div className="text-white/70 text-sm">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;