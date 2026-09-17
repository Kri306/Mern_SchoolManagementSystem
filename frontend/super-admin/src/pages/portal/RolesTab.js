import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function RolesTab({ token, handleLogout, searchTerm }) {
  const [roles, setRoles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '' });

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiFetch('/master/roles', token, handleLogout);
      if (res.success) {
        setRoles(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load roles', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchRoles();
    }
  }, [token, fetchRoles]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      const res = await apiFetch('/master/roles', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchRoles();
        setForm({ name: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register role');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/roles/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchRoles();
      }
    } catch (err) {
      alert(err.message || 'Failed to update role status');
    }
  };

  const filtered = roles.filter(r =>
    r.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="panel-card" style={{ maxWidth: '600px' }}>
      <div className="panel-card-header">
        <h2 className="panel-card-title">Access Roles Registry ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Role'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Access Control Role</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Role Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Librarian Admin" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Role</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.role_id}>
                <td><strong>{r.role_name}</strong></td>
                <td>
                  <span className={`status-badge ${r.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(r.role_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No system roles registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RolesTab;
