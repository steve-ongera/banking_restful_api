import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../service/api';

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Note: This is a simplified deposit. In real app, you'd integrate with payment gateway
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate deposit - update balance (you'd need a deposit endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Deposit successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit">
      <h2>Deposit Money</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount to Deposit ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="1"
          />
        </div>
        <div>
          <label>Payment Method</label>
          <select required>
            <option value="">Select payment method</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Deposit'}
        </button>
      </form>
    </div>
  );
};

export default Deposit;