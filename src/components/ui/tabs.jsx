import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={`w-full ${className}`}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

export const TabsList = ({ children, className = '' }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-[#0B1536] p-1 text-gray-300 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = '' }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42ACF0] disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value 
        ? 'bg-[#1B2238] text-[#42ACF0] shadow-sm border border-[#42ACF0]/30' 
        : 'hover:bg-[#1B2238]/50 hover:text-[#42ACF0]'
    } ${className}`}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value, activeTab, className = '' }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
};
