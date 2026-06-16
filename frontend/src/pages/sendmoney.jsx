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
      await transactionService.create(formData);
      setSuccess('Transfer successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-money">
      <h2>Send Money</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipient Account Number</label>
          <input
            type="text"
            name="receiver_account"
            value={formData.receiver_account}
            onChange={handleChange}
            required
            placeholder="Enter 12-digit account number"
          />
        </div>
        <div>
          <label>Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default SendMoney;