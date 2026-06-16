import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../service/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync icon when sidebar closes itself (overlay click)
  useEffect(() => {
    const handleSidebarClose = () => setIsSidebarOpen(false);
    window.addEventListener('sidebarClose', handleSidebarClose);
    return () => window.removeEventListener('sidebarClose', handleSidebarClose);
  }, []);

  // Reset sidebar state on route change
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
      window.dispatchEvent(new CustomEvent('sidebarClose'));
    }
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

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', { detail: { collapsed: next } })
    );
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Left — Sidebar Toggle & Brand */}
        <div className="navbar-left">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className={`bi ${isSidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>

          <Link to="/" className="navbar-brand">
            <i className="bi bi-bank2"></i>
            <span>BankApp</span>
          </Link>
        </div>

        {/* Right — Desktop only */}
        <div className="navbar-desktop">
          {token ? (
            <>
              <div className="nav-user-badge">
                <i className="bi bi-person-circle"></i>
                <span>{user.username || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout-btn">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
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