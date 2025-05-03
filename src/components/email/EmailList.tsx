import React from 'react';
import { Email } from '../../types/types';
import EmailItem from './EmailItem';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (emailId: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail 
}) => {
  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <p className="text-gray-500 text-lg">No emails found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={email.id === selectedEmailId}
          onSelect={() => onSelectEmail(email.id)}
        />
      ))}
    </div>
  );
};

export default EmailList;