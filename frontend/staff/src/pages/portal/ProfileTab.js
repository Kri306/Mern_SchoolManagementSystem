import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ProfileTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/profile', token, handleLogout);
        if (res.success) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token, handleLogout]);

  const formatCurrency = (val) => {
    if (!val) return 'N/A';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading profile details...</div>;
  }

  if (!profileData) {
    return <div style={{ padding: '20px', color: '#f43f5e' }}>Failed to load profile.</div>;
  }

  return (
    <div className="panel-card" style={{ maxWidth: '800px' }}>
      <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Staff Profile Details</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.name}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.email}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.phone_number || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Staff Type / Role</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.staff_type_name || profileData.custom_staff_type || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Department</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.department_name || profileData.custom_staff_department || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Qualification</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.qualification || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Work Experience</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.experience || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monthly Salary</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500', color: 'var(--primary)' }}>{formatCurrency(profileData.salary)}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Institution</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.school_name}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Branch Assigned</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{profileData.branch_name}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Registration Status</label>
          <div>
            <span className="status-badge status-badge-active" style={{ padding: '6px 12px', fontSize: '13px' }}>
              {profileData.registration_status || 'Approved'}
            </span>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Account Status</label>
          <div>
            <span className="status-badge status-badge-active" style={{ padding: '6px 12px', fontSize: '13px' }}>
              {profileData.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
