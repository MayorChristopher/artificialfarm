
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TrainingProgramCard from '@/components/training/TrainingProgramCard';
import LearningResourceCard from '@/components/training/LearningResourceCard';

const TrainingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingVideo, setWatchingVideo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEnrollments();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setLoading(true);
    const [programsRes, resourcesRes] = await Promise.all([
      supabase.from('courses').select('*').limit(3),
      supabase.from('journey_content').select('*').filter('type', 'in', '("video","research")').limit(4)
    ]);

    if (programsRes.error) toast({ title: "Error", description: programsRes.error.message, variant: 'destructive' });
    else setTrainingPrograms(programsRes.data);

    if (resourcesRes.error) toast({ title: "Error", description: resourcesRes.error.message, variant: 'destructive' });
    else {
      const formattedResources = resourcesRes.data.map(r => ({
        id: r.id,
        title: r.title,
        type: r.type === 'research' ? 'pdf' : 'video',
        duration: 'N/A',
        pages: 'N/A',
        downloads: Math.floor(Math.random() * 3000),
        description: r.description
      }));
      setLearningResources(formattedResources);
    }
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase.from('course_enrollments').select('*').eq('user_id', user.id);
    if (!error) setEnrolledPrograms(data);
  };

  const handleEnroll = async (programId) => {
    if (!isAuthenticated) {
      toast({ title: 'Login Required', description: 'Please login to enroll.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('course_enrollments').insert({ user_id: user.id, course_id: programId });
    if (error) toast({ title: 'Enrollment failed', description: error.message, variant: 'destructive' });
    else {
      toast({ title: 'Enrollment successful!' });
      fetchEnrollments();
    }
  };

  const handleWatch = (id, title) => setWatchingVideo({ title, url: 'https://www.youtube.com/embed/3lpnk2Cou1w' });
  const handleDownload = (id, title) => window.open('https://www.un.org/en/ga/69/meetings/summitonclimatechange/2014/csos_report_climate_agriculture_food_security.pdf', '_blank');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-white/70">Loading training programs...</p></div>;
  }

  return (
    <>
      <Helmet><title>Training Programs - Artificial Farm Academy</title></Helmet>
      <section className="relative py-20"><div className="container mx-auto px-4 relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto"><h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Training <span className="text-yellow-400">Programs</span></h1></motion.div></div></section>
      <section className="py-20"><div className="container mx-auto px-4"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured <span className="text-yellow-400">Programs</span></h2></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">{trainingPrograms.map((program, index) => (<TrainingProgramCard key={program.id} program={program} index={index} isEnrolled={enrolledPrograms.some(e => e.course_id === program.id)} progress={enrolledPrograms.find(e => e.course_id === program.id)?.progress || 0} onEnroll={() => handleEnroll(program.id)} onStartTraining={() => handleWatch(program.id, program.title)} />))}</div></div></section>
      <section className="py-20 bg-yellow-900/20"><div className="container mx-auto px-4"><div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Learning <span className="text-yellow-400">Resources</span></h2></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8">{learningResources.map((resource, index) => (<LearningResourceCard key={resource.id} resource={resource} index={index} onDownload={handleDownload} onWatch={handleWatch} />))}</div></div></section>
      {!isAuthenticated && (<section className="py-20"><div className="container mx-auto px-4"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="glass-effect rounded-3xl p-8 md:p-12 text-center"><h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start Your <span className="text-yellow-400">Training Journey</span></h2><div className="flex flex-col sm:flex-row items-center justify-center gap-4"><Button onClick={() => window.location.href = '/register'} className="btn-primary text-lg px-8 py-4 rounded-full">Create Account & Enroll</Button></div></motion.div></div></section>)}
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

export default TrainingPage;
