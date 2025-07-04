import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Send, 
  MessageSquare, 
  User, 
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onWhatsAppContact, 
  departments 
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
              Send us a <span className="text-gradient">Message</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Have a question or need assistance? Fill out the form below and we'll get back to you as soon as possible
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
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-white mb-2 block">
                    Company/Organization
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={onInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="text-white mb-2 block">
                  Subject/Department
                </Label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                >
                  <option value="" className="bg-green-900 text-white">Select a department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value} className="bg-green-900 text-white">
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 block">
                  Message *
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={onInputChange}
                    className="w-full pl-10 pt-3 pb-3 pr-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" className="flex-1 btn-primary text-lg py-3">
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
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

export default ContactForm;