import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../service/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // collapsed class not used on mobile
        setIsMobileOpen(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleSidebarToggle = (event) => {
      if (window.innerWidth <= 768) {
        // On mobile: toggle the slide-in drawer
        setIsMobileOpen((prev) => !prev);
      } else {
        // On desktop: collapse/expand
        setIsCollapsed(event.detail.collapsed);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
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

  const handleOverlayClick = () => {
    setIsMobileOpen(false);
    // Sync navbar hamburger state by dispatching a close event
    window.dispatchEvent(new CustomEvent('sidebarClose'));
  };

  const menuItems = [
    { path: '/dashboard',    icon: 'bi-grid-1x2-fill', label: 'Dashboard'    },
    { path: '/send-money',   icon: 'bi-send-fill',     label: 'Send Money'   },
    { path: '/deposit',      icon: 'bi-wallet2',       label: 'Deposit'      },
    { path: '/transactions', icon: 'bi-clock-history', label: 'Transactions' },
    { path: '/profile',      icon: 'bi-person-fill',   label: 'Profile'      },
  ];

  // Build sidebar class string
  const sidebarClass = [
    'sidebar',
    !isMobile && isCollapsed ? 'sidebar-collapsed' : '',
    isMobile && isMobileOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Overlay — only rendered on mobile when sidebar is open */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
          onClick={handleOverlayClick}
        />
      )}

      <div className={sidebarClass}>
       

        {/* User Info */}
        <div className={`sidebar-user ${!isMobile && isCollapsed ? 'collapsed' : ''}`}>
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="user-info">
              <h4>{user.username || 'Guest'}</h4>
              <span>Account Holder</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={[
                    'nav-link',
                    location.pathname === item.path ? 'active' : '',
                    !isMobile && isCollapsed ? 'collapsed' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  title={!isMobile && isCollapsed ? item.label : ''}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`sidebar-footer ${!isMobile && isCollapsed ? 'collapsed' : ''}`}>
          {(!isCollapsed || isMobile) ? (
            <>
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
            </>
          ) : (
            <button
              className="logout-btn collapsed"
              onClick={handleLogout}
              title="Logout"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;