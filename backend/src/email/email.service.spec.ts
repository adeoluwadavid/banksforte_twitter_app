import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendTweetNotification', () => {
    it('should log email notification details', async () => {
      const recipientEmail = 'recipient@example.com';
      const recipientName = 'Recipient User';
      const tweetContent = 'This is a test tweet';
      const authorName = 'Author User';

      await service.sendTweetNotification(
        recipientEmail,
        recipientName,
        tweetContent,
        authorName,
      );

      expect(loggerSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('SENDING EMAIL NOTIFICATION'),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(recipientEmail),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(tweetContent),
      );
    });
  });

  describe('sendBatchTweetNotifications', () => {
    it('should send notifications to multiple recipients', async () => {
      const recipients = [
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' },
      ];
      const tweetContent = 'Batch tweet';
      const authorName = 'Author';

      await service.sendBatchTweetNotifications(
        recipients,
        tweetContent,
        authorName,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Sending tweet notifications to 2 recipient(s)',
        ),
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Successfully sent 2 email notification(s)'),
      );
    });

    it('should handle empty recipients array', async () => {
      await service.sendBatchTweetNotifications([], 'tweet', 'author');

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Sending tweet notifications to 0 recipient(s)',
        ),
      );
    });
  });
});
