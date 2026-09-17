import React, { useState } from 'react';
import * as Icons from '../components/Icons';
import { API_BASE_URL } from '../utils/api';

function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Login failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      onLoginSuccess({ token: data.token, user: data.user });
    } catch (err) {
      setError('Connection to auth server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Icons.SwirlLogo />
          </div>
          <h1 className="login-title">Student & Parent Portal</h1>
          <p className="login-subtitle">Student / Parent Credentials Authentication</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
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
                placeholder="example@student.com"
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

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginBottom: '16px' }}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onNavigateToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
