import { supabase } from './supabase';

export const lessonProgressService = {
  _tableExists: null,
  _cache: new Map(),
  _cacheTimeout: 60000, // 1 minute cache timeout

  // Check if lesson_progress table exists
  async checkTableExists() {
    if (this._tableExists !== null) return this._tableExists;
    
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .select('id')
        .limit(1);
      
      this._tableExists = !error || (error.code !== '42P01' && error.code !== 'PGRST116');
      return this._tableExists;
    } catch (error) {
      console.warn('Table existence check failed:', error);
      this._tableExists = false;
      return false;
    }
  },
  async getLessonProgress(userId, courseId) {
    if (!userId || !courseId) return [];

    const cacheKey = `progress_${userId}_${courseId}`;
    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this._cacheTimeout) {
      return cached.data;
    }

    const tableExists = await this.checkTableExists();
    if (!tableExists) {
      const mockData = this.getMockLessonProgress(courseId);
      this._cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return mockData;
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
      
      const result = data || [];
      this._cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Unexpected error fetching lesson progress:', error);
      return this.getMockLessonProgress(courseId);
    }
  },

  getMockLessonProgress(courseId) {
    const mockData = {
      'smart-farming-basics': [
        { lesson_id: 'lesson-1', lesson_title: 'Introduction to Smart Farming', completed: false, watched_percentage: 0, time_spent: 0, score: 0 },
        { lesson_id: 'lesson-2', lesson_title: 'Soil Analysis Techniques', completed: false, watched_percentage: 0, time_spent: 0, score: 0 },
        { lesson_id: 'lesson-3', lesson_title: 'Irrigation Systems', completed: false, watched_percentage: 0, time_spent: 0, score: 0 },
        { lesson_id: 'lesson-4', lesson_title: 'Crop Monitoring', completed: false, watched_percentage: 0, time_spent: 0, score: 0 }
      ],
      default: [
        { lesson_id: 'lesson-1', lesson_title: 'Course Introduction', completed: false, watched_percentage: 0, time_spent: 0, score: 0 },
        { lesson_id: 'lesson-2', lesson_title: 'Basic Concepts', completed: false, watched_percentage: 0, time_spent: 0, score: 0 },
        { lesson_id: 'lesson-3', lesson_title: 'Practical Applications', completed: false, watched_percentage: 0, time_spent: 0, score: 0 }
      ]
    };
    return mockData[courseId] || mockData.default;
  },

  async updateLessonProgress(userId, courseId, lessonId, progressData) {
    if (!userId || !courseId || !lessonId) {
      console.error('Missing required parameters for lesson progress update');
      return null;
    }

    const tableExists = await this.checkTableExists();
    if (!tableExists) {
      console.warn('lesson_progress table does not exist. Using local storage fallback.');
      this.saveProgressLocally(userId, courseId, lessonId, progressData);
      return { success: true, fallback: true };
    }

    try {
      const updateData = {
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        lesson_title: progressData.lessonTitle || 'Untitled Lesson',
        completed: Boolean(progressData.completed),
        completion_date: progressData.completed ? new Date().toISOString() : null,
        time_spent: Math.max(0, progressData.timeSpent || 0),
        score: Math.min(100, Math.max(0, progressData.score || 0)),
        watched_percentage: Math.min(100, Math.max(0, progressData.watchedPercentage || 0)),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert(updateData, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) {
        console.error('Database error updating lesson progress:', error);
        this.saveProgressLocally(userId, courseId, lessonId, progressData);
        return { success: true, fallback: true };
      }

      // Clear relevant caches
      this.clearUserCache(userId, courseId);

      // Update overall course progress asynchronously
      this.updateCourseProgress(userId, courseId).catch(err => 
        console.error('Error updating course progress:', err)
      );
      
      return data;
    } catch (error) {
      console.error('Unexpected error updating lesson progress:', error);
      this.saveProgressLocally(userId, courseId, lessonId, progressData);
      return { success: true, fallback: true };
    }
  },

  // Calculate and update overall course progress with improved logic
  async updateCourseProgress(userId, courseId) {
    if (!userId || !courseId) return { progress: 0, hoursSpent: 0, averageScore: 0 };

    try {
      // Get all lesson progress for this course
      const lessonProgress = await this.getLessonProgress(userId, courseId);
      
      if (lessonProgress.length === 0) return { progress: 0, hoursSpent: 0, averageScore: 0 };

      // More accurate completion calculation
      const completedLessons = lessonProgress.filter(lesson => 
        lesson.completed || lesson.watched_percentage >= 90
      ).length;
      const totalLessons = lessonProgress.length;
      const overallProgress = Math.round((completedLessons / totalLessons) * 100);
      
      const totalTimeSpent = lessonProgress.reduce((sum, lesson) => sum + (lesson.time_spent || 0), 0);
      const completedLessonScores = lessonProgress.filter(lesson => lesson.completed && lesson.score > 0);
      const averageScore = completedLessonScores.length > 0 
        ? Math.round(completedLessonScores.reduce((sum, lesson) => sum + lesson.score, 0) / completedLessonScores.length)
        : 0;

      // Find current lesson (first incomplete lesson)
      const currentLesson = lessonProgress.find(lesson => 
        !lesson.completed && lesson.watched_percentage < 90
      );
      const currentLessonId = currentLesson ? currentLesson.lesson_id : 
        (overallProgress === 100 ? null : lessonProgress[lessonProgress.length - 1]?.lesson_id);

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
        return { progress: 0, hoursSpent: 0, averageScore: 0 };
      }

      const result = { 
        progress: overallProgress, 
        hoursSpent: Math.round(totalTimeSpent / 60 * 10) / 10, 
        averageScore 
      };
      
      return result;
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

  // Update video watch percentage with better completion logic
  async updateVideoProgress(userId, courseId, lessonId, lessonTitle, watchedPercentage, timeSpent = 0) {
    const completed = watchedPercentage >= 90; // Increased threshold for completion
    const score = completed ? Math.min(100, 80 + Math.round(watchedPercentage / 5)) : 0; // Dynamic scoring
    
    return this.updateLessonProgress(userId, courseId, lessonId, {
      lessonTitle,
      completed,
      timeSpent: Math.max(timeSpent, 0),
      watchedPercentage: Math.min(100, Math.max(0, watchedPercentage)),
      score
    });
  },

  async getCourseProgressSummary(userId, courseId) {
    if (!userId || !courseId) {
      return { totalLessons: 0, completedLessons: 0, overallProgress: 0, lessons: [], nextLesson: 'No course selected', currentLessonIndex: 0 };
    }

    const cacheKey = `summary_${userId}_${courseId}`;
    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 30000) {
      return cached.data;
    }

    try {
      const lessonProgress = await this.getLessonProgress(userId, courseId);
      const completedLessons = lessonProgress.filter(lesson => 
        lesson.completed || lesson.watched_percentage >= 90
      ).length;
      const totalLessons = lessonProgress.length;
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      const nextLesson = lessonProgress.find(lesson => 
        !lesson.completed && lesson.watched_percentage < 90
      );
      const currentLessonIndex = nextLesson ? 
        lessonProgress.findIndex(l => l.lesson_id === nextLesson.lesson_id) : 
        lessonProgress.length - 1;
      
      const result = {
        totalLessons,
        completedLessons,
        overallProgress,
        lessons: lessonProgress,
        nextLesson: nextLesson ? 
          `Lesson ${currentLessonIndex + 1}: ${nextLesson.lesson_title}` : 
          (overallProgress === 100 ? 'Course Complete! 🎉' : 'Continue Learning'),
        currentLessonIndex: Math.max(0, currentLessonIndex)
      };

      this._cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Error getting course progress summary:', error);
      return { 
        totalLessons: 0, 
        completedLessons: 0, 
        overallProgress: 0, 
        lessons: [], 
        nextLesson: 'Error loading progress', 
        currentLessonIndex: 0 
      };
    }
  },

  // Helper methods
  saveProgressLocally(userId, courseId, lessonId, progressData) {
    const key = `local_progress_${userId}_${courseId}_${lessonId}`;
    localStorage.setItem(key, JSON.stringify({
      ...progressData,
      timestamp: Date.now()
    }));
  },

  clearUserCache(userId, courseId) {
    const keysToDelete = [];
    for (const [key] of this._cache) {
      if (key.includes(`${userId}_${courseId}`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this._cache.delete(key));
  },

  // Cleanup old cache entries
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this._cache) {
      if (now - value.timestamp > this._cacheTimeout * 2) {
        this._cache.delete(key);
      }
    }
  }
};

// Cleanup cache periodically
setInterval(() => {
  lessonProgressService.cleanupCache();
}, 300000); // Every 5 minutes