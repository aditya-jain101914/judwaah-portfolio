from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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
    sender_email = 'csadityajain31@gmail.com'
    sender_password = 'wfsj uqgv cfsi xtoi'
    receiver_email = 'csadityajain31@gmail.com'

    # Create the email
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f'Contact Form Submission from {name}'

    body = f'Name: {name}\nEmail: {email}\n\nMessage:\n{message}'
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Send the email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, receiver_email, text)
        server.quit()
        return jsonify({'success': 'Message sent successfully'})
    except Exception as e:
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
