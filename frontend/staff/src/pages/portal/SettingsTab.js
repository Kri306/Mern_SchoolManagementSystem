import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';

function SettingsTab({ token, handleLogout }) {
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
      const res = await apiFetch('/dashboard/change-password', token, handleLogout, {
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
  );
}

export default SettingsTab;
