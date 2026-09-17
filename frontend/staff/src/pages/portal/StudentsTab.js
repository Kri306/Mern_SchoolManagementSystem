import React, { useState, useEffect, useCallback } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function StudentsTab({ token, handleLogout, user, searchTerm }) {
  const [loading, setLoading] = useState(true);
  const [studentsList, setStudentsList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);

  // Student Add Form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    student_unique_id: '',
    admission_number: '',
    batch_id: ''
  });
  const [studentModalError, setStudentModalError] = useState('');
  const [studentModalSuccess, setStudentModalSuccess] = useState('');
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  const fetchStudentsAndBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/dashboard/students', token, handleLogout);
      if (res.success) {
        setStudentsList(res.data || []);
      }
      // Also fetch batches for student add dropdown
      const batchesRes = await apiFetch('/dashboard/batches', token, handleLogout);
      if (batchesRes.success) {
        setBatchesList(batchesRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load students data', err);
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchStudentsAndBatches();
    }
  }, [token, fetchStudentsAndBatches]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStudentModalError('');
    setStudentModalSuccess('');
    setIsSubmittingStudent(true);

    const { name, email, phone_number, student_unique_id, admission_number, batch_id } = studentForm;
    if (!name || !student_unique_id || !admission_number || !batch_id) {
      setStudentModalError('Required fields must not be empty.');
      setIsSubmittingStudent(false);
      return;
    }

    try {
      const payload = {
        name,
        email: email || null,
        phone_number: phone_number || null,
        student_unique_id,
        admission_number,
        batch_id: parseInt(batch_id, 10),
        school_id: user?.school_id,
        created_by: user?.id
      };

      const res = await apiFetch('/students', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setStudentModalSuccess('Student added successfully!');
        setStudentForm({
          name: '',
          email: '',
          phone_number: '',
          student_unique_id: '',
          admission_number: '',
          batch_id: ''
        });
        fetchStudentsAndBatches(); // Reload table
        setTimeout(() => {
          setShowAddStudentModal(false);
          setStudentModalSuccess('');
        }, 1200);
      }
    } catch (err) {
      setStudentModalError(err.message || 'Failed to add student');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const filteredStudents = studentsList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_unique_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading students list...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">My Students List ({filteredStudents.length})</h2>
        <div>
          <button className="btn btn-primary" onClick={() => setShowAddStudentModal(true)}>
            <Icons.Plus /> Add Student to Batch
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Unique Student ID</th>
              <th>Admission No</th>
              <th>Name</th>
              <th>Contact Details</th>
              <th>Assigned Batch</th>
              <th>Parent Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id}>
                <td><code>{s.student_unique_id}</code></td>
                <td><span className="school-code-text">{s.admission_number}</span></td>
                <td style={{ fontWeight: '600' }}>{s.name}</td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <div>{s.email || 'N/A'}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{s.phone_number || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <div><strong style={{ color: 'var(--primary)' }}>{s.batch_code}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.class_name} - {s.section_name}</div>
                </td>
                <td>
                  {s.father_name ? (
                    <div style={{ fontSize: '12px' }}>
                      <div>{s.father_name}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{s.father_phone || 'N/A'}</div>
                    </div>
                  ) : 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No students registered under your batches.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal-overlay-panel" onClick={() => setShowAddStudentModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">Add Student to Batch</h3>
              <button className="modal-close-icon" onClick={() => setShowAddStudentModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {studentModalError && <div className="alert alert-error">{studentModalError}</div>}
                {studentModalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{studentModalSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Student Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Alice Smith" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} required />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Unique Student ID *</label>
                    <input type="text" className="form-input" placeholder="e.g. ST011" value={studentForm.student_unique_id} onChange={e => setStudentForm({ ...studentForm, student_unique_id: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Admission Number *</label>
                    <input type="text" className="form-input" placeholder="e.g. ADM011" value={studentForm.admission_number} onChange={e => setStudentForm({ ...studentForm, admission_number: e.target.value })} required />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="e.g. student@school.com" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Phone Number</label>
                  <input type="text" className="form-input" placeholder="e.g. +91999999999" value={studentForm.phone_number} onChange={e => setStudentForm({ ...studentForm, phone_number: e.target.value })} />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Select Assigned Batch *</label>
                  <select className="form-input" value={studentForm.batch_id} onChange={e => setStudentForm({ ...studentForm, batch_id: e.target.value })} required>
                    <option value="">-- Choose Batch --</option>
                    {batchesList.map(b => (
                      <option key={b.batch_id} value={b.batch_id}>{b.batch_code} ({b.class_name} - {b.section_name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddStudentModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingStudent}>
                  {isSubmittingStudent ? 'Saving...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsTab;
