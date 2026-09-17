import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function SectionsTab({ token, handleLogout, searchTerm }) {
  const [sections, setSections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ section_name: '', room_number: '' });

  const fetchSections = useCallback(async () => {
    try {
      const res = await apiFetch('/master/sections', token, handleLogout);
      if (res.success) {
        setSections(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load sections', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchSections();
    }
  }, [token, fetchSections]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.section_name) return;

    try {
      const res = await apiFetch('/master/sections', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(form)
      });
      if (res.success) {
        fetchSections();
        setForm({ section_name: '', room_number: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register section');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/sections/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchSections();
      }
    } catch (err) {
      alert(err.message || 'Failed to update section status');
    }
  };

  const filtered = sections.filter(s =>
    s.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.room_number && s.room_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Sections Directory ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Section'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New School Section</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Section Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Section D" value={form.section_name} onChange={e => setForm({ ...form, section_name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Room Number / Room Label</label>
              <input type="text" className="form-input" placeholder="e.g. Room 204" value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Section</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Section Name</th>
              <th>Room Number</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.section_id}>
                <td><strong>{s.section_name}</strong></td>
                <td><code>{s.room_number || 'N/A'}</code></td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(s.section_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No section configurations.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SectionsTab;
