import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  MapPin,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const BookingForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onWhatsAppContact, 
  timeSlots 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.plan) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill in all required fields.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const consultationData = {
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        farm_size: formData.farmSize || null,
        crop_type: formData.cropType || null,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        message: formData.message || null,
        plan: formData.plan,
        status: 'pending'
      };

      const { error } = await supabase
        .from('consultations')
        .insert([consultationData]);

      if (error) {
        console.error('Consultation booking error:', error);
        toast({ 
          title: "Booking Failed", 
          description: error.message || "Failed to book consultation. Please try again.", 
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Consultation Booked! 📅", 
        description: "Your consultation has been successfully booked. We'll contact you soon to confirm the details." 
      });

      // Reset form
      onInputChange({ target: { name: 'name', value: '' } });
      onInputChange({ target: { name: 'email', value: '' } });
      onInputChange({ target: { name: 'phone', value: '' } });
      onInputChange({ target: { name: 'farmSize', value: '' } });
      onInputChange({ target: { name: 'cropType', value: '' } });
      onInputChange({ target: { name: 'preferredDate', value: '' } });
      onInputChange({ target: { name: 'preferredTime', value: '' } });
      onInputChange({ target: { name: 'message', value: '' } });
      onInputChange({ target: { name: 'plan', value: '' } });

    } catch (error) {
      console.error('Consultation booking error:', error);
      toast({ 
        title: "Booking Failed", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const plans = [
    { value: 'Beginner', label: 'Beginner - Phase 1: Foundational Farming' },
    { value: 'Intermediate', label: 'Intermediate - Phase 2: Scaling Operations' },
    { value: 'Advanced', label: 'Advanced - Phase 3: Agri-Tech Mastery' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Book Your <span className="text-yellow-400">Consultation</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Fill out the form below to schedule your consultation with our agricultural experts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-effect rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white font-medium">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={onInputChange}
                    placeholder="Enter your full name"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white font-medium">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onInputChange}
                    placeholder="Enter your email"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white font-medium">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="Enter your phone number"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="plan" className="text-white font-medium">
                    <Leaf className="w-4 h-4 inline mr-2" />
                    Consultation Plan *
                  </Label>
                  <select
                    id="plan"
                    name="plan"
                    value={formData.plan}
                    onChange={onInputChange}
                    required
                    className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="" className="bg-green-900 text-white">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.value} value={plan.value} className="bg-green-900 text-white">
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Farm Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="farmSize" className="text-white font-medium">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Farm Size
                  </Label>
                  <Input
                    id="farmSize"
                    name="farmSize"
                    type="text"
                    value={formData.farmSize}
                    onChange={onInputChange}
                    placeholder="e.g., 5 acres, 10 hectares"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="cropType" className="text-white font-medium">
                    <Leaf className="w-4 h-4 inline mr-2" />
                    Crop Type
                  </Label>
                  <Input
                    id="cropType"
                    name="cropType"
                    type="text"
                    value={formData.cropType}
                    onChange={onInputChange}
                    placeholder="e.g., Rice, Maize, Vegetables"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredDate" className="text-white font-medium">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={onInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredTime" className="text-white font-medium">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Time
                  </Label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={onInputChange}
                    className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="" className="bg-green-900 text-white">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-green-900 text-white">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-white font-medium">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Additional Information
                </Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={onInputChange}
                  placeholder="Tell us about your farming goals, challenges, or any specific questions..."
                  rows={4}
                  className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold text-lg py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-green-900"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Consultation'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  type="button"
                  onClick={onWhatsAppContact}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg py-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-green-900 border border-white/20"
                >
                  WhatsApp Chat
                  <MessageSquare className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;