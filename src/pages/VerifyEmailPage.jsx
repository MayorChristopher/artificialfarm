import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmailPage = () => {
  const { user, session, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const isEmailVerified = user?.email_confirmed_at !== null;

    if (isEmailVerified && profile) {
      const targetUrl = profile.role === 'admin' ? '/admin-dashboard' : '/dashboard';
      navigate(targetUrl, { replace: true });
    }
  }, [loading, user, profile, navigate]);


  return (
    <>
      <Helmet>
        <title>Verifying Email - Artificial Farm Academy</title>
        <meta name="description" content="Verifying your email address." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center text-white text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-green-900 font-bold text-2xl">AFA</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {loading
              ? 'Checking verification...'
              : !user
                ? 'No session found'
                : user?.email_confirmed_at
                  ? 'Email Verified!'
                  : 'Email Not Verified'}
          </h1>
          <p className="text-white/70">
            {loading
              ? 'Please wait...'
              : user?.email_confirmed_at
                ? 'Redirecting to your dashboard...'
                : 'Please confirm your email using the link sent to your inbox.'}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default VerifyEmailPage;