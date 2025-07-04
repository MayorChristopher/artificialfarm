import React from 'react';

const AdminTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-yellow-400 text-green-900'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;