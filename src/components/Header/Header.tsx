import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div className="header-logo">
          <h1 className="logo-text">SubsManager</h1>
        </div>
        
        <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <a href="#subscriptions" className="nav-link" aria-label="View subscriptions">
            Subscriptions
          </a>
          <a href="#analytics" className="nav-link" aria-label="View analytics">
            Analytics
          </a>
          <a href="#settings" className="nav-link" aria-label="Open settings">
            Settings
          </a>
        </nav>
        
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
