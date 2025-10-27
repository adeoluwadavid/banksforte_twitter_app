import type { Tweet } from '../types';

interface TweetCardProps {
  tweet: Tweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.author}>{tweet.author.name}</h3>
          <p style={styles.email}>{tweet.author.email}</p>
        </div>
        <span style={styles.date}>{formatDate(tweet.createdAt)}</span>
      </div>
      <p style={styles.content}>{tweet.content}</p>
      {tweet.sharedWith && tweet.sharedWith.length > 0 && (
        <div style={styles.shared}>
          <strong>Shared with:</strong>
          <div style={styles.sharedList}>
            {tweet.sharedWith.map((share) => (
              <span key={share.id} style={styles.sharedUser}>
                {share.sharedWithUser.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  author: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  email: {
    margin: 0,
    fontSize: '12px',
    color: '#666',
  },
  date: {
    fontSize: '12px',
    color: '#999',
  },
  content: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#444',
  },
  shared: {
    paddingTop: '12px',
    borderTop: '1px solid #eee',
    fontSize: '12px',
    color: '#666',
  },
  sharedList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  sharedUser: {
    padding: '4px 8px',
    backgroundColor: '#e7f3ff',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#007bff',
  },
};
