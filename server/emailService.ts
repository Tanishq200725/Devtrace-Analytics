import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if configuration exists
    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        console.log(`[Email Service] SMTP Transporter configured successfully: ${host}`);
      } catch (err: any) {
        console.warn(`[Email Service Warning] Failed to initialize SMTP: ${err.message}`);
      }
    }
  }

  // Format HTML Email Template with dynamic details
  private getThankYouTemplate(email: string, messageBody: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Outfit', sans-serif; background-color: #0c0a09; color: #e7e5e4; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1c1917; border: 1px solid #2e2a24; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid #2e2a24; padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
          .logo { height: 32px; width: 32px; background-color: #6366f1; border-radius: 8px; display: inline-block; }
          .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 12px; }
          .body { font-size: 14px; line-height: 1.6; color: #a8a29e; }
          .quote { background-color: #0c0a09; border-left: 3px solid #6366f1; padding: 16px; border-radius: 8px; font-style: italic; font-family: monospace; margin: 20px 0; color: #d6d3d1; }
          .footer { border-top: 1px solid #2e2a24; padding-top: 20px; margin-top: 28px; text-align: center; font-size: 11px; color: #78716c; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo"></div>
            <div class="title">DevTrace Core Systems</div>
          </div>
          <div class="body">
            <p>Hello,</p>
            <p>Thank you for contributing to the evolution of DevTrace. We have successfully registered your feedback inside our systems:</p>
            <div class="quote">"${messageBody}"</div>
            <p>Our UX Engineering Team reviews every piece of advice to make DevTrace one of the highest quality code forensic systems in the world.</p>
            <p>Best regards,<br/><strong>UX Engineering Team</strong></p>
          </div>
          <div class="footer">
            Engineered by Tanishq Tyagi | Cloud & DevOps Infrastructure
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Format HTML Membership Upgrade Email Template
  private getUpgradeTemplate(email: string, tier: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Outfit', sans-serif; background-color: #0c0a09; color: #e7e5e4; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1c1917; border: 1px solid #2e2a24; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .header { border-bottom: 1px solid #2e2a24; padding-bottom: 20px; margin-bottom: 24px; text-align: center; }
          .logo { height: 32px; width: 32px; background: linear-gradient(135deg, #6366f1, #818cf8); border-radius: 8px; display: inline-block; }
          .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 12px; }
          .body { font-size: 14px; line-height: 1.6; color: #a8a29e; }
          .highlight { font-size: 18px; font-weight: bold; color: #6366f1; background-color: #0c0a09; padding: 12px 24px; border-radius: 8px; display: inline-block; margin: 16px 0; border: 1px solid #2e2a24; text-transform: uppercase; }
          .footer { border-top: 1px solid #2e2a24; padding-top: 20px; margin-top: 28px; text-align: center; font-size: 11px; color: #78716c; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo"></div>
            <div class="title">DevTrace System Upgrade</div>
          </div>
          <div class="body">
            <p>Dear Developer,</p>
            <p>Your transaction has been authorized successfully. Your DevTrace membership tier has been upgraded to:</p>
            <center>
              <div class="highlight">${tier} PLAN</div>
            </center>
            <p>Your excavation token limits have been refueled, and locked visual themes and experience levels have been successfully enabled on your profile dashboard.</p>
            <p>Best regards,<br/><strong>Billing Operations Core</strong></p>
          </div>
          <div class="footer">
            Engineered by Tanishq Tyagi | Cloud & DevOps Infrastructure
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send Thank You Email (SMTP or Console Dispatch log fallback)
  public async sendThankYouEmail(email: string, suggestion: string): Promise<void> {
    const subject = 'Thank you for your DevTrace suggestion!';
    const html = this.getThankYouTemplate(email, suggestion);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"DevTrace Support" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html
        });
        console.log(`[SMTP Mail Dispatch] Sent Thank You email to: ${email}`);
        return;
      } catch (err: any) {
        console.warn(`[SMTP Dispatch Failed] Falling back to Console Dispatch. Error: ${err.message}`);
      }
    }

    // Console Dispatcher (ASCII visual card)
    console.log(`\n+-------------------------------------------------------------+`);
    console.log(`|  [CONSOLE EMAIL DISPATCHER] (SMTP OFFLINE)                   |`);
    console.log(`|  To: ${email.padEnd(50, ' ')} |`);
    console.log(`|  Subject: ${subject.padEnd(45, ' ')} |`);
    console.log(`|                                                             |`);
    console.log(`|  Body:                                                      |`);
    console.log(`|  "Hello, thank you for your suggestion:                      |`);
    console.log(`|   ${suggestion.substring(0, 45).padEnd(46, ' ')}..." |`);
    console.log(`|  Best, UX Engineering Team.                                 |`);
    console.log(`+-------------------------------------------------------------+\n`);
  }

  // Send suggestion copy to owner mailbox: tanishqtyagi78@gmail.com
  public async sendSuggestionToOwner(fromUser: string, suggestion: string): Promise<void> {
    const ownerEmail = 'tanishqtyagi78@gmail.com';
    const subject = `[DevTrace Feedback] New Suggestion from ${fromUser}`;
    const html = `
      <h3>New DevTrace Suggestion Received</h3>
      <p><strong>Sender:</strong> ${fromUser}</p>
      <p><strong>Advice Detail:</strong></p>
      <div style="background-color: #f4f4f5; border-left: 3px solid #6366f1; padding: 12px; font-family: monospace;">
        ${suggestion}
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"DevTrace Support" <${process.env.SMTP_USER}>`,
          to: ownerEmail,
          subject,
          html
        });
        console.log(`[SMTP Mail Dispatch] Forwarded suggestion to Owner mailbox: ${ownerEmail}`);
        return;
      } catch (err: any) {
        console.warn(`[SMTP Dispatch Failed] Forwarding to Owner failed. Error: ${err.message}`);
      }
    }

    // Console Dispatcher (ASCII visual card fallback)
    console.log(`\n+-------------------------------------------------------------+`);
    console.log(`|  [OWNER MAILBOX NOTIFIER] (SMTP OFFLINE)                    |`);
    console.log(`|  To Owner: ${ownerEmail.padEnd(48, ' ')} |`);
    console.log(`|  Subject: ${subject.substring(0, 45).padEnd(45, ' ')} |`);
    console.log(`|                                                             |`);
    console.log(`|  Body Copy:                                                 |`);
    console.log(`|  "New advice from ${fromUser.substring(0, 20).padEnd(20, ' ')}:                   |`);
    console.log(`|   ${suggestion.substring(0, 45).padEnd(46, ' ')}..." |`);
    console.log(`+-------------------------------------------------------------+\n`);
  }

  // Send thanking note to user (either Email or Mobile SMS)
  public async sendThankYouToUser(contact: string, suggestion: string): Promise<void> {
    const isEmail = contact.includes('@');
    
    if (isEmail) {
      await this.sendThankYouEmail(contact, suggestion);
    } else {
      // Send Simulated SMS thank you
      console.log(`\n======================================================`);
      console.log(`  [SMS DISPATCHER GATEWAY] (SIMULATED SMS DISPATCH)`);
      console.log(`  Target Mobile: ${contact}`);
      console.log(`  Sender Host: DevTrace Gateway`);
      console.log(`  --------------------------------------------------`);
      console.log(`  Message Content:`);
      console.log(`  "Hi! Thank you for submitting your suggestion to`);
      console.log(`   DevTrace. Our UX Engineering team is actively`);
      console.log(`   reviewing it. We appreciate your feedback! -Tanishq"`);
      console.log(`======================================================\n`);
    }
  }

  // Send Membership Upgrade Email (SMTP or Console log fallback)
  public async sendUpgradeEmail(email: string, tier: string): Promise<void> {
    const subject = `Your DevTrace plan has been upgraded to ${tier.toUpperCase()}`;
    const html = this.getUpgradeTemplate(email, tier);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"DevTrace Billing" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html
        });
        console.log(`[SMTP Mail Dispatch] Sent Upgrade confirmation to: ${email}`);
        return;
      } catch (err: any) {
        console.warn(`[SMTP Dispatch Failed] Falling back to Console Dispatch. Error: ${err.message}`);
      }
    }

    // Console Dispatcher (ASCII visual card)
    console.log(`\n+-------------------------------------------------------------+`);
    console.log(`|  [CONSOLE EMAIL DISPATCHER] (SMTP OFFLINE)                   |`);
    console.log(`|  To: ${email.padEnd(50, ' ')} |`);
    console.log(`|  Subject: ${subject.padEnd(45, ' ')} |`);
    console.log(`|                                                             |`);
    console.log(`|  Body:                                                      |`);
    console.log(`|  "Dear Developer, your membership has been upgraded to      |`);
    console.log(`|   ${tier.toUpperCase().padEnd(57, ' ')} |`);
    console.log(`|   All locked themes and levels are now fully accessible."   |`);
    console.log(`+-------------------------------------------------------------+\n`);
  }
}
