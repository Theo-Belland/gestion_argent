import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SessionTimeout.scss';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes avant timeout

function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const timeoutIdRef = useRef(null);
  const warningIdRef = useRef(null);
  const countdownIdRef = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutIdRef.current);
    clearTimeout(warningIdRef.current);
    clearInterval(countdownIdRef.current);
    setShowWarning(false);

    // Warning 5 min avant
    warningIdRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(WARNING_TIME / 1000);
      
      // Countdown
      countdownIdRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIdRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Logout final
    timeoutIdRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  const handleStayConnected = () => {
    resetTimer();
  };

  useEffect(() => {
    // Initialiser le timer au montage
    const initTimer = setTimeout(() => resetTimer(), 0);
    return () => {
      clearTimeout(initTimer);
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningIdRef.current);
      clearInterval(countdownIdRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [showWarning, resetTimer]);

  if (!showWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <h2>⏰ Session bientôt expirée</h2>
        <p>
          Votre session va expirer dans <strong>{minutes}:{seconds.toString().padStart(2, '0')}</strong>
        </p>
        <p className="warning">
          Cliquez sur "Rester connecté" pour prolonger votre session.
        </p>
        <div className="session-timeout-actions">
          <button
            onClick={handleStayConnected}
            className="session-timeout-btn session-timeout-btn-primary"
          >
            Rester connecté
          </button>
          <button
            onClick={handleLogout}
            className="session-timeout-btn session-timeout-btn-secondary"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeout;
