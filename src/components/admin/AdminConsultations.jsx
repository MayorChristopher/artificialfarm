import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: "Error fetching consultations", description: error.message, variant: "destructive" });
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load consultations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = useMemo(() => {
    let filtered = consultations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(consultation =>
        consultation.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [consultations, statusFilter, searchTerm]);

  const handleStatusUpdate = async (consultationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', consultationId);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        return;
      }

      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === consultationId
            ? { ...consultation, status: newStatus }
            : consultation
        )
      );

      toast({ title: "Status updated", description: `Consultation status changed to ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (consultationId) => {
    if (!confirm('Are you sure you want to delete this consultation?')) return;

    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', consultationId);

      if (error) {
        toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        return;
      }

      setConsultations(prev => prev.filter(c => c.id !== consultationId));
      toast({ title: "Consultation deleted", description: "Consultation has been removed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete consultation", variant: "destructive" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-white/50 mx-auto mb-4 animate-spin" />
        <p className="text-white/70">Loading consultations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Consultation Management</h2>
          <p className="text-white/70">Manage and track all consultation bookings</p>
        </div>
        <Button onClick={fetchConsultations} className="btn-secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-green-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6">
        {filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No consultations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{consultation.plan}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70">{consultation.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70">{consultation.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70">{formatDate(consultation.preferred_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/70">{consultation.preferred_time || 'Not specified'}</span>
                      </div>
                    </div>

                    {consultation.message && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-white/80 text-sm">{consultation.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {consultation.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(consultation.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(consultation.id, 'cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {consultation.status === 'confirmed' && (
                      <Button
                        onClick={() => handleStatusUpdate(consultation.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDelete(consultation.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsultations; 