import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { chatbotService } from '@/lib/chatbotService';

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm AFAC Assistant, your intelligent farming companion. I can help you with courses, farming techniques, and personalized advice. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatbotService.getResponse(messageText, user);
      const botResponse = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again or contact our support team at Artificialfarm24@gmail.com.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Mobile responsive positioning */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-primary-green" />
            </Button>
            <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 md:px-3 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap">
              AFAC Assistant
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window - Mobile responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:w-96 bg-primary-green rounded-2xl shadow-2xl z-50 overflow-hidden border border-secondary-yellow/20"
          >
            {/* Header */}
            <div className="bg-primary-green p-3 md:p-4 flex items-center justify-between border-b border-secondary-yellow/20">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary-yellow/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 md:w-6 md:h-6 text-secondary-yellow" />
                </div>
                <div>
                  <h3 className="text-secondary-yellow font-semibold text-sm md:text-base">AFAC Assistant</h3>
                  <p className="text-white/80 text-xs md:text-sm hidden md:block">Intelligent Farming Companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="bg-secondary-yellow/20 hover:bg-secondary-yellow/30 p-1.5 md:p-2 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-3 h-3 md:w-4 md:h-4 text-secondary-yellow" />
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-secondary-yellow/20 hover:bg-secondary-yellow/30 p-1.5 md:p-2 rounded-lg transition-colors"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 text-secondary-yellow" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-primary-green">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[250px] md:max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-secondary-yellow' : 'bg-accent-green'}`}>
                          {message.sender === 'user' ? (
                            <User className="w-3 h-3 md:w-4 md:h-4 text-primary-green" />
                          ) : (
                            <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          )}
                        </div>
                        <div className={`p-2 md:p-3 rounded-2xl ${message.sender === 'user' ? 'bg-secondary-yellow text-primary-green font-medium' : 'bg-white/10 text-white border border-white/20'}`}>
                          <p className="text-xs md:text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-[250px] md:max-w-xs">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent-green flex items-center justify-center">
                          <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <div className="bg-white/10 p-2 md:p-3 rounded-2xl border border-white/20">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-secondary-yellow rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-secondary-yellow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-secondary-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 md:p-4 border-t border-secondary-yellow/20">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about farming..."
                      className="flex-1 p-2 md:p-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-yellow focus:border-secondary-yellow text-white placeholder:text-white/70 backdrop-blur-sm text-sm md:text-base"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-gradient-to-r from-secondary-yellow to-yellow-500 hover:from-yellow-500 hover:to-secondary-yellow p-2 md:p-3 rounded-xl disabled:opacity-50 transition-all duration-300"
                    >
                      <Send className="w-3 h-3 md:w-4 md:h-4 text-primary-green" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;