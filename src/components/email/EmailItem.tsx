import React from 'react';
import { Email } from '../../types/types';
import { AlertTriangle, ExternalLink, Paperclip } from 'lucide-react';
import { formatEmailDate } from '../../utils/dateUtils';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSelected, onSelect }) => {
  const itemClasses = `flex flex-col p-4 cursor-pointer ${
    isSelected 
      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
  } ${!email.read ? 'font-medium' : ''}`;

  return (
    <div 
      className={itemClasses}
      onClick={onSelect}
      role="button"
      aria-selected={isSelected}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <span className={`text-sm ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
            {email.sender.name}
          </span>
          {email.isExternal && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              External
            </span>
          )}
          {email.isFlagged && (
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              Warning
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {formatEmailDate(email.date)}
        </span>
      </div>
      
      <h3 className={`text-sm mb-1 ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
        {email.subject}
      </h3>
      
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500 truncate max-w-[70%]">
          {email.body.split('\n')[0]}
        </p>
        <div className="flex items-center space-x-2">
          {email.isExternal && (
            <ExternalLink size={16} className="text-gray-400" title="External sender" />
          )}
          {email.isBlacklisted && (
            <AlertTriangle size={16} className="text-red-500" title="Security warning" />
          )}
          {email.attachments?.length > 0 && (
            <Paperclip size={16} className="text-gray-400" title={`${email.attachments.length} attachment(s)`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailItem;