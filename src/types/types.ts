// Email Types
export interface Email {
  id: string;
  sender: {
    name: string;
    email: string;
    organization?: string;
  };
  recipient: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  isExternal: boolean;
  isBlacklisted: boolean;
  isFlagged: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  size: string;
  type: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  domain: string;
}

// Security Types
export interface BlacklistRule {
  id: string;
  type: 'domain' | 'email' | 'keyword';
  value: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export type SortOrder = 'asc' | 'desc';
export type SortField = 'date' | 'sender' | 'subject';

export interface EmailFilter {
  search: string;
  showRead: boolean;
  showUnread: boolean;
  showExternal: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
}