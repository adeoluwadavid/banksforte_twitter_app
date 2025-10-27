import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTweet } from '../store/slices/tweetsSlice';
import { fetchUsers } from '../store/slices/usersSlice';
import Navbar from '../components/Navbar';

export default function CreateTweet() {
  const [content, setContent] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading: tweetLoading, error } = useAppSelector((state) => state.tweets);
  const { users, loading: usersLoading } = useAppSelector((state) => state.users);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      createTweet({
        content,
        sharedWithUserIds: selectedUsers.length > 0 ? selectedUsers : undefined,
      }),
    );
    if (createTweet.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const availableUsers = users.filter((user) => user.id !== currentUser?.id);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Create New Tweet</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tweet Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              style={styles.textarea}
              placeholder="What's on your mind?"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Share with users (optional)</label>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <div style={styles.userList}>
                {availableUsers.length === 0 ? (
                  <p style={styles.message}>No other users available to share with.</p>
                ) : (
                  availableUsers.map((user) => (
                    <label key={user.id} style={styles.userItem}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        style={styles.checkbox}
                      />
                      <span>
                        {user.name} ({user.email})
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Cancel
            </button>
            <button type="submit" disabled={tweetLoading} style={styles.button}>
              {tweetLoading ? 'Creating...' : 'Create Tweet'}
            </button>
          </div>
        </form>
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
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  userList: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '12px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    cursor: 'pointer',
    gap: '8px',
  },
  checkbox: {
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    padding: '12px 0',
  },
};
