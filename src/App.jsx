import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePunchPass from './pages/CreatePunchPass';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-punch-pass" element={<CreatePunchPass />} />
        
        {/* Add more routes as needed */}
      
      </Routes>
    </Router>
  );
}
export default App;