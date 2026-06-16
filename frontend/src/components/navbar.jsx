import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../service/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand">
          <i className="bi bi-bank2"></i>
          <span>BankApp</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {token ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <i className="bi bi-grid-1x2-fill"></i>
                <span>Dashboard</span>
              </Link>
              <Link to="/send-money" className={`nav-link ${location.pathname === '/send-money' ? 'active' : ''}`}>
                <i className="bi bi-send-fill"></i>
                <span>Send Money</span>
              </Link>
              <Link to="/deposit" className={`nav-link ${location.pathname === '/deposit' ? 'active' : ''}`}>
                <i className="bi bi-wallet2"></i>
                <span>Deposit</span>
              </Link>
              <Link to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
                <i className="bi bi-clock-history"></i>
                <span>Transactions</span>
              </Link>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <i className="bi bi-person-fill"></i>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
              <div className="nav-user-badge">
                <i className="bi bi-person-circle"></i>
                <span>{user.username || 'User'}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                <i className="bi bi-person-plus"></i>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-container">
          {token ? (
            <>
              <div className="mobile-user-info">
                <i className="bi bi-person-circle"></i>
                <div>
                  <h4>{user.username || 'User'}</h4>
                  <span>Account Holder</span>
                </div>
              </div>
              <Link to="/dashboard" className="mobile-nav-link">
                <i className="bi bi-grid-1x2-fill"></i>
                <span>Dashboard</span>
              </Link>
              <Link to="/send-money" className="mobile-nav-link">
                <i className="bi bi-send-fill"></i>
                <span>Send Money</span>
              </Link>
              <Link to="/deposit" className="mobile-nav-link">
                <i className="bi bi-wallet2"></i>
                <span>Deposit</span>
              </Link>
              <Link to="/transactions" className="mobile-nav-link">
                <i className="bi bi-clock-history"></i>
                <span>Transactions</span>
              </Link>
              <Link to="/profile" className="mobile-nav-link">
                <i className="bi bi-person-fill"></i>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="mobile-logout-btn">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link">
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </Link>
              <Link to="/register" className="mobile-nav-link">
                <i className="bi bi-person-plus"></i>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;