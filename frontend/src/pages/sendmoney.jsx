import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../service/api';

const SendMoney = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ receiver_account: '', amount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await transactionService.create({
        receiver_account: formData.receiver_account,
        amount: parseFloat(formData.amount),
      });
      setSuccess('Transfer successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-money">
      <h2>
        <i className="bi bi-send-fill" style={{ color: 'var(--primary-color)', marginRight: 10 }}></i>
        Send Money
      </h2>
      <p>Transfer funds securely to another account</p>

      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <i className="bi bi-check-circle-fill"></i>
          {success}
        </div>
      )}

      <div className="send-form">
        <div className="form-group">
          <label htmlFor="receiver_account">
            <i className="bi bi-credit-card-fill"></i>
            Recipient Account Number
          </label>
          <div className="input-wrapper">
            <i className="bi bi-credit-card input-icon"></i>
            <input
              type="text"
              id="receiver_account"
              name="receiver_account"
              placeholder="Enter 12-digit account number"
              value={formData.receiver_account}
              onChange={handleChange}
              required
              maxLength="12"
              pattern="[0-9]{12}"
              title="Please enter a valid 12-digit account number"
            />
          </div>
          <small style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Enter the 12-digit account number of the recipient
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            <i className="bi bi-cash-coin"></i>
            Amount
          </label>
          <div className="input-wrapper">
            <i className="bi bi-currency-dollar input-icon"></i>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <small style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Minimum amount: $0.01
          </small>
        </div>

        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="bi bi-arrow-repeat spinner"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-send-fill"></i>
              Send Money
            </>
          )}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <i className="bi bi-shield-lock-fill" style={{ color: 'var(--secondary-color)', fontSize: 18 }}></i>
          <span>Your transaction is secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;