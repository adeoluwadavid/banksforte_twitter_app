import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

describe('TweetsService', () => {
  let service: TweetsService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    tweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    tweetShare: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockEmailService = {
    sendBatchTweetNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a tweet without sharing', async () => {
      const userId = 'user-1';
      const createTweetDto = {
        content: 'This is a test tweet',
      };

      const mockAuthor = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockTweet = {
        id: 'tweet-1',
        content: createTweetDto.content,
        authorId: userId,
        createdAt: new Date(),
        author: mockAuthor,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockAuthor);
      mockPrismaService.tweet.create.mockResolvedValue(mockTweet);

      const result = await service.create(userId, createTweetDto);

      expect(result).toEqual(mockTweet);
      expect(mockPrismaService.tweet.create).toHaveBeenCalledWith({
        data: {
          content: createTweetDto.content,
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(
        mockEmailService.sendBatchTweetNotifications,
      ).not.toHaveBeenCalled();
    });

    it('should create a tweet and share it with users', async () => {
      const userId = 'user-1';
      const createTweetDto = {
        content: 'This is a shared tweet',
        sharedWithUserIds: ['user-2', 'user-3'],
      };

      const mockAuthor = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
      };

      const mockTweet = {
        id: 'tweet-1',
        content: createTweetDto.content,
        authorId: userId,
        createdAt: new Date(),
        author: mockAuthor,
      };

      const mockRecipients = [
        { email: 'user2@example.com', name: 'User 2' },
        { email: 'user3@example.com', name: 'User 3' },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockAuthor);
      mockPrismaService.tweet.create.mockResolvedValue(mockTweet);
      mockPrismaService.tweetShare.create.mockResolvedValue({});
      mockPrismaService.user.findMany.mockResolvedValue(mockRecipients);
      mockEmailService.sendBatchTweetNotifications.mockResolvedValue(undefined);

      const result = await service.create(userId, createTweetDto);

      expect(result).toEqual(mockTweet);
      expect(mockEmailService.sendBatchTweetNotifications).toHaveBeenCalledWith(
        mockRecipients,
        mockTweet.content,
        mockAuthor.name,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create('invalid-user', { content: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMyTweets', () => {
    it('should return user tweets', async () => {
      const userId = 'user-1';
      const mockTweets = [
        {
          id: 'tweet-1',
          content: 'Tweet 1',
          authorId: userId,
          author: { id: userId, name: 'Test User', email: 'test@example.com' },
          sharedWith: [],
        },
      ];

      mockPrismaService.tweet.findMany.mockResolvedValue(mockTweets);

      const result = await service.findMyTweets(userId);

      expect(result).toEqual(mockTweets);
      expect(mockPrismaService.tweet.findMany).toHaveBeenCalledWith({
        where: { authorId: userId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findSharedWithMe', () => {
    it('should return tweets shared with user', async () => {
      const userId = 'user-1';
      const mockShares = [
        {
          tweet: {
            id: 'tweet-1',
            content: 'Shared tweet',
            author: {
              id: 'user-2',
              name: 'Other User',
              email: 'other@example.com',
            },
          },
        },
      ];

      mockPrismaService.tweetShare.findMany.mockResolvedValue(mockShares);

      const result = await service.findSharedWithMe(userId);

      expect(result).toEqual([mockShares[0].tweet]);
      expect(mockPrismaService.tweetShare.findMany).toHaveBeenCalledWith({
        where: { sharedWithId: userId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a tweet by id', async () => {
      const tweetId = 'tweet-1';
      const mockTweet = {
        id: tweetId,
        content: 'Test tweet',
        author: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
        sharedWith: [],
      };

      mockPrismaService.tweet.findUnique.mockResolvedValue(mockTweet);

      const result = await service.findOne(tweetId);

      expect(result).toEqual(mockTweet);
    });

    it('should throw NotFoundException if tweet not found', async () => {
      mockPrismaService.tweet.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
