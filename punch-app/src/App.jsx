import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { auth } from './firebase';
import { useHabitStore } from './store/habitStore';

import CustomCursor from './components/CustomCursor';
import About from './pages/About';
import CardLayoutEditor from './pages/CardLayoutEditor';
import CreatePunchPass from './pages/CreatePunchPass';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchHabits = useHabitStore(state => state.fetchHabits);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchHabits(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [fetchHabits]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <CustomCursor size={35} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/create-punch-pass" 
          element={user ? <CreatePunchPass /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/card-layout-editor" 
          element={<CardLayoutEditor />} 
        />
      </Routes>
    </Router>
  );
}

export default App;