import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function BatchesTab({ token, handleLogout, searchTerm }) {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ batch_code: '', school_class_id: '', academic_year_id: '', section_id: '', teacher_id: '', capacity: '' });

  const fetchBatches = useCallback(async () => {
    try {
      const res = await apiFetch('/master/batches', token, handleLogout);
      if (res.success) {
        setBatches(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load batches', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const classesRes = await apiFetch('/master/classes', token, handleLogout);
        if (classesRes.success) setClasses(classesRes.data || []);

        const yearsRes = await apiFetch('/master/academic-years', token, handleLogout);
        if (yearsRes.success) setAcademicYears(yearsRes.data || []);

        const sectionsRes = await apiFetch('/master/sections', token, handleLogout);
        if (sectionsRes.success) setSections(sectionsRes.data || []);

        const staffRes = await apiFetch('/master/staff', token, handleLogout);
        if (staffRes.success) setTeachers(staffRes.data || []);
      } catch (err) {
        console.error('Failed to load metadata in BatchesTab', err);
      }
    };

    if (token) {
      fetchMetadata();
      fetchBatches();
    }
  }, [token, handleLogout, fetchBatches]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.batch_code || !form.school_class_id || !form.academic_year_id || !form.section_id) return;

    try {
      const res = await apiFetch('/master/batches', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          batch_code: form.batch_code,
          school_class_id: parseInt(form.school_class_id, 10),
          academic_year_id: parseInt(form.academic_year_id, 10),
          section_id: parseInt(form.section_id, 10),
          teacher_id: form.teacher_id ? parseInt(form.teacher_id, 10) : null
        })
      });
      if (res.success) {
        fetchBatches();
        setForm({ batch_code: '', school_class_id: '', academic_year_id: '', section_id: '', teacher_id: '', capacity: '' });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register batch');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/batches/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchBatches();
      }
    } catch (err) {
      alert(err.message || 'Failed to update batch status');
    }
  };

  const filtered = batches.filter(b =>
    b.batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.class_name && b.class_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.teacher_name && b.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Batches Configuration ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Batch'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Academic Batch Mapping</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Batch Code *</label>
              <input type="text" className="form-input" placeholder="e.g. GWH-B3-2026" value={form.batch_code} onChange={e => setForm({ ...form, batch_code: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Linked Year *</label>
              <select className="form-input" value={form.academic_year_id} onChange={e => setForm({ ...form, academic_year_id: e.target.value })} required>
                <option value="">-- Select Year --</option>
                {academicYears.map(y => <option key={y.academic_year_id} value={y.academic_year_id}>{y.academic_year_name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Class *</label>
              <select className="form-input" value={form.school_class_id} onChange={e => setForm({ ...form, school_class_id: e.target.value })} required>
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c.school_class_id} value={c.school_class_id}>{c.class_name} ({c.school_name})</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Section *</label>
              <select className="form-input" value={form.section_id} onChange={e => setForm({ ...form, section_id: e.target.value })} required>
                <option value="">-- Select Section --</option>
                {sections.map(s => <option key={s.section_id} value={s.section_id}>{s.section_name} ({s.room_number})</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Assigned Teacher</label>
              <select className="form-input" value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Batch</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Class & Section</th>
              <th>Academic Year</th>
              <th>Assigned Teacher</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.batch_id}>
                <td><strong style={{ color: 'var(--primary)' }}>{b.batch_code}</strong></td>
                <td>{b.class_name || 'N/A'} - {b.section_name || 'N/A'}</td>
                <td>{b.academic_year_name || 'N/A'}</td>
                <td><strong>{b.teacher_name || 'Not Assigned'}</strong></td>
                <td>
                  <span className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(b.batch_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No academic batch mappings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatchesTab;
