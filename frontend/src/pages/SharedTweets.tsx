import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSharedTweets } from '../store/slices/tweetsSlice';
import Navbar from '../components/Navbar';
import TweetCard from '../components/TweetCard';

export default function SharedTweets() {
  const dispatch = useAppDispatch();
  const { sharedTweets, loading, error } = useAppSelector((state) => state.tweets);

  useEffect(() => {
    dispatch(fetchSharedTweets());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Tweets Shared With Me</h1>
        {loading && <p style={styles.message}>Loading tweets...</p>}
        {error && <div style={styles.error}>{error}</div>}
        {!loading && sharedTweets.length === 0 && (
          <p style={styles.message}>No shared tweets yet.</p>
        )}
        <div style={styles.tweetList}>
          {sharedTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#333',
  },
  tweetList: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    padding: '40px 0',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '20px',
  },
};
