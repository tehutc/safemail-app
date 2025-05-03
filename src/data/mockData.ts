import { Email, User, BlacklistRule } from '../types/types';

// Current user
export const currentUser: User = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane.doe@safecorp.com',
  organization: 'SafeCorp',
  domain: 'safecorp.com'
};

// Blacklist rules
export const blacklistRules: BlacklistRule[] = [
  {
    id: '1',
    type: 'domain',
    value: 'suspicious-mail.com',
    severity: 'high',
    description: 'Known phishing domain'
  },
  {
    id: '2',
    type: 'domain',
    value: 'malware-news.org',
    severity: 'high',
    description: 'Associated with malware distribution'
  },
  {
    id: '3',
    type: 'email',
    value: 'ceo@competitor.com',
    severity: 'medium',
    description: 'Competitor company'
  },
  {
    id: '4',
    type: 'keyword',
    value: 'urgent wire transfer',
    severity: 'medium',
    description: 'Common in financial scams'
  },
  {
    id: '5',
    type: 'keyword',
    value: 'password expired',
    severity: 'medium',
    description: 'Common in credential phishing'
  }
];

// Generate a random date within the last 7 days
const getRandomRecentDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 0 to 6 days ago
  const hoursAgo = Math.floor(Math.random() * 24); // 0 to 23 hours ago
  const minutesAgo = Math.floor(Math.random() * 60); // 0 to 59 minutes ago
  
  now.setDate(now.getDate() - daysAgo);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  
  return now;
};

// Mock emails
export const mockEmails: Email[] = [
  {
    id: '1',
    sender: {
      name: 'John Smith',
      email: 'john.smith@safecorp.com',
      organization: 'SafeCorp'
    },
    recipient: currentUser.email,
    subject: 'Team Meeting Notes',
    body: `Hi Jane,

Here are the notes from yesterday's team meeting:

- Project Alpha is on track for Q3 release
- New security protocols to be implemented next week
- Budget review scheduled for Friday

Let me know if you have any questions.

Best,
John`,
    date: getRandomRecentDate(),
    read: false,
    isExternal: false,
    isBlacklisted: false,
    isFlagged: false
  },
  {
    id: '2',
    sender: {
      name: 'Marketing Team',
      email: 'marketing@safecorp.com',
      organization: 'SafeCorp'
    },
    recipient: currentUser.email,
    subject: 'New Campaign Materials',
    body: `Hello team,

The new marketing materials for the summer campaign are now available in the shared drive.

Please review by EOD and provide your feedback.

Thanks,
Marketing Team`,
    date: getRandomRecentDate(),
    read: true,
    isExternal: false,
    isBlacklisted: false,
    isFlagged: false
  },
  {
    id: '3',
    sender: {
      name: 'Michael Johnson',
      email: 'michael@partner-company.com',
      organization: 'Partner Company'
    },
    recipient: currentUser.email,
    subject: 'Partnership Opportunity',
    body: `Dear Jane,

I wanted to discuss a potential partnership opportunity between our companies.

Could we schedule a call next week to discuss details?

Best regards,
Michael Johnson
Business Development
Partner Company`,
    date: getRandomRecentDate(),
    read: false,
    isExternal: true,
    isBlacklisted: false,
    isFlagged: true
  },
  {
    id: '4',
    sender: {
      name: 'Security Alert',
      email: 'no-reply@suspicious-mail.com'
    },
    recipient: currentUser.email,
    subject: 'Your Account Password Has Expired',
    body: `URGENT: Your account password has expired. Click the link below to reset your password immediately to avoid account suspension.

https://safecorp-account-verify.suspicious-mail.com/reset?token=a1b2c3d4e5f6

If the link doesn't work, copy and paste the following URL into your browser:
safecorp-account-verify.suspicious-mail.com/reset?token=a1b2c3d4e5f6

This request will expire in 24 hours.

DO NOT SHARE THIS LINK WITH ANYONE.

Security Department
SafeCorp IT Team

This is an automated message, please do not reply.`,
    date: getRandomRecentDate(),
    read: false,
    isExternal: true,
    isBlacklisted: true,
    isFlagged: true,
    attachments: [
      {
        id: 'a1',
        filename: 'password_reset.exe',
        size: '1.2 MB',
        type: 'application/exe'
      }
    ]
  },
  {
    id: '5',
    sender: {
      name: 'CEO',
      email: 'ceo@competitor.com',
      organization: 'Competitor Inc.'
    },
    recipient: currentUser.email,
    subject: 'Urgent Business Proposal',
    body: `Hello,

I have an urgent business matter to discuss with you.

Please contact me at your earliest convenience.

Regards,
CEO`,
    date: getRandomRecentDate(),
    read: false,
    isExternal: true,
    isBlacklisted: true,
    isFlagged: true
  },
  {
    id: '6',
    sender: {
      name: 'IT Department',
      email: 'it@safecorp.com',
      organization: 'SafeCorp'
    },
    recipient: currentUser.email,
    subject: 'System Maintenance',
    body: `All employees,

We will be performing system maintenance this weekend.

Please save your work and log out before leaving on Friday.

Thank you,
IT Department`,
    date: getRandomRecentDate(),
    read: true,
    isExternal: false,
    isBlacklisted: false,
    isFlagged: false
  },
  {
    id: '7',
    sender: {
      name: 'Newsletter',
      email: 'news@tech-updates.com'
    },
    recipient: currentUser.email,
    subject: 'Weekly Tech News',
    body: `This Week in Tech:

- New cybersecurity threats emerging
- Industry updates and trends
- Upcoming technology conferences

Click here to read more.`,
    date: getRandomRecentDate(),
    read: true,
    isExternal: true,
    isBlacklisted: false,
    isFlagged: false
  },
  {
    id: '8',
    sender: {
      name: 'Jane Wilson',
      email: 'jane.wilson@malware-news.org'
    },
    recipient: currentUser.email,
    subject: 'Urgent Wire Transfer Needed',
    body: `Dear Colleague,

I need your assistance with an urgent wire transfer.

Please let me know if you can help with this confidential matter.

Regards,
Jane Wilson`,
    date: getRandomRecentDate(),
    read: false,
    isExternal: true,
    isBlacklisted: true,
    isFlagged: true
  }
];