import { useTheme } from '../contexts/ThemeContext';
import '../styles/themeToggle.scss';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Activer le mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;
