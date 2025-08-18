import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Send, Calendar } from 'lucide-react';

interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  farm_size: string;
  crop_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  plan: string;
}

const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    email: '',
    phone: '',
    farm_size: '',
    crop_type: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
    plan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const plans = [
    'Beginner',
    'Intermediate', 
    'Advanced'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('consultations')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          farm_size: formData.farm_size,
          crop_type: formData.crop_type,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null,
          message: formData.message,
          plan: formData.plan,
          status: 'pending'
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        farm_size: '',
        crop_type: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
        plan: ''
      });
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi! I'd like to book a consultation for ${formData.plan || 'farming services'}. My name is ${formData.name || '[Name]'} and I'm interested in discussing: ${formData.message || 'farming consultation'}.`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto glass-effect rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Book a Consultation</h2>
        <p className="text-white/70">Get expert advice for your farming needs</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-400/20 border border-green-400/30 rounded-lg">
          <p className="text-green-300">Consultation request submitted successfully! We'll contact you soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-400/20 border border-red-400/30 rounded-lg">
          <p className="text-red-300">Error submitting request. Please try again or contact us via WhatsApp.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label htmlFor="farm_size" className="block text-sm font-medium text-white mb-2">
              Farm Size
            </label>
            <input
              type="text"
              id="farm_size"
              name="farm_size"
              value={formData.farm_size}
              onChange={handleInputChange}
              placeholder="e.g., 5 acres, 10 hectares"
              className="form-input w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="crop_type" className="block text-sm font-medium text-white mb-2">
              Crop Type
            </label>
            <input
              type="text"
              id="crop_type"
              name="crop_type"
              value={formData.crop_type}
              onChange={handleInputChange}
              placeholder="e.g., Rice, Maize, Vegetables"
              className="form-input w-full"
            />
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-white mb-2">
              Consultation Plan *
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleInputChange}
              required
              className="form-input w-full"
            >
              <option value="" className="bg-green-900 text-white">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan} value={plan} className="bg-green-900 text-white">{plan}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="preferred_date" className="block text-sm font-medium text-white mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              id="preferred_date"
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="form-input w-full"
            />
          </div>

          <div>
            <label htmlFor="preferred_time" className="block text-sm font-medium text-white mb-2">
              Preferred Time
            </label>
            <select
              id="preferred_time"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleInputChange}
              className="form-input w-full"
            >
              <option value="" className="bg-green-900 text-white">Select time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time} className="bg-green-900 text-white">{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Please describe your farming needs and what you'd like to discuss..."
            className="form-input w-full resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact via WhatsApp
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-white/60">
        <p>We typically respond within 24 hours. For urgent matters, please use WhatsApp.</p>
      </div>
    </div>
  );
};

export default ConsultationForm;