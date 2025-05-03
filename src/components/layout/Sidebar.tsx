import React from 'react';
import { Inbox, Send, Archive, Trash, AlertTriangle, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarClasses = isOpen
    ? 'transform translate-x-0 transition-transform duration-200 ease-in-out'
    : 'transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg overflow-y-auto lg:relative lg:z-0 ${sidebarClasses}`}>
        <div className="p-4">
          <div className="mt-6 space-y-1">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md">
              <Inbox className="mr-3 h-5 w-5" />
              <span>Inbox</span>
              <span className="ml-auto bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                24
              </span>
            </button>
            
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Send className="mr-3 h-5 w-5 text-gray-500" />
              <span>Sent</span>
            </button>
            
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Archive className="mr-3 h-5 w-5 text-gray-500" />
              <span>Archived</span>
            </button>
            
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Trash className="mr-3 h-5 w-5 text-gray-500" />
              <span>Trash</span>
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Security Filters
            </h3>
            <div className="mt-2 space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <AlertTriangle className="mr-3 h-5 w-5 text-yellow-500" />
                <span>Flagged</span>
                <span className="ml-auto bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                  4
                </span>
              </button>
              
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <ExternalLink className="mr-3 h-5 w-5 text-gray-500" />
                <span>External</span>
                <span className="ml-auto bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full text-xs">
                  12
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;