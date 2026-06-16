import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!paymentMethod) {
      setError('Please select a payment method');
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(`Deposit of $${amount} successful!`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit">
      <h2>
        <i className="bi bi-wallet2" style={{ color: 'var(--secondary-color)', marginRight: 10 }}></i>
        Deposit Money
      </h2>
      <p>Add funds to your account securely</p>

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

      <div className="deposit-form">
        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">
            <i className="bi bi-cash-coin"></i>
            Amount to Deposit
          </label>
          <div className="input-wrapper">
            <i className="bi bi-currency-dollar input-icon"></i>
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="1"
            />
          </div>
          <small style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Minimum deposit: $1.00
          </small>
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="paymentMethod">
            <i className="bi bi-credit-card"></i>
            Payment Method
          </label>
          <div className="input-wrapper">
            <i className="bi bi-wallet input-icon"></i>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select payment method</option>
              <option value="card">Credit / Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
        </div>

        {/* Card Details — shown only when card is selected */}
        {paymentMethod === 'card' && (
          <>
            <div className="form-group">
              <label htmlFor="cardNumber">
                <i className="bi bi-credit-card-2-front"></i>
                Card Number
              </label>
              <div className="input-wrapper">
                <i className="bi bi-credit-card input-icon"></i>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength="19"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label htmlFor="expiry">
                  <i className="bi bi-calendar-date"></i>
                  Expiry Date
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-calendar input-icon"></i>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    required
                    maxLength="5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cvv">
                  <i className="bi bi-shield-lock"></i>
                  CVV
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-lock input-icon"></i>
                  <input
                    type="password"
                    id="cvv"
                    placeholder="***"
                    required
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Submit */}
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
              <i className="bi bi-plus-circle-fill"></i>
              Deposit Funds
            </>
          )}
        </button>

        {/* Security notice inside the card */}
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
          <i className="bi bi-lock-fill" style={{ color: 'var(--secondary-color)', fontSize: 18 }}></i>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Deposit;