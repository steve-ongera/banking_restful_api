import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../service/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  const menuItems = [
    { path: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { path: '/send-money', icon: 'bi-send-fill', label: 'Send Money' },
    { path: '/deposit', icon: 'bi-wallet2', label: 'Deposit' },
    { path: '/transactions', icon: 'bi-clock-history', label: 'Transactions' },
    { path: '/profile', icon: 'bi-person-fill', label: 'Profile' },
  ];

  return (
    <div className="sidebar">
      {/* Brand/Logo */}
      <div className="sidebar-brand">
        <i className="bi bi-bank"></i>
        <span>BankApp</span>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="bi bi-person-circle"></i>
        </div>
        <div className="user-info">
          <h4>{user.username || 'Guest'}</h4>
          <span>Account Holder</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        <div className="support-card">
          <i className="bi bi-headset"></i>
          <div>
            <h5>Need Help?</h5>
            <span>24/7 Support</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;