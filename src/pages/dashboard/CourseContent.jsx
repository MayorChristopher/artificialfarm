import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Download,
  Star,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import UniversalVideoPlayer from "@/components/dashboard/UniversalVideoPlayer";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    
    // Listen for dashboard refresh events
    const handleDashboardRefresh = () => {
      fetchCourseData();
    };
    
    window.addEventListener('dashboard:refresh', handleDashboardRefresh);
    
    return () => {
      window.removeEventListener('dashboard:refresh', handleDashboardRefresh);
    };
  }, [courseId, user]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();

      if (enrollmentError) throw enrollmentError;

      // Fetch lessons from database
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        setLessons([]);
      } else {
        setLessons(lessonsData || []);
      }

      setCourse(courseData);
      setEnrollment(enrollmentData);

      // Fetch lesson progress
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id);

      const progressMap = {};
      progressData?.forEach((p) => {
        progressMap[p.lesson_id] = p.watched_percentage;
      });
      setLessonProgress(progressMap);
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Could not load course content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId, percentage) => {
    setLessonProgress((prev) => ({ ...prev, [lessonId]: percentage }));

    // Update overall course progress
    const completedLessons = Object.values({
      ...lessonProgress,
      [lessonId]: percentage,
    }).filter((p) => p >= 80).length;
    const overallProgress = Math.round(
      (completedLessons / lessons.length) * 100
    );

    try {
      await supabase
        .from("course_enrollments")
        .update({ 
          progress: overallProgress,
          last_accessed: new Date().toISOString()
        })
        .eq("id", enrollment.id);
        
      // Trigger dashboard refresh for real-time updates
      window.dispatchEvent(new CustomEvent('dashboard:refresh'));
    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      toast({
        title: "Next Lesson",
        description: `Now watching: ${lessons[currentLesson + 1]?.title}`,
      });
    } else {
      toast({
        title: "Course Complete!",
        description: "You have finished all lessons in this course.",
      });
    }
  };

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      toast({
        title: "Previous Lesson",
        description: `Now watching: ${lessons[currentLesson - 1]?.title}`,
      });
    }
  };

  const goToLesson = (index) => {
    setCurrentLesson(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-green-900" />
          </div>
          <p className="text-white/70">Loading course content...</p>
        </div>
      </div>
    );
  }

  const currentLessonData = lessons[currentLesson];
  const completedLessons = Object.values(lessonProgress).filter(
    (p) => p >= 80
  ).length;
  const overallProgress = Math.round((completedLessons / lessons.length) * 100);

  return (
    <>
      <Helmet>
        <title>{course?.title} - Course Content</title>
        <meta
          name="description"
          content={`Learn ${course?.title} with interactive lessons and videos.`}
        />
      </Helmet>

      <div className="space-y-6">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/dashboard/my-courses")}
              className="bg-white/5 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 border border-white/25 hover:border-white/40"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {overallProgress}%
              </div>
              <div className="text-white/70 text-sm">Complete</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {course?.title}
          </h1>
          <p className="text-white/70 mb-4">{course?.description}</p>

          <div className="flex items-center space-x-6 text-sm text-white/60">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {course?.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {course?.instructor}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              {course?.level}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Current Lesson */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-effect rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <h2 className="text-xl lg:text-2xl font-bold text-white">
                    Lesson {currentLesson + 1}: {currentLessonData?.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/70 text-sm">
                      {currentLessonData?.duration}
                    </span>
                    {lessonProgress[currentLessonData?.id] >= 80 && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </div>
                <p className="text-white/70 mb-4 lg:mb-6">
                  {currentLessonData?.description}
                </p>
              </div>

              {/* Video Player */}
              {currentLessonData?.type === "video" && (
                <UniversalVideoPlayer
                  courseId={courseId}
                  lessonId={currentLessonData.id}
                  videoUrl={currentLessonData.video_url}
                  onProgressUpdate={(percentage) =>
                    handleLessonComplete(currentLessonData.id, percentage)
                  }
                />
              )}

              {/* Navigation */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    onClick={previousLesson}
                    disabled={currentLesson === 0}
                    className="w-full sm:w-auto bg-white/5 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 border border-white/25 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <span className="text-white/70 text-center text-sm font-medium">
                    Lesson {currentLesson + 1} of {lessons.length}
                  </span>

                  <Button
                    onClick={nextLesson}
                    disabled={currentLesson === lessons.length - 1}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentLesson === lessons.length - 1
                      ? "Complete Course"
                      : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-4 lg:sticky lg:top-6"
            >
              <h3 className="text-lg lg:text-xl font-bold text-white mb-4">
                Course Content
              </h3>
              <div className="space-y-2 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => goToLesson(index)}
                    className={`w-full text-left p-2 lg:p-3 rounded-lg transition-all duration-300 ${
                      index === currentLesson
                        ? "bg-yellow-400/20 border border-yellow-400/50"
                        : "bg-white/5 hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <div
                          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${
                            lessonProgress[lesson.id] >= 80
                              ? "bg-green-400/20 text-green-400"
                              : index === currentLesson
                              ? "bg-yellow-400/20 text-yellow-400"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {lessonProgress[lesson.id] >= 80 ? (
                            <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                          ) : (
                            <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-medium text-xs lg:text-sm truncate ${
                              index === currentLesson
                                ? "text-white"
                                : "text-white/70"
                            }`}
                          >
                            {lesson.title}
                          </div>
                          <div className="text-xs text-white/50">
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Video Tracking Section */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-semibold mb-3">
                  Video Watch Progress
                </h4>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const progress = lessonProgress[lesson.id] || 0;
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span
                          className={`${
                            idx === currentLesson
                              ? "text-yellow-400"
                              : "text-white/70"
                          }`}
                        >
                          Lesson {idx + 1}
                        </span>
                        <span
                          className={`font-medium ${
                            progress >= 80
                              ? "text-green-400"
                              : progress >= 50
                              ? "text-yellow-400"
                              : "text-white/50"
                          }`}
                        >
                          {progress}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Summary */}
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    Overall Progress
                  </span>
                  <span className="text-yellow-400 font-bold">
                    {overallProgress}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">
                  {completedLessons} of {lessons.length} lessons completed
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
