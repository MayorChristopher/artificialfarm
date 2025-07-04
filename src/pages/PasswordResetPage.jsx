import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isResetFlow, setIsResetFlow] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetFlow(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset`,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setMessage('Password reset link has been sent to your email.');
    }
    setIsSubmitting(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Your password has been reset successfully.' });
      navigate('/login');
    }
    setIsSubmitting(false);
  };

  const renderRequestForm = () => (
    <form onSubmit={handlePasswordResetRequest} className="space-y-6">
      <div>
        <Label htmlFor="email" className="text-white mb-2 block">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-white/10 border-white/20" placeholder="Enter your email" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full btn-primary text-lg py-3">
        {isSubmitting ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </form>
  );

  const renderResetForm = () => (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <div>
        <Label htmlFor="password" className="text-white mb-2 block">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-white/10 border-white/20" placeholder="Enter your new password" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full btn-primary text-lg py-3">
        {isSubmitting ? 'Resetting...' : 'Reset Password'} <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </form>
  );

  return (
    <>
      <Helmet>
        <title>Reset Password - Artificial Farm Academy</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{isResetFlow ? 'Create a New Password' : 'Forgot Password?'}</h1>
            <p className="text-white/70">{isResetFlow ? 'Enter your new password below.' : 'No worries, we\'ll send you reset instructions.'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-2xl p-8">
            {message && <p className="text-center text-green-400 mb-4">{message}</p>}
            {isResetFlow ? renderResetForm() : renderRequestForm()}
            <p className="mt-6 text-center text-sm text-white/70">
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">Back to Login</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;