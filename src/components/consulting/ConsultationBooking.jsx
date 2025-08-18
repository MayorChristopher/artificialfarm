import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ConsultationBooking = ({ isOpen, onClose, selectedPhase }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    company: '',
    service_type: selectedPhase || 'Beginner',
    message: '',
    scheduled_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          ...formData,
          user_id: user?.id || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({ 
        title: "Consultation booked successfully!", 
        description: "We'll contact you soon to confirm your appointment." 
      });
      
      onClose();
      setFormData({
        name: '',
        email: user?.email || '',
        phone: '',
        company: '',
        service_type: selectedPhase || 'Beginner',
        message: '',
        scheduled_date: ''
      });
    } catch (error) {
      toast({ 
        title: "Booking failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to book a consultation for ${formData.service_type} phase. My details: Name: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-900 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Book Consultation</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Full Name *
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Company/Organization
            </label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Service Type</label>
            <select
              value={formData.service_type}
              onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="Beginner">Phase 1: Foundational Farming</option>
              <option value="Intermediate">Phase 2: Scaling Operations</option>
              <option value="Advanced">Phase 3: Agri-Tech Mastery</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Preferred Date
            </label>
            <Input
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              className="bg-white/10 border-white/20 text-white"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 resize-none"
              rows="3"
              placeholder="Tell us about your farming goals and specific needs..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Booking...' : 'Book Consultation'}
            </Button>
            <Button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationBooking;