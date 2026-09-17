import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function StaffTypesTab({ token, handleLogout, searchTerm }) {
  const [types, setTypes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchTypes = useCallback(async () => {
    try {
      const res = await apiFetch('/master/staff-types', token, handleLogout);
      if (res.success) {
        setTypes(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load types', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchTypes();
    }
  }, [token, fetchTypes]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      const res = await apiFetch('/master/staff-types', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchTypes();
        setForm({ name: '', description: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save staff category');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/staff-types/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchTypes();
      }
    } catch (err) {
      alert(err.message || 'Failed to update category status');
    }
  };

  const filtered = types.filter(t =>
    t.type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Staff Types Registry ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Type'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Staff Role Category</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Type Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Accountant" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ width: '100%', marginBottom: 0 }}>
              <label className="input-label">Role Description</label>
              <input type="text" className="form-input" placeholder="Brief details about role boundaries" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Type</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Type / Category Name</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td><strong>{t.type_name}</strong></td>
                <td>{t.description || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${t.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(t.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No staff role categories registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffTypesTab;
