import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const NotificationPanel = ({ notifications, onNotificationAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>
      
      <div className="space-y-3">
        {notifications.slice(0, 3).map((notification) => (
          <div 
            key={notification.id} 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              notification.read ? 'bg-white/5' : 'bg-yellow-400/10 border border-yellow-400/20'
            }`}
            onClick={() => onNotificationAction(notification.id)}
          >
            <h4 className="text-white text-sm font-medium mb-1">{notification.title}</h4>
            <p className="text-white/70 text-xs mb-2">{notification.message}</p>
            <span className="text-white/50 text-xs">
              {new Date(notification.date).toLocaleDateString()}
            </span>
            {!notification.read && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full float-right mt-1"></div>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        onClick={() => toast({
          title: "📬 All Notifications",
          description: "🚧 Full notification center isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        })}
        className="w-full btn-secondary text-sm mt-4"
      >
        View All Notifications
      </Button>
    </motion.div>
  );
};

export default NotificationPanel;