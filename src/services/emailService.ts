import { Email, EmailFilter } from '../types/types';
import { getEmails as apiGetEmails, getEmailById as apiGetEmailById, markEmailAsRead as apiMarkEmailAsRead } from './api';

// Initialize emails in localStorage if not present
const initializeEmails = async () => {
  try {
    const emails = await apiGetEmails({
      search: '',
      showRead: true,
      showUnread: true,
      showExternal: false,
      sortField: 'date',
      sortOrder: 'desc'
    });
    return emails;
  } catch (error) {
    console.error('Error initializing emails:', error);
    return [];
  }
};

export const getEmails = async (filters: EmailFilter): Promise<Email[]> => {
  try {
    return await apiGetEmails(filters);
  } catch (error) {
    console.error('Error getting emails:', error);
    return [];
  }
};

export const getEmailById = async (id: string): Promise<Email | undefined> => {
  try {
    return await apiGetEmailById(id);
  } catch (error) {
    console.error('Error getting email by ID:', error);
    return undefined;
  }
};

export const markEmailAsRead = async (id: string): Promise<void> => {
  try {
    await apiMarkEmailAsRead(id);
  } catch (error) {
    console.error('Error marking email as read:', error);
  }
};