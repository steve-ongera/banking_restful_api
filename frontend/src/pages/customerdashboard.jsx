import React, { useState, useEffect } from 'react';
import { accountService, transactionService } from '../service/api';

const CustomerDashboard = () => {
  const [balance, setBalance] = useState(0);
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
      setRecentTransactions(transactionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="balance-card">
        <h3>Current Balance</h3>
        <h1>${balance.toFixed(2)}</h1>
      </div>
      
      <div className="quick-actions">
        <button onClick={() => window.location.href = '/send-money'}>
          Send Money
        </button>
        <button onClick={() => window.location.href = '/deposit'}>
          Deposit
        </button>
        <button onClick={() => window.location.href = '/transactions'}>
          View All Transactions
        </button>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <p>No recent transactions</p>
        ) : (
          <ul>
            {recentTransactions.map((transaction) => (
              <li key={transaction.id}>
                <span>{transaction.receiver_account}</span>
                <span>${transaction.amount}</span>
                <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;