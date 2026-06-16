import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../service/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        style={{
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          padding: '48px 52px',
          width: '100%',
          maxWidth: 460,
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <i
            className="bi bi-bank2"
            style={{
              fontSize: 48,
              color: 'var(--primary-color)',
              background: 'var(--primary-light)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'inline-block',
              marginBottom: 16,
            }}
          ></i>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              marginBottom: 4,
            }}
          >
            BankApp
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle-fill"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="bi bi-person-fill"></i>
              Username
            </label>
            <div className="input-wrapper">
              <i className="bi bi-person input-icon"></i>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="bi bi-lock-fill"></i>
              Password
            </label>
            <div className="input-wrapper">
              <i className="bi bi-key input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat spinner"></i>
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;