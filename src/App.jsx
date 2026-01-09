import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AppContent from './AppContent';
import AdminDashboard from './components/AdminDashboard';
import Blog from './components/Blog';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/app/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
