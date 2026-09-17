import React, { useState } from 'react';
import * as Icons from '../components/Icons';

function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }

    setAuthError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('http://localhost:5002/api/school-admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      if (data.success && data.token) {
        onLoginSuccess(data.token, data.user);
      } else {
        throw new Error('Authentication failed. No token provided.');
      }
    } catch (err) {
      setAuthError(err.message || 'Server connection failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Icons.SwirlLogo />
          </div>
          <h1 className="login-title">School Admin Panel</h1>
          <p className="login-subtitle">School Admin Credentials Authentication</p>
        </div>

        {authError && (
          <div className="alert alert-error">
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><Icons.Mail /></span>
              <input
                type="email"
                className="form-input"
                placeholder="admin@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><Icons.Lock /></span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoggingIn}
            style={{ marginBottom: '16px' }}
          >
            {isLoggingIn ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
                Verifying...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onNavigateToRegister}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              fontWeight: '600', 
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit'
            }}
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
