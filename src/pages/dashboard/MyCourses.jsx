import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Play,
  Clock,
  Award,
  Search,
  Filter,
  Calendar,
  Users,
  Star,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUserCourses();
  }, [user]);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      console.log('Fetching courses for user:', user?.id);

      // First, let's check if the table exists and what data we have
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
             *,
             courses (
               id,
               title,
               description,
               duration,
               category,
               instructor,
               lessons,
               price,
               level,
               rating,
               students
             )
           `)
        .eq('user_id', user?.id);

      console.log('Enrollments data:', enrollments);
      console.log('Enrollments error:', error);

      if (error) {
        console.error('Supabase error:', error);
        toast({ title: 'Error', description: `Could not load courses: ${error.message}`, variant: 'destructive' });

        // If table doesn't exist, let's create some sample data for testing
        if (error.code === '42P01') { // Table doesn't exist
          console.log('Table course_enrollments does not exist, creating sample data');
          setCourses([
            {
              id: '1',
              user_id: user?.id,
              course_id: '1',
              progress: 25,
              created_at: new Date().toISOString(),
              courses: {
                id: '1',
                title: 'Introduction to Smart Farming',
                description: 'Learn the basics of modern agricultural technology',
                duration: '4 weeks',
                category: 'Technology',
                instructor: 'Dr. Sarah Johnson',
                lessons: 12,
                price: '0',
                level: 'Beginner',
                rating: 4.5,
                students: 150
              }
            },
            {
              id: '2',
              user_id: user?.id,
              course_id: '2',
              progress: 0,
              created_at: new Date().toISOString(),
              courses: {
                id: '2',
                title: 'Sustainable Agriculture Practices',
                description: 'Master eco-friendly farming techniques',
                duration: '6 weeks',
                category: 'Sustainability',
                instructor: 'Prof. Michael Chen',
                lessons: 18,
                price: '0',
                level: 'Intermediate',
                rating: 4.8,
                students: 89
              }
            }
          ]);
          return;
        }
      } else {
        setCourses(enrollments || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({ title: 'Error', description: 'Could not load courses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleCourseAction = (action, courseId) => {
    switch (action) {
      case 'resume':
      case 'continue':
        navigate(`/dashboard/courses/${courseId}/content`);
        break;
      case 'download':
        toast({ title: 'Download Started', description: 'Course materials are being prepared for download.' });
        break;
      case 'certificate':
        toast({ title: 'Certificate', description: 'Generating your certificate...' });
        break;
      default:
        toast({ title: 'Action', description: `${action} action triggered` });
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-white/70';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courses?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'in-progress' && course.progress > 0 && course.progress < 100) ||
      (filterStatus === 'completed' && course.progress === 100) ||
      (filterStatus === 'not-started' && course.progress === 0);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-green-900" />
          </div>
          <p className="text-white/70">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Courses - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Manage your enrolled courses, track progress, and access course materials." />
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
              <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
              <p className="text-white/70">
                {courses.length} enrolled course{courses.length !== 1 ? 's' : ''} •
                {courses.filter(c => c.progress === 100).length} completed
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchUserCourses}
                className="bg-white/5 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More Courses
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'in-progress', 'completed', 'not-started'].map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? 'bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg' : 'bg-white/5 hover:bg-white/15 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 border border-white/25 hover:border-white/40'}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No courses found' : 'No courses enrolled'}
              </h3>
              <p className="text-white/70 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start your learning journey by enrolling in our agricultural courses!'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Available Courses
                </Button>
              )}
            </motion.div>
          ) : (
            filteredCourses.map((enrollment, index) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-green-400 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white truncate">
                        {enrollment.courses?.title || 'Course Title'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollment.progress === 100
                        ? 'bg-green-500/20 text-green-400'
                        : enrollment.progress > 0
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {enrollment.progress === 100 ? 'Completed' :
                          enrollment.progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>

                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {enrollment.courses?.description || 'Course description...'}
                    </p>

                    <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-white/60 mb-4 flex-wrap">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {enrollment.courses?.duration || '2h 30m'}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {enrollment.courses?.instructor || 'Instructor'}
                      </div>
                      <div className="flex items-center text-white/70">
                        <Star className="w-3 h-3 mr-1" />
                        {enrollment.courses?.level || 'General'}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Progress</span>
                        <span className={getProgressColor(enrollment.progress)}>
                          {enrollment.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => handleCourseAction('resume', enrollment.course_id)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300 flex-1 text-sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {enrollment.progress === 100 ? 'Review' : 'Continue'}
                      </Button>
                      <Button
                        onClick={() => handleCourseAction('download', enrollment.course_id)}
                        className="bg-white/5 hover:bg-white/15 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 text-sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      {enrollment.progress === 100 && (
                        <Button
                          onClick={() => handleCourseAction('certificate', enrollment.course_id)}
                          className="bg-white/5 hover:bg-white/15 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40 text-sm"
                        >
                          <Award className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
