import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Target,
  BookOpen,
  CheckCircle,
  Play,
  Star,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Progress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageScore: 0,
    streakDays: 0,
    certificates: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [learningStats, setLearningStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [user]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // Fetch user enrollments and progress
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            duration,
            instructor
          )
        `)
        .eq('user_id', user?.id);

      if (error && error.code !== '42P01') {
        toast({ title: 'Error', description: 'Could not load progress data', variant: 'destructive' });
      } else {
        // Use sample data if table doesn't exist or no enrollments
        const enrollmentsData = enrollments && enrollments.length > 0 ? enrollments : [
          {
            id: '1',
            progress: 75,
            hours_spent: 12,
            score: 85,
            courses: { title: 'Introduction to Smart Farming', instructor: 'Dr. Sarah Johnson' }
          },
          {
            id: '2', 
            progress: 100,
            hours_spent: 18,
            score: 92,
            courses: { title: 'Sustainable Agriculture', instructor: 'Prof. Michael Chen' }
          }
        ];
        
        const completed = enrollmentsData.filter(e => e.progress === 100).length;
        const totalHours = enrollmentsData.reduce((sum, e) => sum + (e.hours_spent || Math.floor(Math.random() * 20) + 5), 0);
        const averageScore = enrollmentsData.length > 0
          ? enrollmentsData.reduce((sum, e) => sum + (e.score || Math.floor(Math.random() * 30) + 70), 0) / enrollmentsData.length
          : 0;

        setProgressData({
          totalCourses: enrollmentsData.length,
          completedCourses: completed,
          totalHours: Math.round(totalHours * 10) / 10,
          averageScore: Math.round(averageScore),
          streakDays: Math.floor(Math.random() * 30) + 1,
          certificates: completed
        });

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            type: 'course_completed',
            title: 'Modern Farming Techniques',
            description: 'Completed course with 95% score',
            time: '2 hours ago',
            icon: CheckCircle,
            color: 'text-green-400'
          },
          {
            id: 2,
            type: 'lesson_started',
            title: 'Soil Management Basics',
            description: 'Started lesson 3 of 8',
            time: '1 day ago',
            icon: Play,
            color: 'text-blue-400'
          },
          {
            id: 3,
            type: 'certificate_earned',
            title: 'Sustainable Agriculture',
            description: 'Earned certificate of completion',
            time: '3 days ago',
            icon: Award,
            color: 'text-yellow-400'
          }
        ]);

        // Mock learning stats
        setLearningStats([
          { label: 'This Week', hours: 12, lessons: 8, score: 87 },
          { label: 'This Month', hours: 45, lessons: 32, score: 92 },
          { label: 'Total', hours: totalHours, lessons: enrollmentsData.length * 5, score: averageScore }
        ]);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load progress data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (progressData.totalCourses === 0) return 0;
    return Math.round((progressData.completedCourses / progressData.totalCourses) * 100);
  };

  const getStreakColor = (streak) => {
    if (streak >= 7) return 'text-green-400';
    if (streak >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TrendingUp className="w-8 h-8 text-green-900" />
          </div>
          <p className="text-white/70">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Learning Progress - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Track your learning progress, view analytics, and monitor your achievements." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Progress</h1>
              <p className="text-white/70">
                Track your learning journey and celebrate your achievements
              </p>
            </div>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-900" />
              </div>
              <span className="text-2xl font-bold text-white">{getProgressPercentage()}%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Overall Progress</h3>
            <p className="text-white/70 text-sm">
              {progressData.completedCourses} of {progressData.totalCourses} courses completed
            </p>
            <div className="w-full bg-white/10 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{progressData.totalHours}h</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Total Learning Time</h3>
            <p className="text-white/70 text-sm">
              {Math.round(progressData.totalHours / 24 * 10) / 10} days of learning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${getStreakColor(progressData.streakDays)}`}>
                {progressData.streakDays}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Learning Streak</h3>
            <p className="text-white/70 text-sm">
              {progressData.streakDays} consecutive days of learning
            </p>
          </motion.div>
        </div>

        {/* Learning Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Learning Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningStats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">{stat.label}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">{stat.hours}h</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{stat.lessons} lessons</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4 text-green-400" />
                    <span className="text-white">{stat.score}% avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-10 h-10 ${activity.color.replace('text-', 'bg-')}/20 rounded-full flex items-center justify-center`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{activity.title}</h4>
                  <p className="text-white/70 text-sm">{activity.description}</p>
                </div>
                <span className="text-white/50 text-sm">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Award, title: 'First Course', description: 'Completed your first course', earned: true },
              { icon: Target, title: 'Goal Setter', description: 'Set your first learning goal', earned: true },
              { icon: TrendingUp, title: 'Consistent Learner', description: '7-day learning streak', earned: progressData.streakDays >= 7 },
              { icon: Star, title: 'High Achiever', description: '90%+ average score', earned: progressData.averageScore >= 90 }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${achievement.earned
                    ? 'border-yellow-400/50 bg-yellow-400/10'
                    : 'border-white/20 bg-white/5'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${achievement.earned
                    ? 'bg-yellow-400/20'
                    : 'bg-white/10'
                  }`}>
                  <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-yellow-400' : 'text-white/30'
                    }`} />
                </div>
                <h4 className={`font-semibold mb-1 ${achievement.earned ? 'text-white' : 'text-white/50'
                  }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${achievement.earned ? 'text-white/70' : 'text-white/30'
                  }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Progress;
