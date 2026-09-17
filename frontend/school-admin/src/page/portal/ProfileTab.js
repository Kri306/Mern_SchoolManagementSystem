import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ProfileTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    profile_pic: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/profile', token, handleLogout);
        if (res.success && res.data) {
          setProfileForm({
            name: res.data.name || '',
            email: res.data.email || '',
            phone_number: res.data.phone_number || '',
            profile_pic: res.data.profile_pic || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
        setProfileError('Failed to load school admin profile information.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, handleLogout]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsSubmittingProfile(true);

    if (!profileForm.name || !profileForm.email) {
      setProfileError('Name and Email are required.');
      setIsSubmittingProfile(false);
      return;
    }

    try {
      const res = await apiFetch('/profile', token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      if (res.success) {
        setProfileSuccess('Profile details updated successfully!');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsSubmittingPassword(true);

    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      setIsSubmittingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      setIsSubmittingPassword(false);
      return;
    }

    try {
      const res = await apiFetch('/profile/change-password', token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (res.success) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading profile details...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
      
      {/* Edit Profile details */}
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          My Account Profile
        </h2>

        {profileError && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{profileError}</div>}
        {profileSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', marginBottom: '16px' }}>{profileSuccess}</div>}

        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileForm.name} 
                onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Email Address *</label>
              <input 
                type="email" 
                className="form-input" 
                value={profileForm.email} 
                onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileForm.phone_number} 
                onChange={e => setProfileForm({...profileForm, phone_number: e.target.value})}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Profile Avatar URL</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileForm.profile_pic} 
                onChange={e => setProfileForm({...profileForm, profile_pic: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? 'Saving...' : 'Update Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password panel */}
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          Change Password
        </h2>

        {passwordError && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{passwordError}</div>}
        {passwordSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', marginBottom: '16px' }}>{passwordSuccess}</div>}

        <form onSubmit={handlePasswordSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Current Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Current Password"
                value={passwordForm.oldPassword} 
                onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">New Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="New Password"
                value={passwordForm.newPassword} 
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required 
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Confirm New Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword} 
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmittingPassword}>
              {isSubmittingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default ProfileTab;
