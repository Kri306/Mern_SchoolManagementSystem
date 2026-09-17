import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function SchoolMediumsTab({ token, handleLogout, searchTerm }) {
  const [mediums, setMediums] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  const fetchMediums = useCallback(async () => {
    try {
      const res = await apiFetch('/master/mediums', token, handleLogout);
      if (res.success) {
        setMediums(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load mediums', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchMediums();
    }
  }, [token, fetchMediums]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    try {
      const res = await apiFetch('/master/mediums', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchMediums();
        setForm({ name: '', code: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit medium request');
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await apiFetch(`/master/mediums/${id}/approve`, token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (res.success) {
        fetchMediums();
      }
    } catch (err) {
      alert(err.message || 'Failed to update medium status');
    }
  };

  const filtered = mediums.filter(m => 
    m.medium_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Mediums Registry & Approvals ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Request Medium'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Request Medium of Instruction approval</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Medium Name *</label>
              <input type="text" className="form-input" placeholder="e.g. English Medium" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Medium Code *</label>
              <input type="text" className="form-input" placeholder="e.g. ENG" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Submit Request</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Medium Name</th>
              <th>Code</th>
              <th>Approval Status</th>
              <th>Approved By</th>
              <th>Processed Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.master_medium_id}>
                <td><strong>{m.medium_name}</strong></td>
                <td><span className="school-code-text">{m.description || 'N/A'}</span></td>
                <td>
                  <span className={`status-badge status-badge-${(m.approval_status || 'Pending').toLowerCase()}`}>
                    {m.approval_status}
                  </span>
                </td>
                <td>{m.approved_by || '-'}</td>
                <td>{m.approved_at ? new Date(m.approved_at).toLocaleDateString() : '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  {m.approval_status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }} onClick={() => handleAction(m.master_medium_id, 'Approved')}>Approve</button>
                      <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }} onClick={() => handleAction(m.master_medium_id, 'Rejected')}>Reject</button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchoolMediumsTab;
