import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function SchoolInfoTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/school-info', token, handleLogout);
        if (res.success && res.data) {
          setSchool(res.data.school);
        }
      } catch (err) {
        console.error('Failed to load school info', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSchoolInfo();
    }
  }, [token, handleLogout]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading school details...</div>;
  }

  if (!school) {
    return <div style={{ padding: '20px', color: '#f43f5e' }}>Failed to load school information.</div>;
  }

  return (
    <div className="panel-card" style={{ maxWidth: '800px' }}>
      <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Associated School Profile</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>School Name</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{school.name}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>School Code</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}><span className="school-code-text">{school.school_code}</span></div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact Phone</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{school.contact_number || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{school.email_id || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>School Website</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500', color: 'var(--primary)' }}>{school.website_link || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Working Hours</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{school.working_hours || 'N/A'}</div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Postal Address</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{school.address || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}

export default SchoolInfoTab;
