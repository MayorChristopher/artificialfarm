import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="Read the Terms of Service for Artificial Farm Academy & Consultants." />
      </Helmet>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto glass-effect p-8 rounded-lg"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <div className="space-y-4 text-white/80">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p>Please read these Terms of Service ("Terms") carefully before using the artificialfarms.com website operated by Artificial Farm Academy & Consultants.</p>
            
            <h2 className="text-2xl font-semibold text-white pt-4">1. Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service.</p>

            <h2 className="text-2xl font-semibold text-white pt-4">2. Content</h2>
            <p>Our Service allows you to post, link, store, share and otherwise make available certain information. You are responsible for the content that you post on or through the Service.</p>

            <h2 className="text-2xl font-semibold text-white pt-4">3. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.</p>
            
            <h2 className="text-2xl font-semibold text-white pt-4">4. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: support@artificialfarms.com</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TermsOfServicePage;