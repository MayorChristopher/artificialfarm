import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = React.useMemo(() => [
    {
      icon: MessageCircle,
      label: 'WhatsApp Chat',
      action: () => {
        window.open('https://wa.me/2348035626198?text=Hello! I\'d like to learn more about Artificial Farm Academy.', '_blank');
      },
      color: 'bg-accent-green hover:bg-green-600'
    },
    {
      icon: Phone,
      label: 'Call Us',
      action: () => {
        window.location.href = 'tel:+2348035626198';
      },
      color: 'bg-primary-green hover:bg-green-800'
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: () => {
        window.location.href = 'mailto:Artificialfarm24@gmail.com';
      },
      color: 'bg-secondary-yellow hover:bg-yellow-500 text-primary-green'
    }
  ], []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 space-y-3"
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={option.action}
                  className={`${option.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 px-4 py-3 rounded-full`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-secondary-yellow hover:bg-yellow-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-primary-green" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-primary-green" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingContact;