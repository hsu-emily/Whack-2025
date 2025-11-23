import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import NavBar from "../components/NavBar";
import { auth } from '../firebase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to a dashboard or home page after signup
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <NavBar></NavBar>
      <form onSubmit={handleSignup} className="form-container">
        <div className="form-group">
          <h2 className="page-heading">Sign Up</h2>
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
          <button type="submit" className="btn-form-primary">Sign Up</button>
          <div className="form-link">
            Already have an account?{' '}
            <Link to="/login">Log in here.</Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
