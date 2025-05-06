from typing import List
from models.email import Email
from models.blacklist import BlacklistRule
from .settings_service import SettingsService

class SecurityService:
    """
    Basically our security guard! This service checks emails for potential security risks
    and helps keep our inbox safe.
    """
    
    def __init__(self):
        self.settings_service = SettingsService()

    def is_external_email(self, email: Email) -> bool:
        """
        Check if an email is from outside our organization.
        If something goes wrong, we play it safe and treat it as external.
        
        Input: Email object
        Output: True if external, False if internal
        """
        try:
            settings = self.settings_service.get_settings()
            sender_domain = email.sender.email.split('@')[1]
            return sender_domain != settings['domain']
        except Exception:
            # Better safe than sorry!
            return True

    def check_blacklist(self, email: Email) -> bool:
        """
        Check if an email matches any of our blacklist rules.
        We look at the domain, email address, and content for matches.
        
        Input: Email object
        Output: True if blacklisted, False if safe
        """
        try:
            blacklist_rules = self.settings_service.get_blacklist_rules()
            sender_email = email.sender.email.lower()
            sender_domain = sender_email.split('@')[1]
            email_content = f"{email.subject} {email.body}".lower()

            for rule in blacklist_rules:
                # Check domain blacklist
                if rule.type == 'domain' and rule.value.lower() == sender_domain:
                    return True
                # Check email address blacklist
                if rule.type == 'email' and rule.value.lower() == sender_email:
                    return True
                # Check content keywords
                if rule.type == 'keyword' and rule.value.lower() in email_content:
                    return True
            return False
        except Exception:
            # If something goes wrong, flag it - better safe than sorry!
            return True

    def get_security_warnings(self, email: Email) -> List[BlacklistRule]:
        """
        Get all security warnings that apply to an email.
        This helps us show users why an email was flagged.
        
        Input: Email object
        Output: List of matching blacklist rules
        """
        try:
            blacklist_rules = self.settings_service.get_blacklist_rules()
            sender_email = email.sender.email.lower()
            sender_domain = sender_email.split('@')[1]
            email_content = f"{email.subject} {email.body}".lower()

            warnings = []
            for rule in blacklist_rules:
                if (rule.type == 'domain' and rule.value.lower() == sender_domain) or \
                   (rule.type == 'email' and rule.value.lower() == sender_email) or \
                   (rule.type == 'keyword' and rule.value.lower() in email_content):
                    warnings.append(rule)
            return warnings
        except Exception:
            # Return empty list if something goes wrong
            return []

    def flag_email(self, email: Email) -> Email:
        """
        Run all security checks on an email and flag it appropriately.
        This is our main security checkpoint for each email.
        
        Input: Email object
        Output: Same email object with security flags set
        """
        try:
            is_external = self.is_external_email(email)
            is_blacklisted = self.check_blacklist(email)
            email.is_external = is_external
            email.is_blacklisted = is_blacklisted
            email.is_flagged = is_external or is_blacklisted
            return email
        except Exception:
            # If checks fail, flag the email as suspicious
            email.is_external = True
            email.is_blacklisted = True
            email.is_flagged = True
            return email