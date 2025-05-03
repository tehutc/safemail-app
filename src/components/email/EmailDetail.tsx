import React from 'react';
import { Email, BlacklistRule } from '../../types/types';
import { AlertTriangle, Paperclip, ExternalLink, ArrowLeft, Flag, Shield } from 'lucide-react';
import { formatEmailDate } from '../../utils/dateUtils';
import { getSecurityWarnings } from '../../services/securityService';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onBack }) => {
  const securityWarnings = getSecurityWarnings(email);
  
  const renderWarningBanner = () => {
    if (!email.isFlagged) return null;
    
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Security Warning
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                This email has been flagged by our security system. 
                Please review carefully before taking any action.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSecurityDetails = () => {
    if (!email.isExternal && !email.isBlacklisted) return null;
    
    return (
      <div className="mt-6 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-700 flex items-center mb-3">
          <Shield className="h-4 w-4 mr-2 text-gray-500" />
          Security Information
        </h4>
        
        {email.isExternal && (
          <div className="mb-2 flex items-start">
            <ExternalLink className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
            <div>
              <span className="text-sm text-gray-700">External Sender</span>
              <p className="text-xs text-gray-500">
                This email originated from outside your organization.
              </p>
            </div>
          </div>
        )}
        
        {securityWarnings.length > 0 && (
          <div className="space-y-2 mt-3">
            <h5 className="text-sm font-medium text-gray-700">Detected Issues:</h5>
            {securityWarnings.map((warning, index) => (
              <div key={index} className="flex items-start bg-white p-2 rounded border border-gray-200">
                <Flag className={`h-4 w-4 mr-2 mt-0.5 ${
                  warning.severity === 'high' ? 'text-red-500' : 
                  warning.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                }`} />
                <div>
                  <span className="text-sm font-medium text-gray-700">{warning.description}</span>
                  <p className="text-xs text-gray-500">
                    {warning.type === 'domain' && `Suspicious domain: ${warning.value}`}
                    {warning.type === 'email' && `Blocked sender: ${warning.value}`}
                    {warning.type === 'keyword' && `Suspicious content detected: "${warning.value}"`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderAttachments = () => {
    if (!email.attachments || email.attachments.length === 0) return null;
    
    return (
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 flex items-center mb-3">
          <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
          Attachments ({email.attachments.length})
        </h4>
        
        <div className="space-y-2">
          {email.attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className={`flex items-center p-2 rounded border ${
                attachment.type.includes('exe') ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="p-2 bg-gray-100 rounded mr-3">
                <Paperclip className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium">{attachment.filename}</p>
                <p className="text-xs text-gray-500">{attachment.size}</p>
              </div>
              
              {attachment.type.includes('exe') && (
                <div className="ml-2 flex items-center text-red-500 text-xs">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Potentially unsafe
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
          aria-label="Back to email list"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-900">Email Details</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderWarningBanner()}
        
        <div className="bg-white rounded-lg">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-3">{email.subject}</h1>
            
            <div className="flex items-start mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-3">
                {email.sender.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline">
                  <h3 className="text-base font-medium text-gray-900 mr-2">{email.sender.name}</h3>
                  <span className="text-sm text-gray-500">&lt;{email.sender.email}&gt;</span>
                  
                  {email.sender.organization && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {email.sender.organization}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  <span>To: {email.recipient}</span>
                  <span className="ml-3">{formatEmailDate(email.date, true)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 text-gray-800 whitespace-pre-line">
            {email.body}
          </div>
          
          {renderAttachments()}
          {renderSecurityDetails()}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;