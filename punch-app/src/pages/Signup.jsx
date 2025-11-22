import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { auth } from '../firebase';
import NavBar from "../components/NavBar";

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

      <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-center">Sign Up</h2>
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
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded">Sign Up</button>
        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 hover:underline">Log in here.</Link>
        </div>
      </form>
    </Layout>
  );
}
