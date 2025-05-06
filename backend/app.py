from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
from services.email_service import EmailService
from services.security_service import SecurityService
from services.settings_service import SettingsService
from models.email import Email
from models.blacklist import BlacklistRule

# Hey! This is our main Flask application that handles all the API endpoints.
# We're using CORS to allow our React frontend to talk to this backend safely.
app = Flask(__name__)
CORS(app)

# Create instances of our services - they'll do all the heavy lifting
email_service = EmailService()
security_service = SecurityService()
settings_service = SettingsService()

@app.route('/api/emails', methods=['GET'])
def get_emails():
    """
    Get all emails based on filters from the frontend.
    This is what powers our email list view!
    
    The frontend sends us these filters:
    - search: Look for text in emails
    - showRead/showUnread: Toggle read/unread emails
    - showExternal: Show only external emails
    - sortField/sortOrder: How to sort the list
    """
    try:
        filters = {
            'search': request.args.get('search', ''),
            'showRead': request.args.get('showRead', 'true') == 'true',
            'showUnread': request.args.get('showUnread', 'true') == 'true',
            'showExternal': request.args.get('showExternal', 'false') == 'true',
            'sortField': request.args.get('sortField', 'date'),
            'sortOrder': request.args.get('sortOrder', 'desc')
        }
        emails = email_service.get_emails(filters)
        return jsonify([email.to_dict() for email in emails])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/<email_id>', methods=['GET'])
def get_email(email_id):
    """
    Get a single email by its ID.
    This powers the email detail view when you click on an email.
    """
    try:
        email = email_service.get_email_by_id(email_id)
        if email:
            return jsonify(email.to_dict())
        return jsonify({'error': 'Email not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/<email_id>/read', methods=['POST'])
def mark_email_read(email_id):
    """
    Mark an email as read.
    Called when you open an email in the detail view.
    """
    try:
        email_service.mark_email_as_read(email_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings/domain', methods=['POST'])
def update_domain():
    """
    Update the organization's domain.
    This helps us identify which emails are external.
    """
    try:
        data = request.get_json()
        settings_service.update_domain(data['domain'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings/blacklist', methods=['POST'])
def update_blacklist():
    """
    Update the security blacklist rules.
    These rules help us catch suspicious emails.
    """
    try:
        data = request.get_json()
        settings_service.update_blacklist_rules(data['rules'])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)