// API service for handling all data operations
// Since we're using localStorage for persistence, this acts as our backend API

import { Email, EmailFilter, BlacklistRule, User } from '../types/types';
import { mockEmails, blacklistRules as initialBlacklistRules } from '../data/mockData';

// Initialize data in localStorage if not present
if (!localStorage.getItem('emails')) {
  localStorage.setItem('emails', JSON.stringify(mockEmails));
}

if (!localStorage.getItem('blacklistRules')) {
  localStorage.setItem('blacklistRules', JSON.stringify(initialBlacklistRules));
}

if (!localStorage.getItem('userSettings')) {
  localStorage.setItem('userSettings', JSON.stringify({ domain: 'safecorp.com' }));
}

// Helper function to check if an email matches a blacklist rule
const emailMatchesRule = (email: Email, rule: BlacklistRule): boolean => {
  const senderEmail = email.sender.email.toLowerCase();
  const senderDomain = senderEmail.split('@')[1];
  const emailContent = `${email.subject} ${email.body}`.toLowerCase();
  
  switch (rule.type) {
    case 'domain':
      return rule.value.toLowerCase() === senderDomain;
    case 'email':
      return rule.value.toLowerCase() === senderEmail;
    case 'keyword':
      return emailContent.includes(rule.value.toLowerCase());
    default:
      return false;
  }
};

// Helper function to evaluate email security status and attach warnings
const evaluateEmailSecurity = (email: Email, domain: string, rules: BlacklistRule[]): Email => {
  const senderDomain = email.sender.email.split('@')[1];
  const isExternal = senderDomain !== domain;
  const matchingRules = rules.filter(rule => emailMatchesRule(email, rule));
  const isBlacklisted = matchingRules.length > 0;
  
  return {
    ...email,
    isExternal,
    isBlacklisted,
    isFlagged: isExternal || isBlacklisted,
    securityWarnings: matchingRules // Attach matching rules as warnings
  };
};

// Get all emails with applied filters
export const getEmails = async (filters: EmailFilter): Promise<Email[]> => {
  let emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const rules = JSON.parse(localStorage.getItem('blacklistRules') || '[]');
  
  // Convert date strings to Date objects and evaluate security
  emails = emails.map(email => ({
    ...evaluateEmailSecurity(email, settings.domain, rules),
    date: new Date(email.date)
  }));
  
  let filteredEmails = [...emails];
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEmails = filteredEmails.filter(email => 
      email.subject.toLowerCase().includes(searchLower) ||
      email.sender.name.toLowerCase().includes(searchLower) ||
      email.sender.email.toLowerCase().includes(searchLower) ||
      email.body.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply read/unread filters
  if (filters.showRead && !filters.showUnread) {
    filteredEmails = filteredEmails.filter(email => email.read);
  } else if (!filters.showRead && filters.showUnread) {
    filteredEmails = filteredEmails.filter(email => !email.read);
  }
  
  // Apply external filter
  if (filters.showExternal) {
    filteredEmails = filteredEmails.filter(email => email.isExternal);
  }
  
  // Apply sorting
  const sortEmails = (a: Email, b: Email): number => {
    let comparison = 0;
    
    switch (filters.sortField) {
      case 'date':
        comparison = a.date.getTime() - b.date.getTime();
        break;
      case 'sender':
        comparison = a.sender.name.localeCompare(b.sender.name);
        break;
      case 'subject':
        comparison = a.subject.localeCompare(b.subject);
        break;
    }
    
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  };
  
  return filteredEmails.sort(sortEmails);
};

// Get a single email by ID with security evaluation
export const getEmailById = async (id: string): Promise<Email | undefined> => {
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const rules = JSON.parse(localStorage.getItem('blacklistRules') || '[]');
  
  const email = emails.find(email => email.id === id);
  
  if (email) {
    return {
      ...evaluateEmailSecurity(email, settings.domain, rules),
      date: new Date(email.date)
    };
  }
  
  return undefined;
};

// Mark an email as read
export const markEmailAsRead = async (id: string): Promise<void> => {
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const updatedEmails = emails.map(email => 
    email.id === id ? { ...email, read: true } : email
  );
  localStorage.setItem('emails', JSON.stringify(updatedEmails));
};

// Get user settings
export const getUserSettings = async (): Promise<User> => {
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  return settings;
};

// Get blacklist rules
export const getBlacklistRules = async (): Promise<BlacklistRule[]> => {
  const rules = JSON.parse(localStorage.getItem('blacklistRules') || '[]');
  return rules;
};

// Update user settings and re-evaluate all emails
export const updateUserSettings = async (domain: string): Promise<void> => {
  localStorage.setItem('userSettings', JSON.stringify({ domain }));
  
  // Re-evaluate all emails for external status
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const rules = JSON.parse(localStorage.getItem('blacklistRules') || '[]');
  
  const updatedEmails = emails.map(email => 
    evaluateEmailSecurity(email, domain, rules)
  );
  
  localStorage.setItem('emails', JSON.stringify(updatedEmails));
};

// Update blacklist rules and re-evaluate all emails
export const updateBlacklistRules = async (rules: BlacklistRule[]): Promise<void> => {
  localStorage.setItem('blacklistRules', JSON.stringify(rules));
  
  // Re-evaluate all emails against new rules
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  
  const updatedEmails = emails.map(email => 
    evaluateEmailSecurity(email, settings.domain, rules)
  );
  
  localStorage.setItem('emails', JSON.stringify(updatedEmails));
};