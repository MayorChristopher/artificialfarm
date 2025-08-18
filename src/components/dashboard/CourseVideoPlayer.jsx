import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipForward } from 'lucide-react';
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
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      updateWatchProgress(100);
      toast({ title: "Lesson Complete!", description: "You've finished watching this lesson." });
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const percentage = Math.round((currentTime / duration) * 100);
      setWatchedPercentage(percentage);
      
      // Update progress every 10% watched
      if (percentage > 0 && percentage % 10 === 0) {
        updateWatchProgress(percentage);
      }
    }
  }, [currentTime, duration]);

  const [savedPercentages, setSavedPercentages] = useState(new Set());

  const updateWatchProgress = async (percentage) => {
    // Prevent duplicate saves for same percentage
    if (savedPercentages.has(percentage)) return;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          watched_percentage: percentage
        });

      if (!error) {
        setSavedPercentages(prev => new Set([...prev, percentage]));
        if (onProgressUpdate) {
          onProgressUpdate(percentage);
        }
      }
    } catch (error) {
      console.error('Error updating watch progress:', error);
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Video play error:', error);
      toast({ title: 'Playback Error', description: 'Unable to play video. Please try again.', variant: 'destructive' });
    }
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
    setVolume(newVolume);
    video.volume = newVolume;
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setCurrentTime(0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6"
    >
      <div className="relative bg-black rounded-xl overflow-hidden">
        {videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be') || videoUrl?.includes('youtube-nocookie.com') ? (
          <iframe
            src={videoUrl}
            className="w-full aspect-video"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            onClick={togglePlay}
          />
        )}
        
        {/* Video Controls Overlay - Only for non-YouTube videos */}
        {!(videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be') || videoUrl?.includes('youtube-nocookie.com')) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 lg:p-4">
          {/* Progress Bar */}
          <div className="mb-2 lg:mb-4">
            <div 
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-white text-xs lg:text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white p-1.5 lg:p-2 rounded-full"
              >
                {isPlaying ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5" />}
              </Button>
              
              <Button
                onClick={restart}
                className="bg-white/20 hover:bg-white/30 text-white p-1.5 lg:p-2 rounded-full"
              >
                <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              
              <Button
                onClick={skipForward}
                className="bg-white/20 hover:bg-white/30 text-white p-1.5 lg:p-2 rounded-full"
              >
                <SkipForward className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  onClick={toggleMute}
                  className="bg-white/20 hover:bg-white/30 text-white p-1.5 lg:p-2 rounded-full"
                >
                  {isMuted ? <VolumeX className="w-3 h-3 lg:w-4 lg:h-4" /> : <Volume2 className="w-3 h-3 lg:w-4 lg:h-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 lg:w-20 h-1 bg-white/20 rounded-full"
                />
              </div>
              
              <Button
                onClick={toggleFullscreen}
                className="bg-white/20 hover:bg-white/30 text-white p-1.5 lg:p-2 rounded-full"
              >
                <Maximize className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Watch Progress */}
      <div className="mt-4 p-3 lg:p-4 bg-white/5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm lg:text-base">Watch Progress</span>
          <span className="text-yellow-400 font-bold text-sm lg:text-base">{watchedPercentage}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${watchedPercentage}%` }}
          />
        </div>
        {(videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be') || videoUrl?.includes('youtube-nocookie.com')) && (
          <div className="mt-3">
            <Button
              onClick={() => updateWatchProgress(100)}
              className="bg-green-600 hover:bg-green-700 text-white text-xs lg:text-sm px-3 py-1.5 rounded-lg"
            >
              Mark as Completed
            </Button>
          </div>
        )}
        <p className="text-white/70 text-xs lg:text-sm mt-2">
          {watchedPercentage >= 80 ? 'Great job! You\'re almost done with this lesson.' :
           watchedPercentage >= 50 ? 'You\'re halfway through this lesson.' :
           'Keep watching to track your progress.'}
        </p>
      </div>
    </motion.div>
  );
};

export default CourseVideoPlayer;