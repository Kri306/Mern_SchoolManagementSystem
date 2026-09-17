import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function SettingsTab({ token, user, handleLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchLoginHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLoginHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiFetch('/dashboard/login-history', token, handleLogout);
      if (res && res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load login history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/dashboard/change-password', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (res && res.success) {
        setMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ type: 'error', text: res?.message || 'Failed to update password.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Error updating password.' });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    try {
      return new Date(ts).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="tab-content-container">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>

        {/* 🔐 Change Password Card */}
        <div className="table-container" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 6px 0' }}>
            🔒 Change Password
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Update your account password to ensure your student/parent credentials remain secure.
          </p>

          {msg.text && (
            <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* 🛡️ Account Info Card */}
        <div className="table-container" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 6px 0' }}>
            🛡️ Account Security & Profile
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Overview of your active portal credentials and authentication session.
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Registered Email</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{user?.email || 'user@gpsgujarat.ac.in'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>User Role</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>
                <span className="badge badge-primary">{user?.role_name || (user?.role_id === 5 ? 'Parent' : 'Student')}</span>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Associated School</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{user?.school_name || 'Gujarat Public School'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Session Expiration</div>
              <div style={{ fontWeight: '600', marginTop: '2px', color: 'var(--success-text)' }}>24 Hours (Active JWT)</div>
            </div>
          </div>
        </div>

      </div>

      {/* 📜 Security Login Activity History */}
      <div className="table-container" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px 0' }}>
          🕵️ Recent Login Activity History
        </h3>

        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading activity logs...</div>
        ) : history.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>IP Address</th>
                  <th style={{ padding: '10px 14px' }}>Client / Browser</th>
                  <th style={{ padding: '10px 14px' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <td style={{ padding: '10px 14px', fontWeight: '600' }}>
                      {formatTimestamp(item.login_time)}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {item.ip_address || '127.0.0.1'}
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {item.user_agent || 'Mozilla Web Client'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`badge ${item.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No recent login activity recorded.
          </div>
        )}
      </div>

    </div>
  );
}

export default SettingsTab;
