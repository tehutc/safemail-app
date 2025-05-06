import json
import os
from typing import Dict, List
from models.blacklist import BlacklistRule

class SettingsService:
    """
    Manages all our application settings and security rules.
    Think of this as our configuration control center!
    """
    
    def __init__(self):
        self.settings_file = 'data/settings.json'
        self.blacklist_file = 'data/blacklist.json'
        self._ensure_data_files()

    def _ensure_data_files(self):
        """
        Make sure our settings files exist with good defaults.
        This runs when we start up - no settings, no problem!
        """
        os.makedirs('data', exist_ok=True)
        
        # Create default settings if needed
        if not os.path.exists(self.settings_file):
            default_settings = {
                'domain': 'safecorp.com',
                'organization': 'SafeCorp'
            }
            with open(self.settings_file, 'w') as f:
                json.dump(default_settings, f)

        # Create empty blacklist if needed
        if not os.path.exists(self.blacklist_file):
            default_rules = []
            with open(self.blacklist_file, 'w') as f:
                json.dump(default_rules, f)

    def get_settings(self) -> Dict:
        """
        Get our current settings. If something goes wrong,
        we return safe defaults rather than crashing.
        """
        try:
            with open(self.settings_file, 'r') as f:
                return json.load(f)
        except Exception:
            # Return safe defaults if we can't read the file
            return {'domain': 'safecorp.com', 'organization': 'SafeCorp'}

    def update_domain(self, domain: str) -> None:
        """
        Update our organization's email domain.
        This is used to identify external emails.
        """
        try:
            settings = self.get_settings()
            settings['domain'] = domain
            with open(self.settings_file, 'w') as f:
                json.dump(settings, f)
        except Exception as e:
            print(f"Error updating domain: {str(e)}")

    def get_blacklist_rules(self) -> List[BlacklistRule]:
        """
        Get our current security rules.
        These help us identify suspicious emails.
        """
        try:
            with open(self.blacklist_file, 'r') as f:
                rules_data = json.load(f)
                return [BlacklistRule(**rule) for rule in rules_data]
        except Exception:
            # Return empty list if something goes wrong
            return []

    def update_blacklist_rules(self, rules: List[Dict]) -> None:
        """
        Update our security rules.
        This is called when users modify rules in the settings.
        """
        try:
            with open(self.blacklist_file, 'w') as f:
                json.dump(rules, f)
        except Exception as e:
            print(f"Error updating blacklist rules: {str(e)}")