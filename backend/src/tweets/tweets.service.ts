import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Injectable()
export class TweetsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(userId: string, createTweetDto: CreateTweetDto) {
    // Get the author's information
    const author = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    // Create the tweet
    const tweet = await this.prisma.tweet.create({
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

    // If sharedWithUserIds is provided and not empty, create shares and send emails
    if (
      createTweetDto.sharedWithUserIds &&
      createTweetDto.sharedWithUserIds.length > 0
    ) {
      // Create tweet shares
      const sharePromises = createTweetDto.sharedWithUserIds.map(
        (sharedUserId) =>
          this.prisma.tweetShare.create({
            data: {
              tweetId: tweet.id,
              sharedWithId: sharedUserId,
            },
          }),
      );

      await Promise.all(sharePromises);

      // Get recipient information for emails
      const recipients = await this.prisma.user.findMany({
        where: {
          id: {
            in: createTweetDto.sharedWithUserIds,
          },
        },
        select: {
          email: true,
          name: true,
        },
      });

      // Send email notifications
      await this.emailService.sendBatchTweetNotifications(
        recipients,
        tweet.content,
        author.name,
      );
    }

    return tweet;
  }

  async findMyTweets(userId: string) {
    return this.prisma.tweet.findMany({
      where: {
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
        sharedWith: {
          include: {
            sharedWithUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findSharedWithMe(userId: string) {
    const sharedTweets = await this.prisma.tweetShare.findMany({
      where: {
        sharedWithId: userId,
      },
      include: {
        tweet: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sharedTweets.map((share) => share.tweet);
  }

  async findOne(id: string) {
    const tweet = await this.prisma.tweet.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sharedWith: {
          include: {
            sharedWithUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }

    return tweet;
  }
}
