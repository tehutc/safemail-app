import { Email, BlacklistRule } from '../types/types';
import { getUserSettings, getBlacklistRules } from './settingsService';

// Check if an email is from an external sender
export const isExternalEmail = async (email: Email): Promise<boolean> => {
  const userSettings = await getUserSettings();
  const senderDomain = email.sender.email.split('@')[1];
  return senderDomain !== userSettings.domain;
};

// Check if an email matches any blacklist rules
export const checkBlacklist = async (email: Email): Promise<boolean> => {
  const blacklistRules = await getBlacklistRules();
  const senderEmail = email.sender.email.toLowerCase();
  const senderDomain = senderEmail.split('@')[1];
  const emailContent = `${email.subject} ${email.body}`.toLowerCase();
  
  // Check domain blacklist
  const domainBlacklisted = blacklistRules.some(rule => 
    rule.type === 'domain' && rule.value.toLowerCase() === senderDomain
  );
  
  // Check email address blacklist
  const emailBlacklisted = blacklistRules.some(rule => 
    rule.type === 'email' && rule.value.toLowerCase() === senderEmail
  );
  
  // Check content keyword blacklist
  const contentBlacklisted = blacklistRules.some(rule => 
    rule.type === 'keyword' && emailContent.includes(rule.value.toLowerCase())
  );
  
  return domainBlacklisted || emailBlacklisted || contentBlacklisted;
};

// Get security warnings for an email
export const getSecurityWarnings = async (email: Email): Promise<BlacklistRule[]> => {
  const blacklistRules = await getBlacklistRules();
  const senderEmail = email.sender.email.toLowerCase();
  const senderDomain = senderEmail.split('@')[1];
  const emailContent = `${email.subject} ${email.body}`.toLowerCase();
  
  return blacklistRules.filter(rule => {
    if (rule.type === 'domain' && rule.value.toLowerCase() === senderDomain) {
      return true;
    }
    if (rule.type === 'email' && rule.value.toLowerCase() === senderEmail) {
      return true;
    }
    if (rule.type === 'keyword' && emailContent.includes(rule.value.toLowerCase())) {
      return true;
    }
    return false;
  });
};

// Flag email based on security checks
export const flagEmail = async (email: Email): Promise<Email> => {
  const isExternal = await isExternalEmail(email);
  const isBlacklisted = await checkBlacklist(email);
  
  return {
    ...email,
    isExternal,
    isBlacklisted,
    isFlagged: isExternal || isBlacklisted
  };
};