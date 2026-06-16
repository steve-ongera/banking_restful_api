import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountService, transactionService } from '../service/api';

const CustomerDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        accountService.getBalance(),
        transactionService.getAll(),
      ]);
      setBalance(balanceRes.data.balance);
      // Get account number from user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.account) {
        setAccountNumber(user.account.account_number);
      }
      setRecentTransactions(transactionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <i className="bi bi-arrow-repeat spinner"></i>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <div>
            <h3><i className="bi bi-wallet2"></i> Current Balance</h3>
            <h1>${balance.toFixed(2)}</h1>
            <div className="account-number">
              <i className="bi bi-credit-card"></i>
              <span>Account: {accountNumber || 'N/A'}</span>
            </div>
          </div>
          <div className="balance-icon">
            <i className="bi bi-bank"></i>
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
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h3><i className="bi bi-clock-history"></i> Recent Transactions</h3>
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
                <div className="transaction-icon">
                  <i className={`bi ${transaction.sender === transaction.receiver ? 'bi-arrow-repeat' : 'bi-arrow-right-circle'}`}></i>
                </div>
                <div className="transaction-info">
                  <span className="transaction-name">
                    {transaction.sender_name === transaction.receiver_name 
                      ? 'Self Transfer' 
                      : transaction.receiver_name}
                  </span>
                  <span className="transaction-date">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="transaction-amount">
                  <span className={transaction.sender_name === 'You' ? 'amount-negative' : 'amount-positive'}>
                    {transaction.sender_name === 'You' ? '- ' : '+ '}${transaction.amount}
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