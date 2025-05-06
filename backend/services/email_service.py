from typing import List, Dict, Optional
from models.email import Email
from datetime import datetime
import json
import os
from .security_service import SecurityService

class EmailService:
    """
    Handles all email-related operations like fetching, filtering, and marking as read.
    Think of this as our email management central!
    """
    
    def __init__(self):
        self.security_service = SecurityService()
        self._load_emails()

    def _load_emails(self) -> None:
        """
        Load our emails from storage. If we can't find any (like first run),
        we'll start with an empty list. No emails is better than broken emails!
        """
        try:
            with open('data/emails.json', 'r') as f:
                self.emails = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.emails = []

    def _save_emails(self) -> None:
        """
        Save emails back to storage. We create the data directory if it doesn't exist,
        because, better safe than sorry!
        """
        os.makedirs('data', exist_ok=True)
        with open('data/emails.json', 'w') as f:
            json.dump(self.emails, f)

    def get_emails(self, filters: Dict) -> List[Email]:
        """
        Get emails based on filters. This is where the magic happens!
        
        We handle:
        - Text search (subject, sender, body)
        - Read/unread filtering
        - External email filtering
        - Sorting by different fields
        
        If something goes wrong, we return an empty list - This is better than crashing!
        """
        try:
            filtered_emails = self.emails.copy()

            # Search in email fields
            if filters['search']:
                search_term = filters['search'].lower()
                filtered_emails = [
                    email for email in filtered_emails
                    if search_term in email['subject'].lower() or
                    search_term in email['sender']['name'].lower() or
                    search_term in email['sender']['email'].lower() or
                    search_term in email['body'].lower()
                ]

            # Handle read/unread filters
            if filters['showRead'] and not filters['showUnread']:
                filtered_emails = [email for email in filtered_emails if email['read']]
            elif not filters['showRead'] and filters['showUnread']:
                filtered_emails = [email for email in filtered_emails if not email['read']]

            # Filter external emails if requested
            if filters['showExternal']:
                filtered_emails = [email for email in filtered_emails if email['isExternal']]

            # Sort the emails
            reverse = filters['sortOrder'] == 'desc'
            filtered_emails.sort(
                key=lambda x: (
                    datetime.fromisoformat(x['date']) if filters['sortField'] == 'date'
                    else x['sender']['name'] if filters['sortField'] == 'sender'
                    else x['subject']
                ),
                reverse=reverse
            )

            return [self._create_email_object(email) for email in filtered_emails]
        except Exception as e:
            print(f"Error getting emails: {str(e)}")
            return []

    def get_email_by_id(self, email_id: str) -> Optional[Email]:
        """
        Find a specific email by ID. Returns None if we can't find it,
        because returning None is better than crashing!
        """
        try:
            email_data = next((email for email in self.emails if email['id'] == email_id), None)
            return self._create_email_object(email_data) if email_data else None
        except Exception as e:
            print(f"Error getting email by ID: {str(e)}")
            return None

    def mark_email_as_read(self, email_id: str) -> None:
        """
        Mark an email as read. Simple but important - this updates
        the read status and saves it back to storage.
        """
        try:
            for email in self.emails:
                if email['id'] == email_id:
                    email['read'] = True
                    break
            self._save_emails()
        except Exception as e:
            print(f"Error marking email as read: {str(e)}")

    def _create_email_object(self, email_data: Dict) -> Email:
        """
        Convert raw email data into a proper Email object.
        This keeps our data consistent throughout the application.
        """
        return Email(
            id=email_data['id'],
            sender=email_data['sender'],
            recipient=email_data['recipient'],
            subject=email_data['subject'],
            body=email_data['body'],
            date=datetime.fromisoformat(email_data['date']),
            read=email_data['read'],
            is_external=email_data['isExternal'],
            is_blacklisted=email_data['isBlacklisted'],
            is_flagged=email_data['isFlagged'],
            attachments=email_data.get('attachments')
        )