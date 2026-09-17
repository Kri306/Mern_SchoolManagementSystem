import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function BatchesTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  
  // Selection datasets for form modals
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [mediums, setMediums] = useState([]);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    batch_code: '',
    school_class_id: '',
    academic_year_id: '',
    section_id: '',
    teacher_id: '',
    school_medium_id: '',
    start_time: '',
    end_time: '',
    duration_minutes: 0,
    status: 'Active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const bRes = await apiFetch('/batches', token, handleLogout);
      if (bRes.success) setBatches(bRes.data || []);

      const cRes = await apiFetch('/classes', token, handleLogout);
      if (cRes.success) setSchoolClasses(cRes.data || []);

      const yRes = await apiFetch('/academic-years', token, handleLogout);
      if (yRes.success) setAcademicYears(yRes.data || []);

      const sRes = await apiFetch('/sections', token, handleLogout);
      if (sRes.success) setSections(sRes.data || []);

      const tRes = await apiFetch('/staff', token, handleLogout);
      if (tRes.success) setTeachers(tRes.data || []);

      const mRes = await apiFetch('/mediums', token, handleLogout);
      if (mRes.success) setMediums(mRes.data || []);
    } catch (err) {
      console.error('Failed to load batch related options data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsSubmitting(true);

    const { batch_code, school_class_id, academic_year_id, section_id } = form;
    if (!batch_code || !school_class_id || !academic_year_id || !section_id) {
      setModalError('Batch Code, Class, Academic Year, and Section are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      // Map empty teacher/medium to nulls
      const payload = {
        ...form,
        teacher_id: form.teacher_id ? parseInt(form.teacher_id, 10) : null,
        school_class_id: parseInt(form.school_class_id, 10),
        academic_year_id: parseInt(form.academic_year_id, 10),
        section_id: parseInt(form.section_id, 10),
        school_medium_id: form.school_medium_id ? parseInt(form.school_medium_id, 10) : null,
        duration_minutes: parseInt(form.duration_minutes || 0, 10)
      };

      if (modalMode === 'add') {
        res = await apiFetch('/batches', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiFetch(`/batches/${selectedBatchId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }

      if (res.success) {
        setModalSuccess(`Batch ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        loadData();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save batch details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (batchId) => {
    try {
      const res = await apiFetch(`/batches/${batchId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddBatch = () => {
    setForm({
      batch_code: '',
      school_class_id: schoolClasses[0]?.school_class_id || '',
      academic_year_id: academicYears[0]?.academic_year_id || '',
      section_id: sections[0]?.section_id || '',
      teacher_id: '',
      school_medium_id: '',
      start_time: '',
      end_time: '',
      duration_minutes: 0,
      status: 'Active'
    });
    setModalMode('add');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const openEditBatch = (b) => {
    setForm({
      batch_code: b.batch_code || '',
      school_class_id: b.school_class_id || '',
      academic_year_id: b.academic_year_id || '',
      section_id: b.section_id || '',
      teacher_id: b.teacher_id || '',
      school_medium_id: b.school_medium_id || '',
      start_time: b.start_time || '',
      end_time: b.end_time || '',
      duration_minutes: b.duration_minutes || 0,
      status: b.status || 'Active'
    });
    setSelectedBatchId(b.batch_id);
    setModalMode('edit');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading study batches...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Batch Cohorts ({batches.length})</h2>
        <button className="btn btn-primary" onClick={openAddBatch}>
          <Icons.Plus /> Create Batch
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Class Level</th>
              <th>Section</th>
              <th>Academic Year</th>
              <th>Assigned Teacher</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.batch_id}>
                <td><span className="school-code-text">{b.batch_code}</span></td>
                <td style={{ fontWeight: '600' }}>{b.class_name || `Class ID: ${b.school_class_id}`}</td>
                <td>{b.section_name || `Section ID: ${b.section_id}`}</td>
                <td>{b.academic_year_name || `Year ID: ${b.academic_year_id}`}</td>
                <td>{b.teacher_name || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</span>}</td>
                <td style={{ fontSize: '12.5px' }}>
                  {b.start_time ? `${b.start_time.substring(0, 5)} - ${b.end_time.substring(0, 5)}` : 'N/A'}
                  {b.duration_minutes > 0 && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>({b.duration_minutes} mins)</div>}
                </td>
                <td>
                  <span 
                    className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                    onClick={() => toggleStatus(b.batch_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => openEditBatch(b)} style={{ padding: '4px 8px', fontSize: '11.5px' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No batches registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{modalMode === 'add' ? 'Create Batch Cohort' : 'Edit Batch Cohort'}</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Batch Code *</label>
                  <input type="text" className="form-input" placeholder="e.g. BATCH-A-2026" value={form.batch_code} onChange={e => setForm({...form, batch_code: e.target.value})} required />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Select School Class *</label>
                  <select className="form-input" value={form.school_class_id} onChange={e => setForm({...form, school_class_id: e.target.value})} required>
                    <option value="">-- Choose Class --</option>
                    {schoolClasses.map(c => (
                      <option key={c.school_class_id} value={c.school_class_id}>{c.class_name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Select Academic Year *</label>
                    <select className="form-input" value={form.academic_year_id} onChange={e => setForm({...form, academic_year_id: e.target.value})} required>
                      <option value="">-- Choose Year --</option>
                      {academicYears.map(y => (
                        <option key={y.academic_year_id} value={y.academic_year_id}>{y.academic_year_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Select Section *</label>
                    <select className="form-input" value={form.section_id} onChange={e => setForm({...form, section_id: e.target.value})} required>
                      <option value="">-- Choose Section --</option>
                      {sections.map(s => (
                        <option key={s.section_id} value={s.section_id}>{s.section_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Assign Class Teacher</label>
                  <select className="form-input" value={form.teacher_id} onChange={e => setForm({...form, teacher_id: e.target.value})}>
                    <option value="">-- Choose Staff Member (Unassigned) --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Select Medium</label>
                  <select className="form-input" value={form.school_medium_id} onChange={e => setForm({...form, school_medium_id: e.target.value})}>
                    <option value="">-- Choose Medium --</option>
                    {mediums.map(m => (
                      <option key={m.school_medium_id} value={m.school_medium_id}>{m.medium_name} {m.custom_medium_name ? `(${m.custom_medium_name})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Start Time</label>
                    <input type="time" className="form-input" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">End Time</label>
                    <input type="time" className="form-input" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Duration (Minutes)</label>
                  <input type="number" className="form-input" placeholder="e.g. 45" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchesTab;
