import { User, BlacklistRule } from '../types/types';
import { 
  updateUserSettings as apiUpdateUserSettings, 
  updateBlacklistRules as apiUpdateBlacklistRules,
  getBlacklistRules as apiGetBlacklistRules,
  getUserSettings as apiGetUserSettings
} from './api';

export const getUserSettings = async (): Promise<User> => {
  try {
    return await apiGetUserSettings();
  } catch (error) {
    console.error('Error getting user settings:', error);
    // Return default settings if API call fails
    return { domain: '' };
  }
};

export const getBlacklistRules = async (): Promise<BlacklistRule[]> => {
  try {
    return await apiGetBlacklistRules();
  } catch (error) {
    console.error('Error getting blacklist rules:', error);
    // Return empty array if API call fails
    return [];
  }
};

export const updateUserSettings = async (domain: string): Promise<void> => {
  try {
    await apiUpdateUserSettings(domain);
  } catch (error) {
    console.error('Error updating user settings:', error);
  }
};

export const updateBlacklistRules = async (rules: BlacklistRule[]): Promise<void> => {
  try {
    await apiUpdateBlacklistRules(rules);
  } catch (error) {
    console.error('Error updating blacklist rules:', error);
  }
};