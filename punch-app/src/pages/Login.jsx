import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import NavBar from "../components/NavBar";
import { auth, googleProvider } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to a dashboard or home page after signup
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard'); // Redirect to a dashboard or home page after signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <NavBar></NavBar>
      <form onSubmit={handleLogin} className="form-container">
        <div className="form-group">
          <h2 className="page-heading">Log In</h2>
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-form-primary">Log In</button>
          <button
            type="button"
            className="btn-form-secondary"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </button>
          <div className="form-link">
            Don't have an account?{' '}
            <Link to="/signup">Create one here.</Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
