import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Portal from './pages/Portal';

function App() {
  const [view, setView] = useState('login'); // 'login' or 'dashboard'
  const [token, setToken] = useState(localStorage.getItem('super_admin_token') || null);
  const [user, setUser] = useState(null);

  // Auto-login on load if token exists
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('super_admin_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setView('dashboard');
      } else {
        localStorage.removeItem('super_admin_token');
        setToken(null);
      }
    }
  }, [token]);

  const handleLoginSuccess = (newToken, userData) => {
    localStorage.setItem('super_admin_token', newToken);
    localStorage.setItem('super_admin_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    localStorage.removeItem('super_admin_user');
    setToken(null);
    setUser(null);
    setView('login');
  };
 
  return (
    <div className="App">
      {view === 'login' ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Portal token={token} user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
