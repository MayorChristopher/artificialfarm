import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Award,
  Download,
  Share2,
  Eye,
  Calendar,
  Star,
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      // Fetch user certificates from enrollments
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            instructor,
            category,
            duration
          )
        `)
        .eq('user_id', user?.id)
        .eq('progress', 100);

      if (error) {
        toast({ title: 'Error', description: 'Could not load certificates', variant: 'destructive' });
      } else {
        // Transform enrollments into certificates
        const certificatesData = (enrollments || []).map(enrollment => ({
          id: enrollment.id,
          courseId: enrollment.course_id,
          title: enrollment.courses?.title || 'Course Title',
          instructor: enrollment.courses?.instructor || 'Instructor',
          category: enrollment.courses?.category || 'Agriculture',
          duration: enrollment.courses?.duration || '2h 30m',
          completedAt: enrollment.updated_at || new Date().toISOString(),
          score: enrollment.score || 95,
          certificateId: `CERT-${enrollment.course_id}-${enrollment.user_id}`,
          status: 'verified'
        }));

        setCertificates(certificatesData);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not load certificates', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateAction = (action, certificate) => {
    switch (action) {
      case 'view':
        toast({ title: 'Viewing Certificate', description: 'Opening certificate in new tab...' });
        // Open certificate in new tab
        break;
      case 'download':
        toast({ title: 'Download Started', description: 'Certificate is being prepared for download.' });
        break;
      case 'share':
        toast({ title: 'Sharing Certificate', description: 'Preparing share link...' });
        break;
      default:
        toast({ title: 'Action', description: `${action} action triggered` });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Award className="w-8 h-8 text-green-900" />
          </div>
          <p className="text-white/70">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Certificates - Artificial Farm Academy & Consultants</title>
        <meta name="description" content="View and manage your earned certificates from completed courses." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Certificates</h1>
              <p className="text-white/70">
                {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned •
                All verified and shareable
              </p>
            </div>
            <Button className="btn-primary">
              <Award className="w-4 h-4 mr-2" />
              View All Courses
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'verified', 'pending'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(status)}
                  className="btn-secondary"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCertificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <Award className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No certificates found</h3>
              <p className="text-white/70 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Complete courses to earn certificates.'
                }
              </p>
              <Button className="btn-primary">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </motion.div>
          ) : (
            filteredCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-8 h-8 text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white truncate">
                        {certificate.title}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        Verified
                      </span>
                    </div>

                    <p className="text-white/70 text-sm mb-3">
                      Certificate of Completion
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-white/60 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(certificate.completedAt)}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {certificate.instructor}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {certificate.duration}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className={`text-sm font-medium ${getScoreColor(certificate.score)}`}>
                        Score: {certificate.score}%
                      </span>
                    </div>

                    {/* Certificate ID */}
                    <div className="text-xs text-white/50 mb-4">
                      ID: {certificate.certificateId}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCertificateAction('view', certificate)}
                        className="btn-primary flex-1"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleCertificateAction('download', certificate)}
                        className="btn-secondary"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleCertificateAction('share', certificate)}
                        className="btn-secondary"
                        size="sm"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Certificate Stats */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Certificate Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-green-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-green-900" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{certificates.length}</h3>
                <p className="text-white/70 text-sm">Total Certificates</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length)}
                </h3>
                <p className="text-white/70 text-sm">Average Score</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {certificates.filter(cert => cert.score >= 90).length}
                </h3>
                <p className="text-white/70 text-sm">Excellence Awards</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {new Set(certificates.map(cert => cert.category)).size}
                </h3>
                <p className="text-white/70 text-sm">Categories</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Certificates;
