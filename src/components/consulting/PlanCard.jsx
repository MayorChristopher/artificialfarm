import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlanCard = ({ plan, index, selectedPlan, onSelectPlan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative glass-effect rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
        selectedPlan === plan.id ? 'ring-2 ring-yellow-400' : ''
      }`}
      onClick={() => onSelectPlan(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-green-500 text-green-900 px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-gradient mb-2">{plan.price}</div>
        <div className="text-white/70 text-sm">{plan.duration} consultation</div>
      </div>

      <p className="text-white/80 text-center mb-6">{plan.description}</p>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-white/80 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button 
        className={`w-full ${selectedPlan === plan.id ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onSelectPlan(plan.id)}
      >
        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
      </Button>
    </motion.div>
  );
};

export default PlanCard;