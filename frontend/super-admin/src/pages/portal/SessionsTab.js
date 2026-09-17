import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function SessionsTab({ token, handleLogout, searchTerm }) {
  const [sessions, setSessions] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ session_name: '', academic_year_id: '', session_number: '', start_date: '', end_date: '' });

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiFetch('/master/sessions', token, handleLogout);
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load academic sessions', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const yearsRes = await apiFetch('/master/academic-years', token, handleLogout);
        if (yearsRes.success) setAcademicYears(yearsRes.data || []);
      } catch (err) {
        console.error('Failed to load academic years', err);
      }
    };

    if (token) {
      fetchMetadata();
      fetchSessions();
    }
  }, [token, handleLogout, fetchSessions]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.session_name || !form.session_number || !form.academic_year_id) return;

    try {
      const res = await apiFetch('/master/sessions', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          academic_year_id: parseInt(form.academic_year_id, 10)
        })
      });
      if (res.success) {
        fetchSessions();
        setForm({ session_name: '', academic_year_id: '', session_number: '', start_date: '', end_date: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register session');
    }
  };

  const toggleCurrent = async (id) => {
    try {
      const res = await apiFetch(`/master/sessions/${id}/current`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchSessions();
      }
    } catch (err) {
      alert(err.message || 'Failed to update session current status');
    }
  };

  const filtered = sessions.filter(s =>
    s.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.academic_year_name && s.academic_year_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Academic Sessions Directory ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Session'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Academic Session</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Session Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Quarter 1 Term" value={form.session_name} onChange={e => setForm({ ...form, session_name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Session Code *</label>
              <input type="text" className="form-input" placeholder="e.g. SESS-03" value={form.session_number} onChange={e => setForm({ ...form, session_number: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Linked Year *</label>
              <select className="form-input" value={form.academic_year_id} onChange={e => setForm({ ...form, academic_year_id: e.target.value })} required>
                <option value="">-- Select Year --</option>
                {academicYears.map(y => <option key={y.academic_year_id} value={y.academic_year_id}>{y.academic_year_name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Start Date</label>
              <input type="date" className="form-input" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">End Date</label>
              <input type="date" className="form-input" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Session</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Session Name</th>
              <th>Academic Cycle</th>
              <th>Session Code</th>
              <th>Period Duration</th>
              <th>Session Status</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.session_id}>
                <td><strong>{s.session_name}</strong></td>
                <td>{s.academic_year_name || 'N/A'}</td>
                <td><code>{s.session_number}</code></td>
                <td>{s.start_date ? `${new Date(s.start_date).toLocaleDateString()} - ${new Date(s.end_date).toLocaleDateString()}` : 'N/A'}</td>
                <td>
                  <span className={`status-badge ${s.is_current ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: s.is_current ? 'var(--success-bg)' : '#f1f5f9', color: s.is_current ? 'var(--success-text)' : 'var(--text-secondary)' }}>
                    {s.is_current ? 'Current Session' : 'Prior Session'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {!s.is_current && (
                    <button className="btn btn-secondary" onClick={() => toggleCurrent(s.session_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                      Set Current
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No academic sessions configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionsTab;
