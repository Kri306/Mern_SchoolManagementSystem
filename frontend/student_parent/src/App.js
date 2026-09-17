import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Portal from './pages/Portal';
import './App.css';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'portal'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sp_token') || '');

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('sp_token');
    const savedUser = localStorage.getItem('sp_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setView('portal');
    }
  }, []);

  const handleLoginSuccess = ({ token, user }) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    setView('portal');
  };

  const handleLogout = () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    setUser(null);
    setToken('');
    setView('login');
  };

  return (
    <div className="App">
      {view === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToRegister={() => setView('register')} 
        />
      )}
      {view === 'register' && (
        <Register 
          onRegisterSuccess={() => setView('login')} 
          onNavigateToLogin={() => setView('login')} 
        />
      )}
      {view === 'portal' && user && (
        <Portal 
          user={user} 
          token={token} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
