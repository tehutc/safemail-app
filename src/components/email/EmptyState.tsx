import React from 'react';
import { Mail, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-emails' | 'no-results' | 'no-selection';
  searchQuery?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery }) => {
  let title = '';
  let description = '';
  let icon = <Mail className="h-12 w-12 text-gray-400" />;
  
  switch (type) {
    case 'no-emails':
      title = 'No emails found';
      description = 'Your inbox is empty. Enjoy the peace and quiet!';
      break;
    case 'no-results':
      title = 'No matching emails';
      description = `No emails found matching "${searchQuery}". Try a different search term.`;
      icon = <Search className="h-12 w-12 text-gray-400" />;
      break;
    case 'no-selection':
      title = 'No email selected';
      description = 'Select an email from the list to view its contents.';
      break;
  }
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;