import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function DepartmentsTab({ token, handleLogout, searchTerm }) {
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await apiFetch('/master/departments', token, handleLogout);
      if (res.success) {
        setDepartments(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token, fetchDepartments]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      const res = await apiFetch('/master/departments', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchDepartments();
        setForm({ name: '', description: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save department');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/departments/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchDepartments();
      }
    } catch (err) {
      alert(err.message || 'Failed to change department status');
    }
  };

  const filtered = departments.filter(d =>
    d.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Staff Departments ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Department'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Operational Department</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Department Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Library Department" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ width: '100%', marginBottom: 0 }}>
              <label className="input-label">Department Scope / Description</label>
              <input type="text" className="form-input" placeholder="What operations does this department control?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Department</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Operational Scope</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><strong>{d.department_name}</strong></td>
                <td>{d.description || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${d.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {d.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(d.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No operational departments registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DepartmentsTab;
