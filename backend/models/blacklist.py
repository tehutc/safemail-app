from dataclasses import dataclass
from typing import Literal

@dataclass
class BlacklistRule:
    id: str
    type: Literal['domain', 'email', 'keyword']
    value: str
    severity: Literal['low', 'medium', 'high']
    description: str

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'value': self.value,
            'severity': self.severity,
            'description': self.description
        }