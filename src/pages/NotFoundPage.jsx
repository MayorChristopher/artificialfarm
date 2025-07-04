import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 className="text-5xl font-bold text-yellow-400 mb-4">404</h1>
    <p className="text-white/70 mb-6">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="text-yellow-400 hover:text-yellow-300 font-medium">Go Home</Link>
  </div>
);

export default NotFoundPage;
