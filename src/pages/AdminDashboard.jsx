import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Upload,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import AdminStats from '@/components/admin/AdminStats';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminContent from '@/components/admin/AdminContent';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';
import AdminStatsManager from '@/components/admin/AdminStatsManager';
import AdminCourseManager from '@/components/admin/AdminCourseManager';
import AdminConsultations from '@/components/admin/AdminConsultations';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboard = () => {
  const { user, profile, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);



  const loadAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchContent()
      ]);
    } catch (error) {
      toast({ title: "Error", description: "Could not load admin data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const [usersCount, coursesCount, consultationsCount, contactsCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('courses').select('id', { count: 'exact' }),
      supabase.from('consultations').select('id', { count: 'exact' }),
      supabase.from('contacts').select('id', { count: 'exact' })
    ]);

    setStats([
      { icon: Users, label: 'Total Users', value: usersCount.count?.toString() || '0', change: '+12%', color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
      { icon: BookOpen, label: 'Active Courses', value: coursesCount.count?.toString() || '0', change: '+3', color: 'text-green-400', bgColor: 'bg-green-400/10' },
      { icon: Calendar, label: 'Consultations', value: consultationsCount.count?.toString() || '0', change: '+8%', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
      { icon: MessageSquare, label: 'Messages', value: contactsCount.count?.toString() || '0', change: '+15', color: 'text-purple-400', bgColor: 'bg-purple-400/10' }
    ]);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.functions.invoke('get-users');
    if (error) {
      toast({ title: "Error fetching users", description: error.message, variant: "destructive" });
      return;
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({ title: "Error fetching profiles", description: profilesError.message, variant: "destructive" });
      return;
    }

    const usersMap = new Map(data.users.map(u => [u.id, u.email]));

    const formattedUsers = profiles?.map(userProfile => ({
      ...userProfile,
      name: userProfile.full_name || 'Unknown User',
      email: usersMap.get(userProfile.id) || 'No email found',
      joinDate: new Date(userProfile.created_at).toLocaleDateString(),
      status: 'active',
    })) || [];
    setUsers(formattedUsers);
  };

  const fetchContent = async () => {
    const [coursesData, journeyData] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('journey_content').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    const allContent = [
      ...(coursesData.data?.map(course => ({ id: course.id, title: course.title, type: 'course', author: course.instructor, date: new Date(course.created_at).toLocaleDateString(), status: course.is_published ? 'published' : 'draft' })) || []),
      ...(journeyData.data?.map(item => ({ id: item.id, title: item.title, type: item.type, author: item.author || 'Admin', date: new Date(item.created_at).toLocaleDateString(), status: 'published' })) || [])
    ];
    setContent(allContent);
  };

  const handleContentAction = (action, contentId) => {
    toast({ title: `📝 Content ${action}`, description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const handleUserAction = async (action, userId) => {
    if (action === 'delete') {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      });

      if (error) {
        toast({ title: "User deletion failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "User deleted successfully", description: `User with ID ${userId} has been removed.` });
        setUsers(users.filter(u => u.id !== userId));
      }
    } else {
      toast({ title: `👤 User ${action}`, description: "🚧 This user action isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    }
  };



  const handleUpload = () => toast({ title: "📤 Upload Feature", description: "🚧 File upload isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  const handleAnalytics = () => toast({ title: "📊 Analytics Dashboard", description: "🚧 Analytics dashboard isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  const handleBulkEmail = () => toast({ title: "📧 Bulk Email", description: "🚧 Bulk email feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'content', name: 'Content', icon: BookOpen },
    { id: 'consultations', name: 'Consultations', icon: Calendar },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const filteredUsers = useMemo(() =>
    users.filter(user =>
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  const filteredContent = useMemo(() =>
    content.filter(item =>
      (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    ), [content, searchTerm]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <AdminOverview recentUsers={users.slice(0, 3)} recentContent={content.slice(0, 3)} onAnalytics={handleAnalytics} onUpload={handleUpload} onBulkEmail={handleBulkEmail} />
            <AdminStatsManager />
          </div>
        );
      case 'courses':
        return <AdminCourseManager />;
      case 'users':
        return <AdminUsers searchTerm={searchTerm} setSearchTerm={setSearchTerm} users={filteredUsers} onUserAction={handleUserAction} currentUser={user} />;
      case 'content':
        return <AdminContent />;
      case 'consultations':
        return <AdminConsultations />;
      case 'messages':
        return <AdminMessages />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminPlaceholder activeTab={activeTab} />;
    }
  };

  if (authLoading || loading || !profile || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse"><span className="text-green-900 font-bold text-2xl">AFA</span></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Administrative dashboard for managing users, content, consultations, and system settings." />
      </Helmet>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex flex-col items-center md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
                  <div className="relative flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <div className="w-20 h-20 md:w-16 md:h-16 rounded-full border-4 border-yellow-400 shadow-xl bg-white flex items-center justify-center animate-profile-avatar overflow-hidden">
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'Admin'}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <span className="absolute inset-0 rounded-full border-2 border-yellow-400/40 animate-spin-slow pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 md:w-16 md:h-16 rounded-full border-4 border-yellow-400 shadow-xl bg-yellow-400/80 flex items-center justify-center animate-profile-avatar">
                        <Settings className="w-10 h-10 md:w-8 md:h-8 text-green-900 animate-admin-icon-spin" />
                        <span className="absolute inset-0 rounded-full border-2 border-yellow-400/40 animate-spin-slow pointer-events-none" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 drop-shadow-lg animate-admin-title-fade">Admin Dashboard</h1>
                    <p className="text-white/70 animate-admin-title-fade">
                      Admin Access · {profile?.full_name || 'Admin'}
                    </p>
                  </div>
                </div>
                {/* Custom animation keyframes for admin dashboard avatar and icon */}
                <style>{`
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          @keyframes profile-avatar-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .animate-profile-avatar { animation: profile-avatar-bounce 2.5s cubic-bezier(.68,-0.55,.27,1.55) infinite; }
          @keyframes admin-icon-spin { 100% { transform: rotate(-360deg); } }
          .animate-admin-icon-spin { animation: admin-icon-spin 10s linear infinite; }
          @keyframes admin-title-fade { 0% { opacity: 0; transform: translateY(10px);} 100% { opacity: 1; transform: translateY(0);} }
          .animate-admin-title-fade { animation: admin-title-fade 1.2s cubic-bezier(.68,-0.55,.27,1.55) both; }
        `}</style>
                <div className="flex items-center space-x-3">
                  <Button onClick={handleUpload} className="btn-primary"><Upload className="w-4 h-4 mr-2" />Upload Content</Button>
                  <Button onClick={handleBulkEmail} className="btn-secondary"><Mail className="w-4 h-4 mr-2" />Send Email</Button>
                  <Button asChild className="btn-secondary">
                    <Link to="/admin-dashboard/settings">
                      <Settings className="w-4 h-4 mr-2" />Settings
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <AdminStats stats={stats} />
          <div className="glass-effect rounded-2xl p-6 mb-8">
            <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;