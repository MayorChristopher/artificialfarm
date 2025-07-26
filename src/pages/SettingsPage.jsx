import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const SettingsPage = () => {
  const { user, profile, isAdmin, signOut, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      avatar_url: form.avatar_url,
    }).eq('id', user.id);
    setLoading(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      // Immediately refresh profile from Supabase so avatar and info update everywhere
      await refreshProfile();
      toast({ title: 'Profile updated', description: 'Your profile was updated successfully.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      toast({ title: 'Password mismatch', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.newPassword });
    setLoading(false);
    if (error) {
      toast({ title: 'Password update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated', description: 'Your password was updated successfully.' });
      setForm({ ...form, password: '', newPassword: '', confirmNewPassword: '' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - Artificial Farm Academy</title>
        <meta name="description" content="Manage your account settings and profile." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex items-center justify-center py-8 px-2 sm:px-4"
      >
        <div className="w-full max-w-lg glass-effect rounded-2xl p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>
          <div className="flex flex-col items-center mb-6">
            <img
              src={form.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.full_name || user.email)}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow mb-2 bg-white object-cover"
            />
            <span className="text-white/70 text-sm">Profile Avatar</span>
          </div>
          <hr className="border-yellow-400/30 my-6" />
          <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="full_name" className="text-white">Full Name</Label>
              <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
              <Input id="avatar_url" name="avatar_url" value={form.avatar_url} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <Button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Save Changes'}</Button>
          </form>

          <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword" className="text-white">Confirm New Password</Label>
              <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={form.confirmNewPassword} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <Button type="submit" disabled={loading} className="btn-secondary w-full">{loading ? 'Updating...' : 'Update Password'}</Button>
          </form>

          <div className="mt-8">
            <div className="text-white/70 mb-2">Role: <span className="font-semibold text-white">{isAdmin ? 'Admin' : 'Student'}</span></div>
            <div className="text-white/70 mb-2">Email: <span className="font-semibold text-white">{user.email}</span></div>
            <Button onClick={signOut} className="btn-destructive w-full mt-4">Sign Out</Button>
          </div>



          {/* Download Account Data */}
          <hr className="border-yellow-400/30 my-6" />
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Download Account Data</h2>
            <Button
              className="btn-secondary w-full"
              onClick={() => {
                const data = JSON.stringify(profile, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'account-data.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download My Data
            </Button>
            <span className="text-white/60 text-xs block mt-2">Download a copy of your profile data as JSON.</span>
          </div>

          {/* Account Deletion */}
          <hr className="border-yellow-400/30 my-6" />
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Delete Account</h2>
            <Button
              className="btn-destructive w-full"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Replace with your actual delete logic:
                  toast({ title: "Account Deletion", description: "🚧 Account deletion coming soon!" });
                }
              }}
            >
              Delete My Account
            </Button>
            <span className="text-white/60 text-xs block mt-2">This action is irreversible. All your data will be permanently deleted.</span>
          </div>
        </div>
      </motion.div>
      <div className="hidden md:flex mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900 text-yellow-400 hover:bg-green-800 transition-colors font-bold shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default SettingsPage;
