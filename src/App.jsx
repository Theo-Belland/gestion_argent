import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AppContent from './AppContent';
import AdminDashboard from './components/AdminDashboard';
import Blog from './components/Blog';
import CookieConsent from './components/CookieConsent';
import ThemeToggle from './components/ThemeToggle';
import SessionTimeout from './components/SessionTimeout';
import NotificationProvider from './components/NotificationProvider';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import './styles/app.scss';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <ThemeToggle />
        <Navbar />
        <SessionTimeout />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/app/*" element={<AppContent />} />
        </Routes>
        <CookieConsent />
      </Router>
    </NotificationProvider>
  );
}

export default App;
