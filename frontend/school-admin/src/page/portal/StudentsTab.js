import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function StudentsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    student_unique_id: '',
    admission_number: '',
    gr_number: '',
    name: '',
    email: '',
    password: '',
    phone_number: '',
    admission_date: '',
    roll_number: '',
    dob: '',
    gender: 'Male',
    blood_group: '',
    address: '',
    pincode: '',
    emergency_contact_number: '',
    student_parent_details: '',
    batch_id: '',
    is_fee_exempted: 0,
    gpa: 0.00,
    parent_ids: '',
    status: 'Active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sRes = await apiFetch('/students', token, handleLogout);
      if (sRes.success) setStudents(sRes.data || []);

      // Load all batches to bind selector
      const bRes = await apiFetch('/batches', token, handleLogout);
      if (bRes.success) setBatches(bRes.data || []);
    } catch (err) {
      console.error('Failed to load students profiles', err);
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

    if (!form.student_unique_id || !form.admission_number || !form.name || !form.batch_id) {
      setModalError('Unique ID, Admission Number, Name, and Batch are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      const payload = {
        ...form,
        batch_id: parseInt(form.batch_id, 10),
        is_fee_exempted: form.is_fee_exempted ? 1 : 0,
        gpa: parseFloat(form.gpa || 0.00)
      };

      if (modalMode === 'add') {
        res = await apiFetch('/students', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiFetch(`/students/${selectedStudentId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }

      if (res.success) {
        setModalSuccess(`Student registered ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        loadData();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save student record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (studentId) => {
    try {
      const res = await apiFetch(`/students/${studentId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddStudent = () => {
    setForm({
      student_unique_id: '',
      admission_number: '',
      gr_number: '',
      name: '',
      email: '',
      password: '',
      phone_number: '',
      admission_date: '',
      roll_number: '',
      dob: '',
      gender: 'Male',
      blood_group: '',
      address: '',
      pincode: '',
      emergency_contact_number: '',
      student_parent_details: '',
      batch_id: batches[0]?.batch_id || '',
      is_fee_exempted: 0,
      gpa: 0.00,
      parent_ids: '',
      status: 'Active'
    });
    setModalMode('add');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const openEditStudent = async (studentId) => {
    setModalError('');
    setModalSuccess('');
    try {
      const res = await apiFetch(`/students/${studentId}`, token, handleLogout);
      if (res.success && res.data) {
        const s = res.data;
        setForm({
          student_unique_id: s.student_unique_id || '',
          admission_number: s.admission_number || '',
          gr_number: s.gr_number || '',
          name: s.name || '',
          email: s.email || '',
          password: '',
          phone_number: s.phone_number || '',
          admission_date: s.admission_date ? s.admission_date.substring(0, 10) : '',
          roll_number: s.roll_number || '',
          dob: s.dob ? s.dob.substring(0, 10) : '',
          gender: s.gender || 'Male',
          blood_group: s.blood_group || '',
          address: s.address || '',
          pincode: s.pincode || '',
          emergency_contact_number: s.emergency_contact_number || '',
          student_parent_details: s.student_parent_details || '',
          batch_id: s.batch_id || '',
          is_fee_exempted: s.is_fee_exempted || 0,
          gpa: s.gpa || 0.00,
          parent_ids: s.parent_ids || '',
          status: s.status || 'Active'
        });
        setSelectedStudentId(studentId);
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (err) {
      alert('Failed to load student details.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading students profiles...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Enrolled Students ({students.length})</h2>
        <button className="btn btn-primary" onClick={openAddStudent}>
          <Icons.Plus /> Register Student
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Admission Code</th>
              <th>Student Name</th>
              <th>Contact Details</th>
              <th>Assigned Batch</th>
              <th>Fees Exemption</th>
              <th>GPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.student_id}>
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
                  <div><strong style={{ color: 'var(--primary)' }}>{s.batch_code || 'N/A'}</strong></div>
                </td>
                <td>{s.is_fee_exempted ? 'Exempted' : 'Standard Billing'}</td>
                <td>{s.gpa ? parseFloat(s.gpa).toFixed(2) : '0.00'}</td>
                <td>
                  <span 
                    className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                    onClick={() => toggleStatus(s.student_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => openEditStudent(s.student_id)} style={{ padding: '4px 8px', fontSize: '11.5px' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No students registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{modalMode === 'add' ? 'Register Student Profile' : 'Edit Student Details'}</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '450px', overflowY: 'auto' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Student Full Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Alice Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Unique Student ID *</label>
                    <input type="text" className="form-input" placeholder="e.g. ST011" value={form.student_unique_id} onChange={e => setForm({...form, student_unique_id: e.target.value})} required disabled={modalMode === 'edit'} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Admission Number *</label>
                    <input type="text" className="form-input" placeholder="e.g. ADM011" value={form.admission_number} onChange={e => setForm({...form, admission_number: e.target.value})} required />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">General Register (GR) No</label>
                    <input type="text" className="form-input" value={form.gr_number} onChange={e => setForm({...form, gr_number: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Roll Number</label>
                    <input type="text" className="form-input" value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Email Address</label>
                    <input type="email" className="form-input" placeholder="e.g. alice@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Phone Number</label>
                    <input type="text" className="form-input" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Date of Birth</label>
                    <input type="date" className="form-input" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Admission Date</label>
                    <input type="date" className="form-input" value={form.admission_date} onChange={e => setForm({...form, admission_date: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Gender</label>
                    <select className="form-input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Blood Group</label>
                    <input type="text" className="form-input" placeholder="e.g. O+" value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Select Cohort Batch *</label>
                    <select className="form-input" value={form.batch_id} onChange={e => setForm({...form, batch_id: e.target.value})} required>
                      <option value="">-- Choose Batch --</option>
                      {batches.map(b => (
                        <option key={b.batch_id} value={b.batch_id}>{b.batch_code} ({b.class_name} - {b.section_name})</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Link Parent Profiles (comma IDs)</label>
                    <input type="text" className="form-input" placeholder="e.g. 1, 3" value={form.parent_ids} onChange={e => setForm({...form, parent_ids: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Cumulative GPA</label>
                    <input type="number" step="0.01" className="form-input" value={form.gpa} onChange={e => setForm({...form, gpa: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Security Password {modalMode === 'edit' && '(blank to keep)'}</label>
                    <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={modalMode === 'add'} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Emergency Contact Phone</label>
                  <input type="text" className="form-input" value={form.emergency_contact_number} onChange={e => setForm({...form, emergency_contact_number: e.target.value})} />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Residential Address</label>
                  <input type="text" className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '500' }}>
                      <input type="checkbox" checked={form.is_fee_exempted === 1} onChange={e => setForm({...form, is_fee_exempted: e.target.checked ? 1 : 0})} />
                      Is Tuition Fee Exempted
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Student'}
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
