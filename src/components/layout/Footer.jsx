import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  Leaf,
  Cog,
  BookOpen,
  Tractor
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Journey', href: '/journey' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' }
    ],
    services: [
      { name: 'Academy Portal', href: '/academy' },
      { name: 'Consulting', href: '/consulting' },
      { name: 'Research', href: '/research' },
      { name: 'Training', href: '/training' }
    ],
    resources: [
      { name: 'Services', href: '/services' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Support', href: '/contact' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/artificialfarm', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/artificialfarm', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/artificialfarm', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/artificialfarm', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/@artificialfarmacademy', label: 'YouTube' }
  ];

  const brandSymbols = [
    { icon: Cog, label: 'Innovation', color: 'text-yellow-400' },
    { icon: Tractor, label: 'Technology', color: 'text-green-400' },
    { icon: Leaf, label: 'Growth', color: 'text-green-300' },
    { icon: BookOpen, label: 'Education', color: 'text-blue-400' }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=Lagos,Nigeria', '_blank');
  };

  return (
    <footer className="bg-green-900/50 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-green-900 font-bold text-xl">AFA</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white block">Artificial Farm</span>
                <span className="text-sm text-yellow-400">Academy & Consultants</span>
              </div>
            </div>
            
            <p className="text-white/80 text-sm leading-relaxed">
              Empowering farmers through technology, innovation, and training. 
              Learn to do more with sustainable agricultural solutions.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {brandSymbols.map((symbol, index) => (
                <motion.div
                  key={symbol.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/5"
                >
                  <symbol.icon className={`w-4 h-4 ${symbol.color}`} />
                  <span className="text-xs text-white/70">{symbol.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Company</span>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Services</span>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-white mb-4 block">Contact Info</span>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                <button
                  onClick={handleMapClick}
                  className="text-white/70 text-sm hover:text-yellow-400 transition-colors text-left"
                >
                  Lagos, Nigeria<br />
                  West Africa
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <a href="tel:+2341234567890" className="text-white/70 text-sm hover:text-yellow-400 transition-colors">
                  +234 (0) 123 456 7890
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <a href="mailto:info@artificialfarms.com" className="text-white/70 text-sm hover:text-yellow-400 transition-colors">
                  info@artificialfarms.com
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-white/70 text-sm">
                  <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                  <p className="text-xs text-white/50">(WAT - West Africa Time)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-white/70 text-sm">Follow us:</span>
              {socialLinks.map((social) => (
                <motion.button
                  key={social.label}
                  onClick={() => handleSocialClick(social.href)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400/20 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-white/70 group-hover:text-yellow-400 transition-colors" />
                </motion.button>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-white/50 text-sm">
                © {currentYear} Artificial Farm Academy & Consultants. All rights reserved.
              </p>
              <p className="text-white/40 text-xs mt-1">
                Domain: artificialfarms.com | "Learn to do more"
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;