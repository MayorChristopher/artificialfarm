
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CourseCard from '@/components/academy/CourseCard';
import SearchFilter from '@/components/academy/SearchFilter';
import LearningResources from '@/components/academy/LearningResources';

const AcademyPage = () => {
  const { isAuthenticated, profile, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingVideo, setWatchingVideo] = useState(null);

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'crops', name: 'Crop Production' },
    { id: 'livestock', name: 'Livestock' },
    { id: 'technology', name: 'Farm Technology' },
    { id: 'business', name: 'Agribusiness' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEnrollments();
    }
  }, [isAuthenticated, user]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').eq('is_published', true);
    if (error) {
      toast({ title: 'Error loading courses', description: error.message, variant: 'destructive' });
    } else {
      setCourses(data);
    }
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase.from('course_enrollments').select('*').eq('user_id', user.id);
    if (error) {
      toast({ title: 'Error loading enrollments', description: error.message, variant: 'destructive' });
    } else {
      setEnrollments(data);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).map(course => {
    const enrollment = enrollments.find(e => e.course_id === course.id);
    return {
      ...course,
      isEnrolled: !!enrollment,
      progress: enrollment?.progress || 0
    };
  });

  const handleEnrollment = async (courseId) => {
    if (!isAuthenticated) {
      toast({ title: 'Login Required', description: 'Please login to enroll in a course.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('course_enrollments').insert({ user_id: user.id, course_id: courseId });
    if (error) {
      // Handle duplicate enrollment error in a user-friendly way
      if (error.code === '23505' || error.message?.toLowerCase().includes('duplicate')) {
        toast({ title: 'Already Enrolled', description: 'You are already enrolled in this course.', variant: 'destructive' });
      } else {
        toast({ title: 'Enrollment failed', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Enrollment successful!', description: 'You have been enrolled in the course.' });
      // Refresh enrollments so dashboard and UI update
      fetchEnrollments();
      // Also clear dashboard cache so stats update instantly
      sessionStorage.removeItem('dashboardCache');
      // Optionally, you can trigger a custom event to notify dashboard to reload
      window.dispatchEvent(new Event('dashboard:refresh'));
    }
  };

  const handleVideoPlay = (courseId, courseTitle) => setWatchingVideo({ title: courseTitle, url: 'https://www.youtube.com/embed/3lpnk2Cou1w' });
  const handleDownload = (resourceId) => window.open('https://www.un.org/en/ga/69/meetings/summitonclimatechange/2014/csos_report_climate_agriculture_food_security.pdf', '_blank');
  const handleCommunityClick = () => toast({ title: "💬 Community Feature", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-green-900 font-bold text-2xl">AFA</span></div>
          <p className="text-white/70">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Academy Portal - Artificial Farm Academy</title></Helmet>
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Academy <span className="text-yellow-400">Portal</span></h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">Master modern agriculture with expert-led courses.</p>
            {isAuthenticated && profile && (
              <div className="glass-effect rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-12 h-12 rounded-full" />
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Welcome back, {profile.full_name}!</h3>
                      <p className="text-white/70 text-sm">Continue your learning journey</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{enrollments.filter(e => e.progress === 100).length}/{courses.length}</div>
                    <div className="text-white/70 text-sm">Courses Completed</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Available <span className="text-yellow-400">Courses</span></h2>
          </motion.div>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} isAuthenticated={isAuthenticated} onVideoPlay={handleVideoPlay} onEnrollment={handleEnrollment} onDownload={handleDownload} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12"><h3 className="text-xl font-semibold text-white mb-2">No courses found</h3></div>
          )}
        </div>
      </section>
      <LearningResources onDownload={handleDownload} onCommunityClick={handleCommunityClick} />
      {!isAuthenticated && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-effect rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start Your <span className="text-yellow-400">Learning Journey</span></h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={() => window.location.href = '/register'} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 border-2 border-transparent hover:border-yellow-300">Create Free Account</Button>
                <Button onClick={() => window.location.href = '/login'} className="bg-white/5 hover:bg-white/15 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-white/15 border-2 border-white/25 hover:border-white/40">Sign In</Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      {watchingVideo && (
        <Dialog open={!!watchingVideo} onOpenChange={() => setWatchingVideo(null)}>
          <DialogContent className="bg-gray-900 border-yellow-400 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>{watchingVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={watchingVideo.url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AcademyPage;
