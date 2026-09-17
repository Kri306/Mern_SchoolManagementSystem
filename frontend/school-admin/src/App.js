import React, { useState, useEffect } from 'react';
import Login from './page/Login';
import Register from './page/Register';
import Dashboard from './page/Dashboard';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('school_admin_token') || null);
  const [user, setUser] = useState(null);

  // Auto-login on load if token exists
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('school_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setView('dashboard');
      } else {
        localStorage.removeItem('school_admin_token');
        setToken(null);
      }
    }
  }, [token]);

  const handleLoginSuccess = (newToken, userData) => {
    localStorage.setItem('school_admin_token', newToken);
    localStorage.setItem('school_admin_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('school_admin_token');
    localStorage.removeItem('school_admin_user');
    setToken(null);
    setUser(null);
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
          onNavigateToLogin={() => setView('login')} 
        />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          token={token} 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
