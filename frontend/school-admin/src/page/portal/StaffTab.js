import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function StaffTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffTypes, setStaffTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    branch_id: '',
    staff_type_id: '',
    custom_staff_type: '',
    department_id: '',
    custom_staff_department: '',
    office_location: '',
    qualification: '',
    joining_date: '',
    experience: '',
    salary: '',
    password: '',
    status: 'Active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sRes = await apiFetch('/staff', token, handleLogout);
      if (sRes.success) setStaff(sRes.data || []);

      const bRes = await apiFetch('/branches', token, handleLogout);
      if (bRes.success) {
        setBranches(bRes.data || []);
      }

      const tRes = await apiFetch('/staff/types', token, handleLogout);
      if (tRes.success) setStaffTypes(tRes.data || []);

      const dRes = await apiFetch('/staff/departments', token, handleLogout);
      if (dRes.success) setDepartments(dRes.data || []);
    } catch (err) {
      console.error('Failed to load staff management configurations', err);
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

    if (!form.name || !form.email || (modalMode === 'add' && !form.password) || !form.branch_id) {
      setModalError('Name, Email, Branch, and Password (for new staff) are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      const payload = {
        ...form,
        branch_id: parseInt(form.branch_id, 10),
        staff_type_id: form.staff_type_id ? parseInt(form.staff_type_id, 10) : null,
        department_id: form.department_id ? parseInt(form.department_id, 10) : null,
        salary: form.salary ? parseFloat(form.salary) : null
      };

      if (modalMode === 'add') {
        res = await apiFetch('/staff', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiFetch(`/staff/${selectedStaffId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }

      if (res.success) {
        setModalSuccess(`Staff member ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        loadData();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save staff details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (staffId) => {
    try {
      const res = await apiFetch(`/staff/${staffId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddStaff = () => {
    setForm({
      name: '',
      email: '',
      phone_number: '',
      branch_id: branches[0]?.id || '',
      staff_type_id: '',
      custom_staff_type: '',
      department_id: '',
      custom_staff_department: '',
      office_location: '',
      qualification: '',
      joining_date: '',
      experience: '',
      salary: '',
      password: '',
      status: 'Active'
    });
    setModalMode('add');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const openEditStaff = async (staffId) => {
    setModalError('');
    setModalSuccess('');
    try {
      const res = await apiFetch(`/staff/${staffId}`, token, handleLogout);
      if (res.success && res.data) {
        const s = res.data;
        setForm({
          name: s.name || '',
          email: s.email || '',
          phone_number: s.phone_number || '',
          branch_id: s.branch_id || '',
          staff_type_id: s.staff_type_id || '',
          custom_staff_type: s.custom_staff_type || '',
          department_id: s.department_id || '',
          custom_staff_department: s.custom_staff_department || '',
          office_location: s.office_location || '',
          qualification: s.qualification || '',
          joining_date: s.joining_date ? s.joining_date.substring(0, 10) : '',
          experience: s.experience || '',
          salary: s.salary || '',
          password: '', // blank by default on edit
          status: s.status || 'Active'
        });
        setSelectedStaffId(staffId);
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (err) {
      alert('Failed to retrieve staff details.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading staff profiles...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Staff Members ({staff.length})</h2>
        <button className="btn btn-primary" onClick={openAddStaff}>
          <Icons.Plus /> Register Staff
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Name & Credentials</th>
              <th>Contact Phone</th>
              <th>Assigned Branch</th>
              <th>Staff Category</th>
              <th>Department</th>
              <th>Registration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="avatar-cell">
                    <div className="avatar-round-icon admin-role" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.phone_number || 'N/A'}</td>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Branch ID: {s.branch_id}</span>
                </td>
                <td>{s.staff_type || s.custom_staff_type || 'Unspecified'}</td>
                <td>{s.department_name || s.custom_staff_department || 'Unspecified'}</td>
                <td>
                  <span className={`status-badge ${s.registration_status === 'Approved' ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: s.registration_status === 'Approved' ? 'var(--success-bg)' : 'var(--warning-bg)', color: s.registration_status === 'Approved' ? 'var(--success-text)' : 'var(--warning-text)' }}>
                    {s.registration_status || 'Pending'}
                  </span>
                </td>
                <td>
                  <span 
                    className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                    onClick={() => toggleStatus(s.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => openEditStaff(s.id)} style={{ padding: '4px 8px', fontSize: '11.5px' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No staff registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{modalMode === 'add' ? 'Register Staff / Teacher' : 'Edit Staff Details'}</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '450px', overflowY: 'auto' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Staff Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Email Address *</label>
                    <input type="email" className="form-input" placeholder="e.g. john@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Phone Number</label>
                    <input type="text" className="form-input" placeholder="e.g. +91 9999" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Select Branch *</label>
                    <select className="form-input" value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} required>
                      <option value="">-- Choose Branch --</option>
                      {branches.map(br => (
                        <option key={br.id} value={br.id}>{br.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Staff Category</label>
                    <select className="form-input" value={form.staff_type_id} onChange={e => setForm({...form, staff_type_id: e.target.value})}>
                      <option value="">-- Master Category --</option>
                      {staffTypes.map(st => (
                        <option key={st.id} value={st.id}>{st.type_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Custom Category (if not in master)</label>
                    <input type="text" className="form-input" placeholder="e.g. Assistant Teacher" value={form.custom_staff_type} onChange={e => setForm({...form, custom_staff_type: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Department</label>
                    <select className="form-input" value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                      <option value="">-- Select Department --</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.department_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Custom Department (if not in select)</label>
                  <input type="text" className="form-input" value={form.custom_staff_department} onChange={e => setForm({...form, custom_staff_department: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Office Location</label>
                    <input type="text" className="form-input" placeholder="e.g. Block C" value={form.office_location} onChange={e => setForm({...form, office_location: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Qualification</label>
                    <input type="text" className="form-input" placeholder="e.g. M.Sc. Mathematics" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Experience</label>
                    <input type="text" className="form-input" placeholder="e.g. 5 Years" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Joining Date</label>
                    <input type="date" className="form-input" value={form.joining_date} onChange={e => setForm({...form, joining_date: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Monthly Salary (INR)</label>
                    <input type="number" step="0.01" className="form-input" placeholder="e.g. 45000" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Password {modalMode === 'edit' && '(blank to keep current)'}</label>
                    <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={modalMode === 'add'} />
                  </div>
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Save Staff Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffTab;
