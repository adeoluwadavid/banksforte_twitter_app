import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.brand}>
          Tweet App
        </Link>
        <div style={styles.menu}>
          <Link to="/dashboard" style={styles.link}>
            My Tweets
          </Link>
          <Link to="/shared" style={styles.link}>
            Shared with Me
          </Link>
          <Link to="/create-tweet" style={styles.link}>
            Create Tweet
          </Link>
          <Link to="/change-password" style={styles.link}>
            Change Password
          </Link>
          <span style={styles.user}>{user?.name}</span>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#007bff',
    padding: '16px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
  user: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
