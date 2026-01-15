import { useState, createContext, useContext, useCallback } from 'react';
import '../styles/notifications.scss';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

function NotificationContainer({ notifications, onClose }) {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
}

function Notification({ type, message, onClose }) {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '🚨',
    info: 'ℹ️'
  };

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">{icons[type]}</span>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
}

export default NotificationProvider;
