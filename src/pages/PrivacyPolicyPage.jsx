import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Read the privacy policy for Artificial Farm Academy & Consultants." />
      </Helmet>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto glass-effect p-8 rounded-lg"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-white/80">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p>Artificial Farm Academy & Consultants ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website artificialfarms.com.</p>
            
            <h2 className="text-2xl font-semibold text-white pt-4">1. Information We Collect</h2>
            <p>We may collect personal information such as your name, email address, phone number, and payment information when you register for an account, enroll in a course, or book a consultation.</p>

            <h2 className="text-2xl font-semibold text-white pt-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, operate, and maintain our services, process your transactions, send you communications, and improve our website.</p>

            <h2 className="text-2xl font-semibold text-white pt-4">3. Data Security</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. All authentication and user data are managed securely via Supabase.</p>

            <h2 className="text-2xl font-semibold text-white pt-4">4. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at: support@artificialfarms.com</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;