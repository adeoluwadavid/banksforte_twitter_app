import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Mock function to send tweet notification email
   * In production, this would integrate with email providers like SendGrid, AWS SES, etc.
   */
  async sendTweetNotification(
    recipientEmail: string,
    recipientName: string,
    tweetContent: string,
    authorName: string,
  ): Promise<void> {
    // Simulate email sending
    this.logger.log('='.repeat(80));
    this.logger.log('📧 SENDING EMAIL NOTIFICATION');
    this.logger.log('='.repeat(80));
    this.logger.log(`To: ${recipientEmail} (${recipientName})`);
    this.logger.log(`Subject: New Tweet from ${authorName}`);
    this.logger.log('-'.repeat(80));
    this.logger.log('Email Body:');
    this.logger.log(`Hello ${recipientName},`);
    this.logger.log('');
    this.logger.log(`${authorName} has shared a tweet with you:`);
    this.logger.log('');
    this.logger.log(`"${tweetContent}"`);
    this.logger.log('');
    this.logger.log(
      'Visit the application to view and interact with this tweet.',
    );
    this.logger.log('='.repeat(80));
    this.logger.log('');

    // In a real application, you would call an email service here
    // Example: await this.emailProvider.send({ to: recipientEmail, subject: '...', body: '...' });
  }

  /**
   * Batch send tweet notifications to multiple recipients
   */
  async sendBatchTweetNotifications(
    recipients: Array<{ email: string; name: string }>,
    tweetContent: string,
    authorName: string,
  ): Promise<void> {
    this.logger.log(
      `📧 Sending tweet notifications to ${recipients.length} recipient(s)...`,
    );

    for (const recipient of recipients) {
      await this.sendTweetNotification(
        recipient.email,
        recipient.name,
        tweetContent,
        authorName,
      );
    }

    this.logger.log(
      `✅ Successfully sent ${recipients.length} email notification(s)`,
    );
  }
}
