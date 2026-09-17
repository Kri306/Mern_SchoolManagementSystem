import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function AcademicYearsTab({ token, handleLogout, searchTerm }) {
  const [years, setYears] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ school_id: '', branch_id: '', academic_year_name: '', start_date: '', end_date: '' });

  const fetchYears = useCallback(async () => {
    try {
      const res = await apiFetch('/master/academic-years', token, handleLogout);
      if (res.success) {
        setYears(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load academic years', err);
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
        console.error('Failed to load metadata in AcademicYears', err);
      }
    };

    if (token) {
      fetchMetadata();
      fetchYears();
    }
  }, [token, handleLogout, fetchYears]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.academic_year_name || !form.start_date || !form.end_date || !form.school_id || !form.branch_id) return;

    try {
      const res = await apiFetch('/master/academic-years', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          school_id: parseInt(form.school_id, 10),
          branch_id: parseInt(form.branch_id, 10)
        })
      });
      if (res.success) {
        fetchYears();
        setForm({ school_id: '', branch_id: '', academic_year_name: '', start_date: '', end_date: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register academic year');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/academic-years/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchYears();
      }
    } catch (err) {
      alert(err.message || 'Failed to change status');
    }
  };

  const filtered = years.filter(y =>
    y.academic_year_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (y.school_name && y.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Academic Years Registry ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Year'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Academic Year</h3>
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
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Academic Year Label *</label>
              <input type="text" className="form-input" placeholder="e.g. Academic Year 2027-28" value={form.academic_year_name} onChange={e => setForm({ ...form, academic_year_name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">Start Date *</label>
              <input type="date" className="form-input" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="input-label">End Date *</label>
              <input type="date" className="form-input" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Year</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Academic Year Name</th>
              <th>Linked Campus</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(y => (
              <tr key={y.academic_year_id}>
                <td><strong>{y.academic_year_name}</strong></td>
                <td>
                  <div>{y.school_name || 'Global'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{y.branch_name || '-'}</div>
                </td>
                <td>{y.start_date ? new Date(y.start_date).toLocaleDateString() : '-'}</td>
                <td>{y.end_date ? new Date(y.end_date).toLocaleDateString() : '-'}</td>
                <td>
                  <span className={`status-badge ${y.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {y.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(y.academic_year_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    {y.status === 'Active' ? 'Set Inactive' : 'Set Active'}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No academic cycles registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcademicYearsTab;
