import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function RequestsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState(''); // '', 'Pending', 'Approved', 'Rejected'

  const fetchRequests = async (statusFilter = '') => {
    setLoading(true);
    try {
      const endpoint = statusFilter ? `/requests?status=${statusFilter}` : '/requests';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load requests audit', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests(filter);
    }
  }, [token, filter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="panel-card">
      <div className="panel-card-header" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <h2 className="panel-card-title">Institutional Requests Log</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            All Requests
          </button>
          <button className={`btn ${filter === 'Pending' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('Pending')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            Pending
          </button>
          <button className={`btn ${filter === 'Approved' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('Approved')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            Approved
          </button>
          <button className={`btn ${filter === 'Rejected' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('Rejected')} style={{ padding: '6px 12px', fontSize: '12px' }}>
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <svg className="spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
        </div>
      ) : (
        <div className="table-responsive" style={{ marginTop: '16px' }}>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Request Type</th>
                <th>Request Ticket ID</th>
                <th>Requested Resource Item</th>
                <th>Submitted Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={`${r.request_type}-${r.id}`}>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ 
                        backgroundColor: r.request_type === 'Medium' ? 'var(--primary-light)' : '#f1f5f9', 
                        color: r.request_type === 'Medium' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: '600'
                      }}
                    >
                      {r.request_type}
                    </span>
                  </td>
                  <td><code>{r.id}</code></td>
                  <td style={{ fontWeight: '600' }}>{r.item_name}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>
                    <span className={`status-badge ${r.status === 'Approved' ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: r.status === 'Approved' ? 'var(--success-bg)' : r.status === 'Pending' ? 'var(--warning-bg)' : 'var(--danger-bg)', color: r.status === 'Approved' ? 'var(--success-text)' : r.status === 'Pending' ? 'var(--warning-text)' : 'var(--danger-text)' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No request applications found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RequestsTab;
