import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function ParentsTab({ token, handleLogout, searchTerm }) {
  const [parents, setParents] = useState([]);

  const fetchParents = useCallback(async () => {
    try {
      const res = await apiFetch('/master/parents', token, handleLogout);
      if (res.success) {
        setParents(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load parents list', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchParents();
    }
  }, [token, fetchParents]);

  const toggleStatus = async (parentId) => {
    try {
      const res = await apiFetch(`/master/parents/${parentId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchParents();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle parent status');
    }
  };

  const filtered = parents.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Parents Directory ({filtered.length})</h2>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Parent Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Telegram Chat ID</th>
              <th>Verification</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.parent_id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.email || 'N/A'}</td>
                <td>{p.phone}</td>
                <td><code>{p.telegram_chat_id || 'Not Linked'}</code></td>
                <td>
                  <span className={`status-badge ${p.otp_verified ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                    {p.otp_verified ? 'OTP Verified' : 'Verified'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${p.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(p.parent_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No parent records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParentsTab;
