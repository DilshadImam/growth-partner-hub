const nodemailer = require('nodemailer').default || require('nodemailer');

class EmailService {
  constructor() {
    // Check if nodemailer is properly loaded
    if (!nodemailer || typeof nodemailer.createTransporter !== 'function') {
      console.warn('Nodemailer not properly configured. Email features will be disabled.');
      this.transporter = null;
      this.businessEmail = process.env.BUSINESS_EMAIL || 'dilshadimam21@gmail.com';
      this.fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      return;
    }

    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    this.businessEmail = process.env.BUSINESS_EMAIL || 'dilshadimam21@gmail.com';
    this.fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  // Send lead notification to business
  async sendLeadNotification(lead, subject = null) {
    if (!this.transporter) {
      console.log('Email service not configured. Skipping email notification.');
      return { success: false, message: 'Email service not configured' };
    }
    const emailSubject = subject || `New Lead: ${lead.name} from ${lead.source}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          🎯 New Lead Alert
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          ${lead.phone ? `<p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>` : ''}
          ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Business Details</h3>
          <p><strong>Industry:</strong> ${lead.industry}</p>
          <p><strong>Business Stage:</strong> ${lead.businessStage}</p>
          <p><strong>Budget:</strong> ${lead.budget}</p>
          <p><strong>Timeline:</strong> ${lead.timeline}</p>
          ${lead.servicesInterested.length > 0 ? `<p><strong>Services Interested:</strong> ${lead.servicesInterested.join(', ')}</p>` : ''}
        </div>

        ${lead.message ? `
        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6c757d; margin-top: 0;">Message</h3>
          <p style="font-style: italic;">"${lead.message}"</p>
        </div>
        ` : ''}

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Lead Score & Priority</h3>
          <p><strong>Score:</strong> ${lead.score}/100</p>
          <p><strong>Priority:</strong> ${lead.priority}</p>
          <p><strong>Status:</strong> ${lead.status}</p>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0c5460; margin-top: 0;">Tracking Information</h3>
          <p><strong>Source:</strong> ${lead.source}</p>
          ${lead.utmSource ? `<p><strong>UTM Source:</strong> ${lead.utmSource}</p>` : ''}
          ${lead.utmMedium ? `<p><strong>UTM Medium:</strong> ${lead.utmMedium}</p>` : ''}
          ${lead.utmCampaign ? `<p><strong>UTM Campaign:</strong> ${lead.utmCampaign}</p>` : ''}
          ${lead.referrer ? `<p><strong>Referrer:</strong> ${lead.referrer}</p>` : ''}
          <p><strong>IP Address:</strong> ${lead.ipAddress}</p>
          <p><strong>Submitted:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6c757d;">
            <strong>Next Steps:</strong> Contact this lead within 2 hours for best conversion rates!
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: this.businessEmail,
      subject: emailSubject,
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send confirmation email to lead
  async sendLeadConfirmation(lead) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #007bff, #6610f2); color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Thank You, ${lead.name}!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
        </div>
        
        <div style="padding: 30px; background: #fff; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${lead.name},</p>
          
          <p>Thank you for reaching out to us! We've received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">What happens next?</h3>
            <ul style="padding-left: 20px;">
              <li>Our team will review your requirements</li>
              <li>We'll prepare a customized strategy for your business</li>
              <li>You'll receive a detailed proposal within 48 hours</li>
              <li>We'll schedule a free consultation call</li>
            </ul>
          </div>

          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out our <a href="${process.env.FRONTEND_URL}/case-studies" style="color: #007bff;">case studies</a></li>
            <li>Read our <a href="${process.env.FRONTEND_URL}/blog" style="color: #007bff;">latest blog posts</a></li>
            <li>Follow us on social media for tips and insights</li>
          </ul>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #0066cc;">
              <strong>Need immediate assistance?</strong><br>
              Call us at <a href="tel:+1234567890" style="color: #007bff;">+1 (234) 567-8900</a><br>
              or email <a href="mailto:${this.businessEmail}" style="color: #007bff;">${this.businessEmail}</a>
            </p>
          </div>

          <p>Best regards,<br>
          <strong>Digital Growth Team</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: lead.email,
      subject: 'Thank you for your inquiry - We\'ll be in touch soon!',
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send consultation booking notification
  async sendConsultationNotification(lead, consultationDetails) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
          📅 Free Consultation Booking
        </h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724; margin-top: 0;">High Priority Lead - Consultation Request</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          ${lead.phone ? `<p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>` : ''}
          ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #28a745; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Consultation Preferences</h3>
          <p><strong>Preferred Date:</strong> ${consultationDetails.preferredDate}</p>
          <p><strong>Preferred Time:</strong> ${consultationDetails.preferredTime}</p>
          <p><strong>Timezone:</strong> ${consultationDetails.timezone}</p>
          <p><strong>Goals:</strong> ${consultationDetails.goals}</p>
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #856404;">
            <strong>⚡ Action Required:</strong> Contact within 2 hours for best results!
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: this.businessEmail,
      subject: `🔥 URGENT: Free Consultation Request from ${lead.name}`,
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send consultation confirmation to lead
  async sendConsultationConfirmation(lead, consultationDetails) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #28a745, #20c997); color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Consultation Booked!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We'll contact you within 2 hours</p>
        </div>
        
        <div style="padding: 30px; background: #fff; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${lead.name},</p>
          
          <p>Excellent! We've received your free consultation request. Our growth experts will contact you within the next <strong>2 hours</strong> to schedule your personalized session.</p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">Your Consultation Details</h3>
            <p><strong>Preferred Date:</strong> ${consultationDetails.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${consultationDetails.preferredTime}</p>
            <p><strong>Timezone:</strong> ${consultationDetails.timezone}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">What to expect in your consultation:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Business Analysis:</strong> We'll review your current digital presence</li>
              <li><strong>Growth Opportunities:</strong> Identify untapped potential in your market</li>
              <li><strong>Custom Strategy:</strong> Get a tailored roadmap for your business</li>
              <li><strong>ROI Projections:</strong> See potential returns on digital investments</li>
              <li><strong>Next Steps:</strong> Clear action plan to get started</li>
            </ul>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">💡 Pro Tip</h3>
            <p style="margin: 0;">Have your current website, social media accounts, and any marketing materials ready. This will help us provide more specific recommendations during your consultation.</p>
          </div>

          <p>Questions before we talk? Reply to this email or call us at <a href="tel:+1234567890" style="color: #28a745;">+1 (234) 567-8900</a></p>

          <p>Looking forward to helping you grow!<br>
          <strong>Digital Growth Team</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: lead.email,
      subject: '✅ Consultation Confirmed - We\'ll call you within 2 hours!',
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send newsletter welcome email
  async sendNewsletterWelcome(email, name = 'Subscriber') {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #6610f2, #007bff); color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Welcome to Our Newsletter!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Get ready for growth insights</p>
        </div>
        
        <div style="padding: 30px; background: #fff; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${name},</p>
          
          <p>Welcome to our exclusive newsletter! You're now part of a community of ambitious business owners and entrepreneurs who are serious about digital growth.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">What you'll receive:</h3>
            <ul style="padding-left: 20px;">
              <li>Weekly growth tips and strategies</li>
              <li>Case studies from successful campaigns</li>
              <li>Industry insights and trends</li>
              <li>Exclusive offers and early access to new services</li>
              <li>Free resources and templates</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/resources" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Free Resources
            </a>
          </div>

          <p>Stay tuned for valuable content that will help you grow your business online!</p>

          <p>Best regards,<br>
          <strong>Digital Growth Team</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="font-size: 12px; color: #6c757d; text-align: center;">
            You can unsubscribe at any time by clicking <a href="#" style="color: #6c757d;">here</a>
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: '🎉 Welcome to Digital Growth Insights!',
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Send lead update notification (when existing lead submits new form)
  async sendLeadUpdateNotification(lead, newMessage) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ffc107; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">
          🔄 Lead Update Alert
        </h2>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Existing Lead Submitted New Information</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          <p><strong>Current Status:</strong> ${lead.status}</p>
          <p><strong>Lead Score:</strong> ${lead.score}/100</p>
        </div>

        <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6c757d; margin-top: 0;">New Message</h3>
          <p style="font-style: italic;">"${newMessage}"</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #0c5460;">
            <strong>💡 Tip:</strong> This lead is showing continued interest - prioritize follow-up!
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: this.businessEmail,
      subject: `🔄 Lead Update: ${lead.name} submitted new information`,
      html: html
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();