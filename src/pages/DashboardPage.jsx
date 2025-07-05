import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Play,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ActiveCourses from '@/components/dashboard/ActiveCourses';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import QuickActions from '@/components/dashboard/QuickActions';

const DashboardPage = () => {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const defaultProgress = { certificates: 0, hoursLearned: 0 };
  const progress = profile?.progress || { certificates: 0, hoursLearned: 0 };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authLoading) {
        toast({
          title: 'Loading Delay',
          description: 'Your session is taking too long to load. Please refresh or try logging out.',
          variant: 'destructive',
        });
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [authLoading]);
  const hasFetched = useRef(false);

  // Persistent dashboard cache using sessionStorage (survives reloads in the same tab)
  const dashboardCache = useRef({ enrollments: null, consultations: null, notifications: null });

  // Load cache from sessionStorage on mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('dashboardCache');
      console.log('[Dashboard] sessionStorage.getItem("dashboardCache"):', cached);
      if (cached) {
        const parsed = JSON.parse(cached);
        dashboardCache.current = parsed;
        console.log('[Dashboard] Loaded dashboardCache from sessionStorage:', parsed);
      }
    } catch (e) {
      console.warn('[Dashboard] Failed to parse dashboardCache from sessionStorage:', e);
    }
  }, []);

  useEffect(() => {
    const handleDashboardRefresh = () => {
      // Always reload dashboard data when signaled
      hasFetched.current = false;
      loadDashboardData();
    };
    window.addEventListener('dashboard:refresh', handleDashboardRefresh);
    if (!authLoading && user && profile && !hasFetched.current) {
      hasFetched.current = true;
      if (
        dashboardCache.current.enrollments !== null &&
        dashboardCache.current.consultations !== null &&
        dashboardCache.current.notifications !== null
      ) {
        setEnrollments(dashboardCache.current.enrollments);
        setConsultations(dashboardCache.current.consultations);
        setNotifications(dashboardCache.current.notifications);
        setLoading(false);
      } else {
        loadDashboardData();
      }
    }
    return () => {
      window.removeEventListener('dashboard:refresh', handleDashboardRefresh);
    };
  }, [authLoading, user, profile]);


  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [enrollmentsData, consultationsData] = await Promise.all([
        fetchEnrollments(),
        fetchConsultations()
      ]);
      const notificationsData = loadNotifications();
      dashboardCache.current.enrollments = enrollmentsData;
      dashboardCache.current.consultations = consultationsData;
      dashboardCache.current.notifications = notificationsData;
      // Persist to sessionStorage
      try {
        sessionStorage.setItem('dashboardCache', JSON.stringify(dashboardCache.current));
        console.log('[Dashboard] Saved dashboardCache to sessionStorage:', dashboardCache.current);
      } catch (e) {
        console.warn('[Dashboard] Failed to save dashboardCache to sessionStorage:', e);
      }
      setEnrollments(enrollmentsData);
      setConsultations(consultationsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('[Dashboard] Error loading dashboard data:', error);
      toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`*, courses (*)`)
      .eq('user_id', user.id);
    if (error) return [];
    return data || [];
  };

  const fetchConsultations = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  };

  const loadNotifications = () => {
    return [
      { id: 1, title: 'New Course Available', message: 'Check out our latest course on Smart Irrigation Systems', date: '2024-01-16', read: false, type: 'course' },
      { id: 2, title: 'Consultation Reminder', message: 'Your consultation is scheduled for tomorrow at 10:00 AM', date: '2024-01-19', read: false, type: 'reminder' }
    ];
  };

  const handleCourseAction = (action, courseId) => toast({ title: `📚 Course ${action}`, description: "🚧 Course actions aren't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  const handleNotificationAction = (notificationId) => setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif));
  const handleProfileUpdate = () => toast({ title: "👤 Profile Settings", description: "🚧 Profile settings aren't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  const handleNotificationClick = () => toast({ title: "🔔 Notifications", description: "🚧 Notification center isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-green-900 font-bold text-2xl">AFA</span></div>
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    useEffect(() => {
      navigate('/login', { replace: true });
    }, [navigate]);
    return null;
  }


  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: enrollments.length, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { icon: Award, label: 'Certificates Earned', value: profile?.progress?.certificates || 0, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    { icon: Clock, label: 'Hours Learned', value: profile?.progress?.hoursLearned || 0, color: 'text-green-400', bgColor: 'bg-green-400/10' },
    { icon: TrendingUp, label: 'Progress Rate', value: enrollments.length > 0 ? Math.round((enrollments.filter(e => e.progress === 100).length / enrollments.length) * 100) : 0, suffix: '%', color: 'text-purple-400', bgColor: 'bg-purple-400/10' }
  ];

  const activeCourses = enrollments
    .filter(enrollment => enrollment.progress < 100)
    .slice(0, 3)
    .map(enrollment => ({
      id: enrollment.course_id,
      title: enrollment.courses?.title || 'Course Title',
      progress: enrollment.progress || 0,
      nextLesson: `Lesson ${Math.floor((enrollment.progress || 0) / 10) + 1}`,
      instructor: enrollment.courses?.instructor || 'Instructor',
      thumbnail: enrollment.courses?.thumbnail || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'
    }));

  const recentActivity = [
    ...enrollments.slice(0, 2).map(e => ({ id: e.id, type: 'course_started', title: `Enrolled in "${e.courses.title}"`, date: e.created_at, icon: Play, color: 'text-blue-400' })),
    ...consultations.slice(0, 1).map(c => ({ id: c.id, type: 'consultation_booked', title: `Booked ${c.plan} Consultation`, date: c.created_at, icon: Calendar, color: 'text-yellow-400' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingEvents = consultations
    .filter(c => c.status === 'pending' || c.status === 'confirmed')
    .slice(0, 3)
    .map(c => ({ id: c.id, title: `${c.plan} Consultation`, date: c.preferred_date || new Date(), time: c.preferred_time || 'TBC', status: c.status }));

  return (
    <>
      <Helmet>
        <title>Dashboard - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Your personal dashboard for tracking course progress, managing consultations, and accessing agricultural learning resources." />
      </Helmet>
      <DashboardHeader
        user={{
          name: profile?.full_name || user.email?.split('@')[0],
          avatar: profile?.avatar_url,
          progress: enrollments.length > 0
            ? Math.round((enrollments.filter(e => e.progress === 100).length / enrollments.length) * 100)
            : 0
        }}
        notifications={notifications}
        onProfileUpdate={handleProfileUpdate}
        onNotificationClick={handleNotificationClick}
      />
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
        <div className="flex flex-col gap-4 sm:gap-6 xl:gap-8 col-span-1 md:col-span-2">
          <ActiveCourses courses={activeCourses} onCourseAction={handleCourseAction} />
          <RecentActivity activities={recentActivity} />
        </div>
        <div className="flex flex-col gap-0 sm:gap-6 xl:gap-8 col-span-1">
          <UpcomingEvents events={upcomingEvents} />
          <NotificationPanel notifications={notifications} onNotificationAction={handleNotificationAction} />
          <QuickActions />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;