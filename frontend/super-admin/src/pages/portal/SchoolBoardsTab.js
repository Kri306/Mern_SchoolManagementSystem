import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function SchoolBoardsTab({ token, handleLogout, searchTerm }) {
  const [boards, setBoards] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ board_name: '', code: '', description: '' });

  const fetchBoards = useCallback(async () => {
    try {
      const res = await apiFetch('/master/boards', token, handleLogout);
      if (res.success) {
        setBoards(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load boards', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchBoards();
    }
  }, [token, fetchBoards]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.board_name || !form.code) return;

    try {
      const res = await apiFetch('/master/boards', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchBoards();
        setForm({ board_name: '', code: '', description: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit board request');
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await apiFetch(`/master/boards/${id}/approve`, token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      if (res.success) {
        fetchBoards();
      }
    } catch (err) {
      alert(err.message || 'Failed to update board status');
    }
  };

  const filtered = boards.filter(b => 
    b.board_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.board_logo && b.board_logo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Master School Boards & Affiliations ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Request Board'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Request Master Board Approval</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Board Name *</label>
              <input type="text" className="form-input" placeholder="e.g. CBSE / IB" value={form.board_name} onChange={e => setForm({ ...form, board_name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Board Code *</label>
              <input type="text" className="form-input" placeholder="e.g. CBSE-IN" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="input-group" style={{ width: '100%', marginBottom: 0 }}>
              <label className="input-label">Description / Scope</label>
              <input type="text" className="form-input" placeholder="Board description details" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Submit Request</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Board Name</th>
              <th>Board Code</th>
              <th>Description</th>
              <th>Approval Status</th>
              <th>Approved By</th>
              <th>Processed Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.master_board_id}>
                <td><strong>{b.board_name}</strong></td>
                <td><span className="school-code-text">{b.board_logo || 'N/A'}</span></td>
                <td>{b.description || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-badge-${(b.approval_status || 'Pending').toLowerCase()}`}>
                    {b.approval_status}
                  </span>
                </td>
                <td>{b.approved_by || '-'}</td>
                <td>{b.approved_at ? new Date(b.approved_at).toLocaleDateString() : '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  {b.approval_status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }} onClick={() => handleAction(b.master_board_id, 'Approved')}>Approve</button>
                      <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }} onClick={() => handleAction(b.master_board_id, 'Rejected')}>Reject</button>
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

export default SchoolBoardsTab;
