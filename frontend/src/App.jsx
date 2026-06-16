import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Login from './pages/login';
import CustomerDashboard from './pages/customerdashboard';
import SendMoney from './pages/sendmoney';
import Transactions from './pages/transactions';
import Profile from './pages/profile';
import Deposit from './pages/deposit';
import './styles/main.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Layout with Navbar and Sidebar
const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-content">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/send-money" element={
          <ProtectedRoute>
            <MainLayout>
              <SendMoney />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <MainLayout>
              <Transactions />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/deposit" element={
          <ProtectedRoute>
            <MainLayout>
              <Deposit />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;