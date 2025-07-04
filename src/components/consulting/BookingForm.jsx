import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BookingForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onWhatsAppContact, 
  timeSlots 
}) => {
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
              Book Your <span className="text-gradient">Consultation</span>
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
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white mb-2 block">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="farmSize" className="text-white mb-2 block">
                    Farm Size (hectares)
                  </Label>
                  <Input
                    id="farmSize"
                    name="farmSize"
                    type="text"
                    value={formData.farmSize}
                    onChange={onInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                    placeholder="e.g., 5 hectares"
                  />
                </div>

                <div>
                  <Label htmlFor="cropType" className="text-white mb-2 block">
                    Primary Crop/Livestock
                  </Label>
                  <Input
                    id="cropType"
                    name="cropType"
                    type="text"
                    value={formData.cropType}
                    onChange={onInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                    placeholder="e.g., Rice, Maize, Poultry"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredDate" className="text-white mb-2 block">
                    Preferred Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white focus:border-yellow-400"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">
                  Preferred Time
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => onInputChange({ 
                        target: { name: 'preferredTime', value: time } 
                      })}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        formData.preferredTime === time
                          ? 'bg-yellow-400 text-green-900'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 block">
                  Additional Information
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={onInputChange}
                    className="w-full pl-10 pt-3 pb-3 pr-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none"
                    placeholder="Tell us about your specific needs and challenges..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="flex-1 btn-primary text-lg py-3">
                  Book Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  type="button"
                  onClick={onWhatsAppContact}
                  className="flex-1 btn-secondary text-lg py-3"
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