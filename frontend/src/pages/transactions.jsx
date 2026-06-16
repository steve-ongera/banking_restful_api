import React, { useState, useEffect } from 'react';
import { transactionService } from '../service/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll();
      setTransactions(response.data.results ?? response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filter === 'sent') {
      filtered = filtered.filter(t => t.sender_name === user?.username);
    } else if (filter === 'received') {
      filtered = filtered.filter(t => t.receiver_name === user?.username);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.receiver_account?.includes(searchTerm) ||
        t.sender_account?.includes(searchTerm) ||
        t.receiver_name?.toLowerCase().includes(term) ||
        t.sender_name?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  const getTransactionIcon = (transaction) => {
    if (transaction.sender_name === transaction.receiver_name) return 'bi-arrow-repeat';
    if (transaction.sender_name === user?.username) return 'bi-arrow-up-right-circle-fill';
    return 'bi-arrow-down-left-circle-fill';
  };

  const getAmountColor = (transaction) => {
    if (transaction.sender_name === transaction.receiver_name) return '#7c3aed';
    return transaction.sender_name === user?.username
      ? 'var(--danger-color)'
      : 'var(--secondary-color)';
  };

  if (loading) return (
    <div className="loading-container">
      <i className="bi bi-arrow-repeat spinner"></i>
      <p>Loading transactions...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="bi bi-exclamation-triangle-fill"></i>
      <p>{error}</p>
      <button onClick={fetchTransactions} className="retry-btn">
        <i className="bi bi-arrow-clockwise"></i>
        Retry
      </button>
    </div>
  );

  return (
    <div className="transactions">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Transaction History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
            {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={fetchTransactions} className="retry-btn">
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div
          style={{
            position: 'relative',
            flex: '1',
            minWidth: '220px',
          }}
        >
          <i
            className="bi bi-search"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
              fontSize: '16px',
              pointerEvents: 'none',
            }}
          ></i>
          <input
            type="text"
            placeholder="Search by name or account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              border: '2px solid var(--bg-gray)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--text-primary)',
              background: 'var(--bg-white)',
              transition: 'var(--transition)',
              outline: 'none',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.boxShadow = '0 0 0 4px var(--primary-light)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--bg-gray)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all',      label: 'All',      icon: 'bi-list-ul'             },
            { key: 'sent',     label: 'Sent',     icon: 'bi-arrow-up-circle'     },
            { key: 'received', label: 'Received', icon: 'bi-arrow-down-circle'   },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                border: '2px solid',
                borderColor: filter === key ? 'var(--primary-color)' : 'var(--bg-gray)',
                borderRadius: '50px',
                background: filter === key ? 'var(--primary-light)' : 'var(--bg-white)',
                color: filter === key ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: filter === key ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <i className={`bi ${icon}`}></i>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p>No transactions found</p>
            {searchTerm && (
              <small style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                Try adjusting your search or filter
              </small>
            )}
          </div>
        ) : (
          <ul>
            {filteredTransactions.map((transaction) => {
              const isSent = transaction.sender_name === user?.username;
              const isSelf = transaction.sender_name === transaction.receiver_name;
              const amountColor = getAmountColor(transaction);

              return (
                <li key={transaction.id}>
                  {/* Icon */}
                  <div
                    className="transaction-icon"
                    style={{ background: `${amountColor}18` }}
                  >
                    <i
                      className={`bi ${getTransactionIcon(transaction)}`}
                      style={{ color: amountColor }}
                    ></i>
                  </div>

                  {/* Info */}
                  <div className="transaction-info">
                    <span className="transaction-name">
                      {isSelf
                        ? 'Self Transfer'
                        : isSent
                        ? `To ${transaction.receiver_name}`
                        : `From ${transaction.sender_name}`}
                    </span>
                    <span className="transaction-date">
                      {new Date(transaction.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                      {' · '}
                      {new Date(transaction.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Account numbers */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      marginRight: '16px',
                      textAlign: 'right',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '500' }}>
                      {isSent ? transaction.receiver_account : transaction.sender_account}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-light)',
                        background: 'var(--bg-gray)',
                        padding: '2px 8px',
                        borderRadius: '50px',
                        alignSelf: 'flex-end',
                      }}
                    >
                      <i className="bi bi-check-circle-fill" style={{ color: 'var(--secondary-color)', marginRight: '4px' }}></i>
                      Completed
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="transaction-amount">
                    <span style={{ color: amountColor, fontWeight: '700', fontSize: '16px' }}>
                      {isSelf ? '' : isSent ? '− ' : '+ '}
                      ${Number(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
};

export default Transactions;