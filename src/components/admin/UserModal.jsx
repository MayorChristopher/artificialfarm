import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Calendar, Shield, UserCheck, Settings, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const UserModal = ({ user, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user',
    status: 'active',
    is_admin: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active',
        is_admin: user.role === 'admin'
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (mode === 'view') return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          status: formData.status,
          is_admin: formData.role === 'admin'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: "User updated successfully" });
      onSave();
      onClose();
    } catch (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900/95 via-green-800/90 to-green-900/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-yellow-400/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            {mode === 'view' ? 'View User' : 'Edit User'}
          </h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Full Name</label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              disabled={mode === 'view'}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <Input
              value={formData.email}
              disabled
              className="bg-white/5 border-white/10 text-white/50"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Role & Permissions
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              disabled={mode === 'view'}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none [&>option]:bg-green-900 [&>option]:text-white"
            >
              <option value="user">👤 User - Basic access to courses and content</option>
              <option value="instructor">👨‍🏫 Instructor - Can create and manage courses</option>
              <option value="moderator">🛡️ Moderator - Can manage users and content</option>
              <option value="admin">⚡ Admin - Full system access</option>
            </select>
            {formData.role === 'admin' && (
              <div className="mt-2 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-xs">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-semibold">⚠️ Critical Access Level</span>
                </div>
                <p className="mt-1">Admin role grants full system access including user management, content control, and system settings.</p>
              </div>
            )}
            {formData.role === 'moderator' && (
              <div className="mt-2 p-3 bg-purple-400/10 border border-purple-400/20 rounded-lg text-purple-400 text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span className="font-semibold">🛡️ Elevated Access</span>
                </div>
                <p className="mt-1">Moderator can manage users and content but cannot access system settings.</p>
              </div>
            )}
            {formData.role === 'instructor' && (
              <div className="mt-2 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg text-blue-400 text-xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">👨🏫 Teaching Access</span>
                </div>
                <p className="mt-1">Instructor can create and manage courses and educational content.</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Account Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              disabled={mode === 'view'}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none [&>option]:bg-green-900 [&>option]:text-white"
            >
              <option value="active">✅ Active - Full access to platform</option>
              <option value="inactive">⏸️ Inactive - Limited access</option>
              <option value="suspended">🚫 Suspended - Account temporarily disabled</option>
              <option value="pending">⏳ Pending - Awaiting verification</option>
            </select>
            {formData.status === 'suspended' && (
              <div className="mt-2 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-xs">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span className="font-semibold">🚫 Account Suspended</span>
                </div>
                <p className="mt-1">Suspended users cannot access the platform until status is changed.</p>
              </div>
            )}
            {formData.status === 'pending' && (
              <div className="mt-2 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">⏳ Verification Pending</span>
                </div>
                <p className="mt-1">User account is awaiting email verification or admin approval.</p>
              </div>
            )}
          </div>

          {user && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                Joined: {user.joinDate}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} className="flex-1 btn-secondary">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          {mode === 'edit' && (
            <Button onClick={handleSave} disabled={loading} className="flex-1 btn-gradient">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;