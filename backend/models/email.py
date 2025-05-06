from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List, Dict

@dataclass
class Attachment:
    id: str
    filename: str
    size: str
    type: str

    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'filename': self.filename,
            'size': self.size,
            'type': self.type
        }

@dataclass
class Sender:
    name: str
    email: str
    organization: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'email': self.email,
            'organization': self.organization
        }

@dataclass
class Email:
    id: str
    sender: Sender
    recipient: str
    subject: str
    body: str
    date: datetime
    read: bool
    is_external: bool
    is_blacklisted: bool
    is_flagged: bool
    attachments: Optional[List[Attachment]] = None

    def to_dict(self) -> Dict:
        return {
            'id': self.id,
            'sender': self.sender.to_dict(),
            'recipient': self.recipient,
            'subject': self.subject,
            'body': self.body,
            'date': self.date.isoformat(),
            'read': self.read,
            'isExternal': self.is_external,
            'isBlacklisted': self.is_blacklisted,
            'isFlagged': self.is_flagged,
            'attachments': [att.to_dict() for att in self.attachments] if self.attachments else None
        }