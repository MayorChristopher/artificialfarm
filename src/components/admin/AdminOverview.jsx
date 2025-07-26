import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminOverview = ({
  recentUsers,
  recentContent,
  onAnalytics,
  onUpload
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{user.name}</h4>
                  <p className="text-white/60 text-sm">{user.email}</p>
                  <p className="text-white/50 text-xs">Joined: {user.joinDate}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {user.status}
                  </span>
                  <p className="text-white/60 text-xs mt-1">{user.courses} courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Content</h3>
          <div className="space-y-3">
            {recentContent.map((content) => (
              <div key={content.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium">{content.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${content.status === 'published'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {content.status}
                  </span>
                </div>
                <p className="text-white/60 text-sm">by {content.author}</p>
                <p className="text-white/50 text-xs">{content.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button onClick={onAnalytics} className="btn-primary h-20 flex-col">
          <BarChart3 className="w-8 h-8 mb-2" />
          View Analytics
        </Button>
        <Button onClick={onUpload} className="btn-secondary h-20 flex-col">
          <Upload className="w-8 h-8 mb-2" />
          Upload Content
        </Button>
      </div>
    </div>
  );
};

export default AdminOverview;