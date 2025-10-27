import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TweetCard from './TweetCard';
import type { Tweet } from '../types';

describe('TweetCard', () => {
  const mockTweet: Tweet = {
    id: '1',
    content: 'This is a test tweet',
    authorId: 'user1',
    createdAt: '2024-01-01T12:00:00Z',
    author: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T10:00:00Z',
    },
  };

  it('renders tweet content', () => {
    render(<TweetCard tweet={mockTweet} />);
    expect(screen.getByText('This is a test tweet')).toBeInTheDocument();
  });

  it('renders author information', () => {
    render(<TweetCard tweet={mockTweet} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders shared users when present', () => {
    const tweetWithShares: Tweet = {
      ...mockTweet,
      sharedWith: [
        {
          id: 'share1',
          tweetId: '1',
          sharedWithId: 'user2',
          createdAt: '2024-01-01T12:00:00Z',
          sharedWithUser: {
            id: 'user2',
            name: 'Jane Doe',
            email: 'jane@example.com',
            createdAt: '2024-01-01T10:00:00Z',
          },
        },
      ],
    };

    render(<TweetCard tweet={tweetWithShares} />);
    expect(screen.getByText('Shared with:')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('does not render shared section when no shares', () => {
    render(<TweetCard tweet={mockTweet} />);
    expect(screen.queryByText('Shared with:')).not.toBeInTheDocument();
  });
});
