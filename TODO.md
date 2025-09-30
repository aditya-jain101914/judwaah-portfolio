# TODO: Replace Formspree with Python Flask Backend for Contact Form

## Steps Completed

- [x] Create app.py with Flask backend for handling contact form submissions and sending emails via SMTP.
- [x] Create requirements.txt with Flask and Flask-CORS dependencies.
- [x] Update index.html to change the contact form action to http://localhost:5000/contact (update to deployed URL for global hosting).
- [x] Update script.js to handle form submission asynchronously using fetch instead of the current demo alert.

## Remaining Steps

- [x] Set up email credentials securely (provided by user, hardcoded in app.py for local testing; use environment variables for deployment).
- [x] Test the form locally by running the Flask app (installed deps, ran app, tested endpoint with curl - success response, email sent).
- [ ] Deploy the Flask app to a global hosting platform (e.g., Heroku, Render) for worldwide access (set EMAIL_USER, EMAIL_PASS, RECEIVER_EMAIL as env vars).
- [ ] Update the form action in index.html and fetch URL in script.js to the deployed endpoint.
- [ ] Verify email delivery and form functionality after deployment.
