import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountService, transactionService } from '../service/api';

const CustomerDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [user, setUser] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const accountData = JSON.parse(localStorage.getItem('account') || '{}');
    setUser(userData);
    setAccountNumber(accountData.account_number || '');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        accountService.getBalance(),
        transactionService.getAll(),
      ]);
      setBalance(balanceRes.data.balance);
      setRecentTransactions(
        (transactionsRes.data.results ?? transactionsRes.data).slice(0, 5)
      );
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.sender_name === transaction.receiver_name) return 'bi-arrow-repeat';
    if (transaction.sender_name === user?.username) return 'bi-arrow-up-right-circle-fill';
    return 'bi-arrow-down-left-circle-fill';
  };

  const getTransactionIconColor = (transaction) => {
    if (transaction.sender_name === transaction.receiver_name) return '#7c3aed';
    if (transaction.sender_name === user?.username) return 'var(--danger-color)';
    return 'var(--secondary-color)';
  };

  const getTransactionLabel = (transaction) => {
    if (transaction.sender_name === transaction.receiver_name) return 'Self Transfer';
    if (transaction.sender_name === user?.username) return `To ${transaction.receiver_name}`;
    return `From ${transaction.sender_name}`;
  };

  if (loading) return (
    <div className="loading-container">
      <i className="bi bi-arrow-repeat spinner"></i>
      <p>Loading your dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="bi bi-exclamation-triangle-fill"></i>
      <p>{error}</p>
      <button onClick={fetchDashboardData} className="retry-btn">
        <i className="bi bi-arrow-clockwise"></i>
        Retry
      </button>
    </div>
  );

  return (
    <div className="dashboard">

      {/* Welcome */}
      <div className="welcome-section">
        <h2>Welcome back, {user?.first_name || user?.username || 'User'}! 👋</h2>
        <p>Here's your account overview for today</p>
      </div>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <div>
            <h3>
              <i className="bi bi-wallet2"></i>
              Available Balance
            </h3>
            <h1>${Number(balance).toFixed(2)}</h1>
            <div className="account-number">
              <i className="bi bi-credit-card"></i>
              <span>Account: {accountNumber || 'N/A'}</span>
            </div>
          </div>
          <div className="balance-icon">
            <i className="bi bi-bank2"></i>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/send-money" className="action-card send">
          <i className="bi bi-send-fill"></i>
          <span>Send Money</span>
        </Link>
        <Link to="/deposit" className="action-card deposit">
          <i className="bi bi-plus-circle-fill"></i>
          <span>Deposit</span>
        </Link>
        <Link to="/transactions" className="action-card history">
          <i className="bi bi-clock-history"></i>
          <span>History</span>
        </Link>
        <Link to="/profile" className="action-card profile">
          <i className="bi bi-person-fill"></i>
          <span>Profile</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h3>
            <i className="bi bi-clock-history"></i>
            Recent Transactions
          </h3>
          <Link to="/transactions" className="view-all">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>No recent transactions</p>
          </div>
        ) : (
          <ul>
            {recentTransactions.map((transaction) => (
              <li key={transaction.id}>
                <div
                  className="transaction-icon"
                  style={{ background: `${getTransactionIconColor(transaction)}18` }}
                >
                  <i
                    className={`bi ${getTransactionIcon(transaction)}`}
                    style={{ color: getTransactionIconColor(transaction) }}
                  ></i>
                </div>

                <div className="transaction-info">
                  <span className="transaction-name">
                    {getTransactionLabel(transaction)}
                  </span>
                  <span className="transaction-date">
                    {new Date(transaction.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="transaction-amount">
                  <span
                    className={
                      transaction.sender_name === user?.username &&
                      transaction.sender_name !== transaction.receiver_name
                        ? 'amount-negative'
                        : 'amount-positive'
                    }
                  >
                    {transaction.sender_name === user?.username &&
                    transaction.sender_name !== transaction.receiver_name
                      ? '- '
                      : '+ '}
                    ${Number(transaction.amount).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default CustomerDashboard;