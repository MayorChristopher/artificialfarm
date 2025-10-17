import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Bell, Check, RefreshCw } from 'lucide-react';

const NotificationPanel = ({ notifications, onNotificationAction }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [refreshing, setRefreshing] = useState(false);
  const unreadCount = localNotifications.filter(n => !n.read).length;

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleNotificationClick = (notificationId) => {
    setLocalNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    onNotificationAction(notificationId);
    
    toast({
      title: "Notification Read",
      description: "Notification marked as read"
    });
  };

  const markAllAsRead = () => {
    setLocalNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All Notifications Read",
      description: `Marked ${unreadCount} notifications as read`
    });
  };

  const refreshNotifications = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Notifications Refreshed",
        description: "Latest notifications loaded"
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          onClick={refreshNotifications}
          disabled={refreshing}
          className="bg-transparent hover:bg-white/10 p-2"
        >
          <RefreshCw className={`w-4 h-4 text-white/70 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {localNotifications.slice(0, 5).map((notification) => (
          <motion.div 
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${
              notification.read ? 'bg-white/5' : 'bg-yellow-400/10 border border-yellow-400/20'
            }`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium mb-1">{notification.title}</h4>
                <p className="text-white/70 text-xs mb-2">{notification.message}</p>
                <span className="text-white/50 text-xs">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
                {notification.read && (
                  <Check className="w-3 h-3 text-green-400" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex space-x-2 mt-4">
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm border border-green-500/30"
          >
            <Check className="w-3 h-3 mr-1" />
            Mark All Read
          </Button>
        )}
        <Button 
          onClick={() => toast({
            title: "📬 All Notifications",
            description: "Opening full notification center..."
          })}
          className="flex-1 btn-secondary text-sm"
        >
          View All
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationPanel;