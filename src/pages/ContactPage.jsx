import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ContactForm from '@/components/contact/ContactForm';
import { supabase } from '@/lib/supabase';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', subject: 'general', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    { icon: Phone, title: 'Phone', details: ['+234 803 562 6198', '+234 806 916 7362'], color: 'text-blue-400' },
    { icon: Mail, title: 'Email', details: ['Artificialfarm24@gmail.com'], color: 'text-green-400' },
    { icon: MapPin, title: 'Address', details: ['Chukwu Avenue, close to industrial timber market', 'Umuahia, Abia State, Nigeria'], color: 'text-yellow-400' },
    { icon: Clock, title: 'Working Hours', details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'], color: 'text-purple-400' }
  ];
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/artificialfarm24', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: 'https://twitter.com/artificialfarm24', label: 'Twitter', color: 'hover:text-blue-300' },
    { icon: Instagram, href: 'https://share.google/NAgpoqiDEbGpbd4gi', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: 'https://linkedin.com/company/artificialfarm24', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Youtube, href: 'https://youtube.com/@artificialfarm24', label: 'YouTube', color: 'hover:text-red-400' }
  ];
  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'academy', label: 'Academy & Training' },
    { value: 'partnerships', label: 'Partnerships' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('contacts').insert(formData);
    if (error) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message Sent! 📧", description: "Thank you for contacting us. We'll get back to you soon." });
      setFormData({ name: '', email: '', phone: '', company: '', subject: 'general', message: '' });
    }
    setIsSubmitting(false);
  };
  const handleSocialClick = (url) => window.open(url, '_blank');
  const handleMapClick = () => window.open('https://maps.google.com/?q=Chukwu+Avenue+Umuahia+Abia+State+Nigeria', '_blank');

  return (
    <>
      <Helmet><title>Contact Us - Artificial Farm Academy</title></Helmet>
      <section className="relative pt-24 pb-20"><div className="container mx-auto px-4 relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto"><h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in <span className="text-yellow-400">Touch</span></h1><p className="text-xl md:text-2xl text-white/80 mb-8">We're here to help you every step of the way.</p></motion.div></div></section>
      <section className="py-20 bg-green-900/20"><div className="container mx-auto px-4"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact <span className="text-yellow-400">Information</span></h2></motion.div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{contactInfo.map((info, index) => (<motion.div key={info.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.6 }} className="glass-effect rounded-2xl p-6 text-center hover:bg-white/10"><div className="flex justify-center mb-4"><div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center"><info.icon className={`w-8 h-8 ${info.color}`} /></div></div><h3 className="text-xl font-bold text-white mb-4">{info.title}</h3><div className="space-y-2">{info.details.map((detail, detailIndex) => (<p key={detailIndex} className="text-white/70 text-sm">{detail}</p>))}</div></motion.div>))}</div></div></section>
      <ContactForm formData={formData} onInputChange={handleInputChange} onSubmit={handleSubmit} departments={departments} isSubmitting={isSubmitting} />
      <section className="py-20"><div className="container mx-auto px-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}><div className="bg-white/10 rounded-xl h-64 flex items-center justify-center mb-6 cursor-pointer" onClick={handleMapClick}><div className="text-center"><MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" /><p className="text-white/70">Click to view map</p></div></div></motion.div><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}><h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3><div className="flex flex-wrap gap-4">{socialLinks.map((social) => (<motion.button key={social.label} onClick={() => handleSocialClick(social.href)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className={`w-12 h-12 bg-white/10 rounded-full flex items-center justify-center ${social.color}`}><social.icon className="w-6 h-6 text-white/70 group-hover:text-current" /></motion.button>))}</div></motion.div></div></div></section>
    </>
  );
};

export default ContactPage;