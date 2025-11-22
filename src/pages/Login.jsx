import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth, googleProvider } from '../firebase';
import NavBar from "../components/NavBar";

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
      <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-center">Log In</h2>
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded">Log In</button>
        <button
          type="button"
          className="w-full border border-pink-500 text-pink-600 py-2 rounded"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pink-500 hover:underline">Create one here.</Link>
        </div>
      </form>
    </Layout>
  );
}
