from flask import Flask, request, jsonify
from flask_cors import CORS
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests if needed

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    if not all([name, email, message]):
        return jsonify({'error': 'All fields are required'}), 400

    # Email configuration
    sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('EMAIL_USER', 'csadityajain31@gmail.com')
    receiver_email = os.environ.get('RECEIVER_EMAIL', 'csadityajain31@gmail.com')

    if not sendgrid_api_key:
        return jsonify({'error': 'Email service not configured'}), 500

    # Create the email
    message = Mail(
        from_email=sender_email,
        to_emails=receiver_email,
        subject=f'Contact Form Submission from {name}',
        html_content=f'<p><strong>Name:</strong> {name}</p><p><strong>Email:</strong> {email}</p><p><strong>Message:</strong></p><p>{message}</p>'
    )

    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        if response.status_code == 202:
            return jsonify({'success': 'Message sent successfully'})
        else:
            return jsonify({'error': f'Failed to send email: {response.status_code}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
