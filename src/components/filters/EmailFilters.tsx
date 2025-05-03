import React, { useState } from 'react';
import { SortField, SortOrder } from '../../types/types';
import { Filter, ChevronUp, ChevronDown, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface EmailFiltersProps {
  showRead: boolean;
  setShowRead: (show: boolean) => void;
  showUnread: boolean;
  setShowUnread: (show: boolean) => void;
  showExternal: boolean;
  setShowExternal: (show: boolean) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const EmailFilters: React.FC<EmailFiltersProps> = ({
  showRead,
  setShowRead,
  showUnread,
  setShowUnread,
  showExternal,
  setShowExternal,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const renderFilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Show/Hide</h3>
        <div className="space-y-4">
          <label className="flex items-center min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-base text-gray-700 ml-3">Show Read</span>
          </label>
          
          <label className="flex items-center min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={showUnread}
              onChange={(e) => setShowUnread(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-base text-gray-700 ml-3">Show Unread</span>
          </label>
          
          <label className="flex items-center min-h-[44px] cursor-pointer">
            <input
              type="checkbox"
              checked={showExternal}
              onChange={(e) => setShowExternal(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-base text-gray-700 ml-3">Only External</span>
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Sort Options</h3>
        <div className="flex items-center space-x-3">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="flex-1 min-h-[44px] text-base border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="date">Date</option>
            <option value="sender">Sender</option>
            <option value="subject">Subject</option>
          </select>
          
          <button
            onClick={handleSortOrderToggle}
            className="min-h-[44px] min-w-[44px] p-2 rounded hover:bg-gray-100 flex items-center justify-center"
            title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortOrder === 'asc' ? (
              <ChevronUp className="h-6 w-6 text-gray-600" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Mobile Dialog Trigger */}
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <button className="md:hidden flex items-center justify-center w-full min-h-[44px] text-base text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg">
              <Filter className="h-5 w-5 mr-2" />
              <span>Filters & Sort</span>
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl p-6 pb-8 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Filters & Sort
                </Dialog.Title>
                <Dialog.Close className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>
              {renderFilterContent()}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <label className="flex items-center min-h-[44px] cursor-pointer whitespace-nowrap px-2">
              <input
                type="checkbox"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 ml-2">Read</span>
            </label>
            
            <label className="flex items-center min-h-[44px] cursor-pointer whitespace-nowrap px-2">
              <input
                type="checkbox"
                checked={showUnread}
                onChange={(e) => setShowUnread(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 ml-2">Unread</span>
            </label>
            
            <label className="flex items-center min-h-[44px] cursor-pointer whitespace-nowrap px-2">
              <input
                type="checkbox"
                checked={showExternal}
                onChange={(e) => setShowExternal(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 ml-2">External</span>
            </label>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="min-h-[36px] text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="date">Date</option>
              <option value="sender">Sender</option>
              <option value="subject">Subject</option>
            </select>
            
            <button
              onClick={handleSortOrderToggle}
              className="min-h-[36px] min-w-[36px] p-1 rounded hover:bg-gray-100 flex items-center justify-center"
              title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortOrder === 'asc' ? (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailFilters;