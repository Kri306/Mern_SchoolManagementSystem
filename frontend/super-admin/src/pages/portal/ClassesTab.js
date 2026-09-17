import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function ClassesTab({ token, handleLogout, searchTerm }) {
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ class_name: '', school_id: '', branch_id: '', student_capacity: '', location: '' });

  const fetchClasses = useCallback(async () => {
    try {
      const res = await apiFetch('/master/classes', token, handleLogout);
      if (res.success) {
        setClasses(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const schoolsRes = await apiFetch('/schools', token, handleLogout);
        if (schoolsRes.success) setSchools(schoolsRes.data || []);

        const branchesRes = await apiFetch('/master/branches', token, handleLogout);
        if (branchesRes.success) setBranches(branchesRes.data || []);
      } catch (err) {
        console.error('Failed to load schools or branches', err);
      }
    };

    if (token) {
      fetchMetadata();
      fetchClasses();
    }
  }, [token, handleLogout, fetchClasses]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.class_name || !form.student_capacity || !form.school_id || !form.branch_id) return;

    try {
      const res = await apiFetch('/master/classes', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          school_id: parseInt(form.school_id, 10),
          branch_id: parseInt(form.branch_id, 10),
          student_capacity: parseInt(form.student_capacity, 10)
        })
      });
      if (res.success) {
        fetchClasses();
        setForm({ class_name: '', school_id: '', branch_id: '', student_capacity: '', location: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to create class');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/classes/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchClasses();
      }
    } catch (err) {
      alert(err.message || 'Failed to change class status');
    }
  };

  const filtered = classes.filter(c =>
    c.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.school_name && c.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Classes Configuration ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Map Class'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Associate Class with Campus</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Select Associated School *</label>
              <select className="form-input" value={form.school_id} onChange={e => setForm({ ...form, school_id: e.target.value })} required>
                <option value="">-- Select School --</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Select Campus Branch *</label>
              <select className="form-input" value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })} required>
                <option value="">-- Select Branch --</option>
                {branches.filter(b => !form.school_id || b.school_id === parseInt(form.school_id)).map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Class Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Grade 12 (Arts)" value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Max Student Capacity *</label>
              <input type="number" className="form-input" placeholder="e.g. 40" value={form.student_capacity} onChange={e => setForm({ ...form, student_capacity: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Location Room / Block</label>
              <input type="text" className="form-input" placeholder="e.g. Block A - Rm 12" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Map Class</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Institution & Branch</th>
              <th>Max Capacity</th>
              <th>Classroom / Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.school_class_id}>
                <td><strong>{c.class_name}</strong></td>
                <td>
                  <div>{c.school_name || 'Global'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.branch_name || '-'}</div>
                </td>
                <td>{c.student_capacity} Students</td>
                <td><code>{c.location || 'N/A'}</code></td>
                <td>
                  <span className={`status-badge ${c.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {c.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(c.school_class_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No classroom maps configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClassesTab;
