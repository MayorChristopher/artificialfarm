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
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="bg-white/3 rounded-lg p-4 flex items-center justify-between border border-white/5">
                  <div className="flex items-center space-x-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-400 font-semibold text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-medium">{user.name || 'Unknown User'}</h4>
                      <p className="text-white/60 text-sm">{user.email}</p>
                      <p className="text-white/50 text-xs">Joined: {user.joinDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {user.status || 'active'}
                    </span>
                    <p className="text-white/60 text-xs mt-1">{user.courses || 0} courses</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/3 rounded-lg p-4 text-center border border-white/5">
                <p className="text-white/60">No recent users found</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recent Content</h3>
          <div className="space-y-3">
            {recentContent && recentContent.length > 0 ? (
              recentContent.map((content) => (
                <div key={content.id} className="bg-white/3 rounded-lg p-4 border border-white/5">
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
              ))
            ) : (
              <div className="bg-white/3 rounded-lg p-4 text-center border border-white/5">
                <p className="text-white/60">No recent content found</p>
              </div>
            )}
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