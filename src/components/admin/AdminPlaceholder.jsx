import React from 'react';
import { Calendar, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminPlaceholder = ({ activeTab }) => {
  const getIcon = () => {
    switch (activeTab) {
      case 'consultations':
        return Calendar;
      case 'messages':
        return MessageSquare;
      case 'settings':
        return Settings;
      default:
        return Settings;
    }
  };

  const Icon = getIcon();

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-white/50" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
      </h3>
      <p className="text-white/70 mb-4">
        This section is under development
      </p>
      <Button 
        onClick={() => toast({
          title: `🚧 ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`,
          description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        })}
        className="btn-primary"
      >
        Request Feature
      </Button>
    </div>
  );
};

export default AdminPlaceholder;