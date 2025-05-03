import { Email, EmailFilter, SortField, SortOrder } from '../types/types';
import { mockEmails as initialEmails } from '../data/mockData';

// Initialize emails in localStorage if not present
const initializeEmails = () => {
  if (!localStorage.getItem('emails')) {
    // Randomly set some emails as read
    const emails = initialEmails.map(email => ({
      ...email,
      read: Math.random() < 0.5 // 50% chance of being read
    }));
    localStorage.setItem('emails', JSON.stringify(emails));
  }
};

// Call initialization
initializeEmails();

export const getEmails = (filters: EmailFilter): Email[] => {
  let emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  // Convert date strings to Date objects
  emails = emails.map(email => ({
    ...email,
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
  filteredEmails = sortEmails(filteredEmails, filters.sortField, filters.sortOrder);
  
  return filteredEmails;
};

export const getEmailById = (id: string): Email | undefined => {
  let emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  // Convert date strings to Date objects
  emails = emails.map(email => ({
    ...email,
    date: new Date(email.date)
  }));
  return emails.find(email => email.id === id);
};

export const markEmailAsRead = (id: string): void => {
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const updatedEmails = emails.map(email => 
    email.id === id ? { ...email, read: true } : email
  );
  localStorage.setItem('emails', JSON.stringify(updatedEmails));
};

// Reset email read states with random values
export const resetEmailReadStates = (): void => {
  const emails: Email[] = JSON.parse(localStorage.getItem('emails') || '[]');
  const updatedEmails = emails.map(email => ({
    ...email,
    read: Math.random() < 0.5 // 50% chance of being read
  }));
  localStorage.setItem('emails', JSON.stringify(updatedEmails));
};

const sortEmails = (emails: Email[], field: SortField, order: SortOrder): Email[] => {
  return [...emails].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'sender':
        comparison = a.sender.name.localeCompare(b.sender.name);
        break;
      case 'subject':
        comparison = a.subject.localeCompare(b.subject);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};