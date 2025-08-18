import React from 'react';
import ConsultationForm from '../components/ConsultationForm';
import { Users, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const ConsultationPage: React.FC = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Expert Guidance",
      description: "Get advice from experienced agricultural professionals"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "Flexible Scheduling",
      description: "Book consultations at your convenience"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Proven Results",
      description: "Solutions backed by successful farming practices"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      title: "Ongoing Support",
      description: "Continuous support throughout your farming journey"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Professional Farming Consultation
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Transform your farming operations with expert guidance. Our consultations help you optimize yields, 
            reduce costs, and implement sustainable practices.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="glass-effect rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-white/70">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Consultation Form */}
        <ConsultationForm />

        {/* Spacer */}
        <div className="py-8"></div>

        {/* Additional Info */}
        <div className="mt-16 glass-effect rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">1</div>
                <h3 className="font-semibold text-white mb-2">Submit Request</h3>
                <p className="text-white/70">Fill out the form with your farming needs and preferred consultation time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">2</div>
                <h3 className="font-semibold text-white mb-2">Expert Review</h3>
                <p className="text-white/70">Our agricultural experts review your request and prepare customized advice</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                <h3 className="font-semibold text-white mb-2">Consultation</h3>
                <p className="text-white/70">Receive detailed guidance and actionable recommendations for your farm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;