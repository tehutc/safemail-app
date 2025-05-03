import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  searchQuery, 
  setSearchQuery,
  onOpenSettings
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        toggleSidebar={toggleSidebar} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={onOpenSettings}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 overflow-y-auto p-0 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;