import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const { isAuthenticated, isAdmin, profile, loading, signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && profile) {
      const target = profile.role === 'admin' ? '/admin-dashboard' : '/dashboard';
      navigate(target, { replace: true });
    }
  }, [loading, isAuthenticated, profile, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await signIn(formData.email, formData.password);

    if (data && !profile) {
      toast({
        title: "Login Successful, but profile not found.",
        description: "Your profile may be missing or corrupted. Contact support.",
        variant: "destructive",
      });
    }

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast({
          title: "Email not verified",
          description: "Please check your inbox to verify your email before logging in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Login Successful!",
        description: "Redirecting...",
      });
    }

    setIsLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    await signInWithOAuth(provider);
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session, please wait...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Login to your Artificial Farm Academy account to access courses, track progress, and manage your agricultural learning journey." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center"><span className="text-green-900 font-bold text-2xl">AFA</span></div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">Sign in to continue your agricultural journey</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="glass-effect rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-white mb-2 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-white mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link to="/password-reset" className="text-sm text-yellow-400 hover:text-yellow-300">Forgot password?</Link>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full btn-primary text-lg py-3">
                {isLoading ? 'Signing in...' : <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-primary-green text-white/70">Or continue with</span></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button type="button" onClick={() => handleSocialLogin('google')} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Google
                </Button>
                <Button type="button" onClick={() => handleSocialLogin('facebook')} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Facebook
                </Button>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-white/70">Don't have an account? <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-medium">Sign up here</Link></p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;