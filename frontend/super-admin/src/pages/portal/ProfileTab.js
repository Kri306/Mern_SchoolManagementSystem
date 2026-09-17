import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';

function ProfileTab({ token, handleLogout, user }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (newPassword !== confirmPassword) {
      setSettingsError('New password and confirmation do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await apiFetch('/auth/change-password', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });

      if (res.success) {
        setSettingsSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setSettingsError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Super Admin Profile Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{user?.name || 'System Administrator'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</label>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{user?.email || 'superadmin@sms.com'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>System Account Role</label>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500', color: 'var(--primary)' }}>Super Administrator</div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Account Authority Level</label>
            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>Root Access Level 0</div>
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ maxWidth: '480px' }}>
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Change Account Password</h2>
        
        {settingsError && <div className="alert alert-error"><span>{settingsError}</span></div>}
        {settingsSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}><span>{settingsSuccess}</span></div>}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">New Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Confirm New Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isChangingPassword} style={{ marginTop: '8px', alignSelf: 'flex-start' }}>
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileTab;
