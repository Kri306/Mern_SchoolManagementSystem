import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function BranchInfoTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    const fetchBranchInfo = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/school-info', token, handleLogout);
        if (res.success && res.data) {
          setBranch(res.data.branch);
        }
      } catch (err) {
        console.error('Failed to load branch info', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBranchInfo();
    }
  }, [token, handleLogout]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading branch details...</div>;
  }

  if (!branch) {
    return <div style={{ padding: '20px', color: '#f43f5e' }}>Failed to load branch information.</div>;
  }

  return (
    <div className="panel-card" style={{ maxWidth: '800px' }}>
      <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>Assigned Branch Details</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Branch Name</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.branch_name}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Branch Code</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}><span className="school-code-text">{branch.branch_code}</span></div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Principal / Head</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.principal_name || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact Person</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.contact_person || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact Number</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.contact_number || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Branch Email</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.branch_email || 'N/A'}</div>
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Is Main Campus</label>
          <div>
            <span className="status-badge" style={{ backgroundColor: branch.is_main_branch ? 'var(--primary-light)' : '#f1f5f9', color: branch.is_main_branch ? 'var(--primary)' : 'var(--text-secondary)' }}>
              {branch.is_main_branch ? 'Main Campus' : 'Sub-Branch'}
            </span>
          </div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Address</label>
          <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontWeight: '500' }}>{branch.address || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}

export default BranchInfoTab;
