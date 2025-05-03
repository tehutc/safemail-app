import { Email, BlacklistRule } from '../types/types';
import { getUserSettings, getBlacklistRules } from './settingsService';

// Check if an email is from an external sender
export const isExternalEmail = (email: Email): boolean => {
  const userSettings = getUserSettings();
  const senderDomain = email.sender.email.split('@')[1];
  return senderDomain !== userSettings.domain;
};

// Check if an email matches any blacklist rules
export const checkBlacklist = (email: Email): boolean => {
  const blacklistRules = getBlacklistRules();
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
export const getSecurityWarnings = (email: Email): BlacklistRule[] => {
  const blacklistRules = getBlacklistRules();
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
export const flagEmail = (email: Email): Email => {
  const isExternal = isExternalEmail(email);
  const isBlacklisted = checkBlacklist(email);
  
  return {
    ...email,
    isExternal,
    isBlacklisted,
    isFlagged: isExternal || isBlacklisted
  };
};