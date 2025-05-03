import { User, BlacklistRule } from '../types/types';
import { currentUser as defaultUser, blacklistRules as defaultRules } from '../data/mockData';

// Initialize settings in localStorage if not present
if (!localStorage.getItem('userSettings')) {
  localStorage.setItem('userSettings', JSON.stringify(defaultUser));
}

if (!localStorage.getItem('blacklistRules')) {
  localStorage.setItem('blacklistRules', JSON.stringify(defaultRules));
}

export const updateUserSettings = (domain: string): void => {
  const currentUser = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const updatedUser = {
    ...currentUser,
    domain
  };
  localStorage.setItem('userSettings', JSON.stringify(updatedUser));
};

export const getUserSettings = (): User => {
  return JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(defaultUser));
};

export const updateBlacklistRules = (rules: BlacklistRule[]): void => {
  localStorage.setItem('blacklistRules', JSON.stringify(rules));
};

export const getBlacklistRules = (): BlacklistRule[] => {
  return JSON.parse(localStorage.getItem('blacklistRules') || '[]');
};