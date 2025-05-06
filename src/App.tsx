import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import EmailList from './components/email/EmailList';
import EmailDetail from './components/email/EmailDetail';
import EmailFilters from './components/filters/EmailFilters';
import EmptyState from './components/email/EmptyState';
import SettingsDialog from './components/settings/SettingsDialog';
import { Email, EmailFilter, BlacklistRule } from './types/types';
import { getEmails, getEmailById, markEmailAsRead } from './services/emailService';
import { blacklistRules as initialBlacklistRules } from './data/mockData';

function App() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [organizationDomain, setOrganizationDomain] = useState('safecorp.com');
  const [blacklistRules, setBlacklistRules] = useState<BlacklistRule[]>(initialBlacklistRules);
  
  // Filters state
  const [filters, setFilters] = useState<EmailFilter>({
    search: '',
    showRead: true,
    showUnread: true,
    showExternal: false,
    sortField: 'date',
    sortOrder: 'desc'
  });
  
  // Email state
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  // Load emails when filters change
  useEffect(() => {
    const loadEmails = async () => {
      const fetchedEmails = await getEmails(filters);
      setEmails(fetchedEmails);
    };
    loadEmails();
  }, [filters]);
  
  // Load selected email
  useEffect(() => {
    const loadEmail = async () => {
      if (selectedEmailId) {
        const email = await getEmailById(selectedEmailId);
        setSelectedEmail(email || null);
      } else {
        setSelectedEmail(null);
      }
    };
    loadEmail();
  }, [selectedEmailId]);
  
  // Apply search query with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Handle email selection
  const handleSelectEmail = async (emailId: string) => {
    setSelectedEmailId(emailId);
    await markEmailAsRead(emailId);
    
    // Update the emails list to reflect the read status
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === emailId ? { ...email, read: true } : email
      )
    );
  };
  
  // Handle filter changes
  const handleFilterChange = (key: keyof EmailFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Layout content
  const renderContent = () => (
    <div className="h-full flex flex-col md:flex-row">
      {/* Email list column */}
      <div className={`${selectedEmail ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/5 lg:w-1/3 border-r border-gray-200`}>
        <EmailFilters
          showRead={filters.showRead}
          setShowRead={(value) => handleFilterChange('showRead', value)}
          showUnread={filters.showUnread}
          setShowUnread={(value) => handleFilterChange('showUnread', value)}
          showExternal={filters.showExternal}
          setShowExternal={(value) => handleFilterChange('showExternal', value)}
          sortField={filters.sortField}
          setSortField={(value) => handleFilterChange('sortField', value)}
          sortOrder={filters.sortOrder}
          setSortOrder={(value) => handleFilterChange('sortOrder', value)}
        />
        
        {emails.length === 0 ? (
          <EmptyState
            type={searchQuery ? 'no-results' : 'no-emails'}
            searchQuery={searchQuery}
          />
        ) : (
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={handleSelectEmail}
          />
        )}
      </div>
      
      {/* Email detail column */}
      <div className={`${selectedEmail ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-3/5 lg:w-2/3`}>
        {selectedEmail ? (
          <EmailDetail
            email={selectedEmail}
            onBack={() => setSelectedEmailId(null)}
          />
        ) : (
          <EmptyState type="no-selection" />
        )}
      </div>
    </div>
  );
  
  return (
    <>
      <Layout
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setSettingsOpen(true)}
      >
        {renderContent()}
      </Layout>
      
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        organizationDomain={organizationDomain}
        setOrganizationDomain={setOrganizationDomain}
        blacklistRules={blacklistRules}
        setBlacklistRules={setBlacklistRules}
      />
    </>
  );
}

export default App;