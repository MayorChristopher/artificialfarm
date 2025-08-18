import { supabase } from './supabase';

export const lessonProgressService = {
  _tableExists: null, // Cache table existence check

  // Check if lesson_progress table exists
  async checkTableExists() {
    if (this._tableExists !== null) return this._tableExists;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .select('id')
        .limit(1);
      
      this._tableExists = !error || error.code !== '42P01';
      return this._tableExists;
    } catch (error) {
      this._tableExists = false;
      return false;
    }
  },
  // Get lesson progress for a specific course
  async getLessonProgress(userId, courseId) {
    // Check if table exists first to avoid 404 errors
    const tableExists = await this.checkTableExists();
    if (!tableExists) {
      return this.getMockLessonProgress(courseId);
    }

    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('lesson_id');

      if (error) {
        console.error('Error fetching lesson progress:', error);
        return this.getMockLessonProgress(courseId);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      return this.getMockLessonProgress(courseId);
    }
  },

  // Mock lesson progress for testing
  getMockLessonProgress(courseId) {
    return [
      { lesson_id: 'lesson-1', lesson_title: 'Introduction to Smart Farming', completed: true, watched_percentage: 100, time_spent: 45, score: 90 },
      { lesson_id: 'lesson-2', lesson_title: 'Soil Analysis Techniques', completed: true, watched_percentage: 100, time_spent: 38, score: 85 },
      { lesson_id: 'lesson-3', lesson_title: 'Irrigation Systems', completed: false, watched_percentage: 60, time_spent: 25, score: 0 },
      { lesson_id: 'lesson-4', lesson_title: 'Crop Monitoring', completed: false, watched_percentage: 0, time_spent: 0, score: 0 }
    ];
  },

  // Update lesson progress
  async updateLessonProgress(userId, courseId, lessonId, progressData) {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          lesson_title: progressData.lessonTitle,
          completed: progressData.completed || false,
          completion_date: progressData.completed ? new Date().toISOString() : null,
          time_spent: progressData.timeSpent || 0,
          score: progressData.score || 0,
          watched_percentage: progressData.watchedPercentage || 0,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) {
        console.error('Error updating lesson progress:', error);
        // If table doesn't exist, just log and continue
        if (error.code === '42P01') {
          console.warn('lesson_progress table does not exist. Please run the setup SQL.');
          return null;
        }
        throw error;
      }

      // Update overall course progress
      await this.updateCourseProgress(userId, courseId);
      
      return data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return null;
    }
  },

  // Calculate and update overall course progress
  async updateCourseProgress(userId, courseId) {
    try {
      // Get all lesson progress for this course
      const lessonProgress = await this.getLessonProgress(userId, courseId);
      
      if (lessonProgress.length === 0) return { progress: 0, hoursSpent: 0, averageScore: 0 };

      const completedLessons = lessonProgress.filter(lesson => lesson.completed || lesson.watched_percentage >= 80).length;
      const totalLessons = lessonProgress.length;
      const overallProgress = Math.round((completedLessons / totalLessons) * 100);
      
      const totalTimeSpent = lessonProgress.reduce((sum, lesson) => sum + (lesson.time_spent || 0), 0);
      const averageScore = lessonProgress.length > 0 
        ? Math.round(lessonProgress.reduce((sum, lesson) => sum + (lesson.score || 0), 0) / lessonProgress.length)
        : 0;

      // Find current lesson (first incomplete lesson)
      const currentLesson = lessonProgress.find(lesson => !lesson.completed && lesson.watched_percentage < 80);
      const currentLessonId = currentLesson ? currentLesson.lesson_id : lessonProgress[lessonProgress.length - 1]?.lesson_id;

      // Update course enrollment with calculated progress
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          progress: overallProgress,
          hours_spent: Math.round(totalTimeSpent / 60 * 10) / 10, // Convert minutes to hours
          score: averageScore,
          current_lesson_id: currentLessonId,
          last_accessed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating course enrollment:', error);
      }

      return { progress: overallProgress, hoursSpent: Math.round(totalTimeSpent / 60 * 10) / 10, averageScore };
    } catch (error) {
      console.error('Error updating course progress:', error);
      return { progress: 0, hoursSpent: 0, averageScore: 0 };
    }
  },

  // Mark lesson as completed
  async completeLesson(userId, courseId, lessonId, lessonTitle, timeSpent = 30, score = 0) {
    return this.updateLessonProgress(userId, courseId, lessonId, {
      lessonTitle,
      completed: true,
      timeSpent,
      score,
      watchedPercentage: 100
    });
  },

  // Update video watch percentage
  async updateVideoProgress(userId, courseId, lessonId, lessonTitle, watchedPercentage, timeSpent = 0) {
    const completed = watchedPercentage >= 80;
    return this.updateLessonProgress(userId, courseId, lessonId, {
      lessonTitle,
      completed,
      timeSpent,
      watchedPercentage,
      score: completed ? 85 : 0
    });
  },

  // Get course progress summary
  async getCourseProgressSummary(userId, courseId) {
    try {
      const lessonProgress = await this.getLessonProgress(userId, courseId);
      const completedLessons = lessonProgress.filter(lesson => lesson.completed || lesson.watched_percentage >= 80).length;
      const totalLessons = lessonProgress.length;
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      // Find next lesson to continue
      const nextLesson = lessonProgress.find(lesson => !lesson.completed && lesson.watched_percentage < 80);
      const currentLessonIndex = nextLesson ? lessonProgress.findIndex(l => l.lesson_id === nextLesson.lesson_id) : lessonProgress.length - 1;
      
      return {
        totalLessons,
        completedLessons,
        overallProgress,
        lessons: lessonProgress,
        nextLesson: nextLesson ? `Lesson ${currentLessonIndex + 1}: ${nextLesson.lesson_title}` : 'Course Complete',
        currentLessonIndex: Math.max(0, currentLessonIndex)
      };
    } catch (error) {
      console.error('Error getting course progress summary:', error);
      return { totalLessons: 0, completedLessons: 0, overallProgress: 0, lessons: [], nextLesson: 'Lesson 1', currentLessonIndex: 0 };
    }
  }
};