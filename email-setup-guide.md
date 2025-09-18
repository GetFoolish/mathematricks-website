# Free Email Setup Guide for Mathematricks Capital

## Option 1: Gmail + Google Apps Script (Recommended - Completely Free)

### Step 1: Create Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Email configuration
    const recipientEmail = "your-email@gmail.com"; // Replace with your email
    const subject = "New Contact Form Submission - Mathematricks Capital";

    // Create email body
    const emailBody = `
New contact form submission from Mathematricks Capital website:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Investment Interest: ${data.investment || 'Not provided'}

Message:
${data.message}

Submitted at: ${new Date().toLocaleString()}
`;

    // Send email
    GmailApp.sendEmail(recipientEmail, subject, emailBody);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL

### Step 3: Update Website Contact Form
Update the JavaScript in your `index.html` file:

```javascript
// Replace the contact form handling in index.html
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Send to Google Apps Script
        const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Thank you for your interest in Mathematricks Capital. We will contact you within 24 hours.');
            this.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        alert('There was an error sending your message. Please try again or contact us directly.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
```

## Option 2: Formspree (Free Tier - 50 submissions/month)

### Step 1: Sign up at Formspree
1. Go to [formspree.io](https://formspree.io)
2. Sign up for free account
3. Create a new form
4. Get your form endpoint URL

### Step 2: Update HTML Form
```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="hidden" name="_next" value="https://your-website.com/thank-you.html">
    <input type="hidden" name="_subject" value="New Contact - Mathematricks Capital">

    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="_replyto" required>
    </div>
    <div class="form-group">
        <label for="company">Company/Organization</label>
        <input type="text" id="company" name="company">
    </div>
    <div class="form-group">
        <label for="investment">Investment Interest</label>
        <input type="text" id="investment" name="investment">
    </div>
    <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
    </div>
    <button type="submit" class="submit-btn">Send Message</button>
</form>
```

## Option 3: Netlify Forms (Free - 100 submissions/month)

### Step 1: Deploy to Netlify
1. Push your code to GitHub
2. Connect GitHub to Netlify
3. Deploy your site

### Step 2: Add Netlify Form Attributes
```html
<form class="contact-form" name="contact" method="POST" data-netlify="true">
    <input type="hidden" name="form-name" value="contact">
    <!-- Rest of your form fields -->
</form>
```

## Option 4: EmailJS (Free - 200 emails/month)

### Step 1: Setup EmailJS
1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up and create email service
3. Get your service ID, template ID, and public key

### Step 2: Add EmailJS to Your Website
```html
<!-- Add before closing </body> tag -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
emailjs.init("YOUR_PUBLIC_KEY");

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(function() {
            alert('Thank you! Your message has been sent.');
        }, function(error) {
            alert('Failed to send message. Please try again.');
        });
});
</script>
```

## Professional Email Setup (Free Options)

### Google Workspace (Free for Personal Use)
1. Create Gmail account: `info@mathematricks.com` (using Gmail alias)
2. Set up email forwarding
3. Use Gmail's professional features

### Zoho Mail (Free - 5 users, 5GB per user)
1. Sign up at [zoho.com/mail](https://zoho.com/mail)
2. Add your domain
3. Verify domain ownership
4. Create professional email addresses

### ProtonMail (Free - 1GB storage)
1. Sign up at [proton.me](https://proton.me)
2. Create professional email
3. Use for secure communications

## Email Templates

### Auto-Response Template
```
Subject: Thank you for your interest in Mathematricks Capital

Dear [Name],

Thank you for reaching out to Mathematricks Capital. We have received your inquiry and appreciate your interest in our multi-strategy quantitative hedge fund.

Our team will review your message and respond within 24 hours to discuss your investment objectives and how Mathematricks Capital can help achieve your financial goals.

In the meantime, please feel free to review our investment approach and performance metrics on our website.

Best regards,
The Mathematricks Capital Team

---
This is an automated response. Please do not reply to this email.
For urgent matters, contact us directly at info@mathematricks.com
```

### Internal Notification Template
```
Subject: New Investor Inquiry - [Name] - [Company]

New contact form submission:

Name: [Name]
Email: [Email]
Company: [Company]
Investment Interest: [Investment]

Message:
[Message]

Submitted: [Timestamp]

Action Required: Follow up within 24 hours
Priority: [High/Medium/Low based on investment amount]
```

## Security and Privacy

### GDPR Compliance
- Add privacy policy link
- Include consent checkbox
- Implement data retention policies

### Spam Protection
- Add reCAPTCHA to forms
- Implement rate limiting
- Use honeypot fields

### Data Security
- Use HTTPS for all communications
- Encrypt sensitive data
- Regular security audits

## Monitoring and Analytics

### Email Delivery Monitoring
- Track delivery rates
- Monitor bounce rates
- Set up alerts for failures

### Response Time Tracking
- Monitor response times
- Set up automated reminders
- Track conversion rates

## Cost Analysis

| Service | Free Tier | Paid Features |
|---------|-----------|---------------|
| Google Apps Script | Unlimited | Advanced features |
| Formspree | 50/month | Unlimited submissions |
| Netlify Forms | 100/month | Advanced features |
| EmailJS | 200/month | Higher limits |
| Zoho Mail | 5 users, 5GB | More storage, users |

## Recommended Setup

For Mathematricks Capital, I recommend:

1. **Google Apps Script** for contact form processing (completely free)
2. **Gmail** with professional signature for email communications
3. **Zoho Mail** for custom domain email if needed
4. **reCAPTCHA** for spam protection

This setup provides professional email capabilities at zero cost while maintaining reliability and security.