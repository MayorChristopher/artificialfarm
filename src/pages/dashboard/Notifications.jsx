import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  X,
  Trash2,
  Filter,
  Search,
  Clock,
  Star,
  AlertCircle,
  Info,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // For now, we'll use mock data since we don't have a notifications table
      // In a real app, you'd fetch from a notifications table
      const mockNotifications = [
        {
          id: 1,
          title: 'Course Completed',
          message: 'Congratulations! You have completed "Modern Farming Techniques" course.',
          type: 'success',
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          icon: CheckCircle,
          color: 'text-green-400'
        },
        {
          id: 2,
          title: 'New Course Available',
          message: 'A new course "Precision Agriculture" is now available for enrollment.',
          type: 'info',
          read: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          icon: Info,
          color: 'text-blue-400'
        },
        {
          id: 3,
          title: 'Certificate Ready',
          message: 'Your certificate for "Sustainable Agriculture" is ready for download.',
          type: 'success',
          read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          icon: Star,
          color: 'text-yellow-400'
        },
        {
          id: 4,
          title: 'Maintenance Notice',
          message: 'The platform will be under maintenance on Sunday from 2-4 AM.',
          type: 'warning',
          read: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          icon: AlertCircle,
          color: 'text-orange-400'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load notifications', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // In a real app, you'd update the notification in the database
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
      toast({ title: 'Success', description: 'Notification marked as read' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not mark notification as read', variant: 'destructive' });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // In a real app, you'd delete the notification from the database
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast({ title: 'Success', description: 'Notification deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete notification', variant: 'destructive' });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast({ title: 'Success', description: 'All notifications marked as read' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not mark all notifications as read', variant: 'destructive' });
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    return date.toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-orange-500/20 text-orange-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Bell className="w-8 h-8 text-green-900" />
          </div>
          <p className="text-white/70">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notifications - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Manage your notifications and stay updated with your learning progress." />
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
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-white/70">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''} •
                {unreadCount} unread
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} className="btn-secondary">
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Button onClick={() => setShowSettings(!showSettings)} className="btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'success', 'info', 'warning', 'error'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                  className="btn-secondary"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Notification Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Course Updates', description: 'Get notified about new courses and updates' },
                { label: 'Progress Alerts', description: 'Receive notifications about your learning progress' },
                { label: 'Certificate Ready', description: 'Get notified when certificates are available' },
                { label: 'System Notifications', description: 'Receive important system announcements' }
              ].map((setting, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <input
                    type="checkbox"
                    id={`setting-${index}`}
                    defaultChecked={true}
                    className="w-4 h-4 text-yellow-400 bg-white/10 border-white/20 rounded focus:ring-yellow-400"
                  />
                  <div>
                    <label htmlFor={`setting-${index}`} className="text-white font-medium">
                      {setting.label}
                    </label>
                    <p className="text-white/60 text-sm">{setting.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You\'re all caught up! No new notifications.'
                }
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-effect rounded-2xl p-6 transition-all duration-300 ${!notification.read ? 'border-l-4 border-yellow-400 bg-yellow-400/5' : ''
                  }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${notification.color.replace('text-', 'bg-')}/20 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={`w-6 h-6 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        )}
                      </div>
                    </div>

                    <p className="text-white/70 text-sm mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(notification.created_at)}</span>
                      </div>

                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="btn-secondary"
                            size="sm"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="btn-secondary"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

export default Notifications;
