import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function StaffTab({ token, handleLogout, searchTerm }) {
  const [staff, setStaff] = useState([]);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [staffTypes, setStaffTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    school_id: '',
    branch_id: '',
    staff_type_id: '',
    department_id: '',
    qualification: '',
    experience: '',
    salary: '',
    password: ''
  });

  const fetchStaff = useCallback(async () => {
    try {
      const res = await apiFetch('/master/staff', token, handleLogout);
      if (res.success) {
        setStaff(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load staff list', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const schoolsRes = await apiFetch('/schools', token, handleLogout);
        if (schoolsRes.success) setSchools(schoolsRes.data || []);

        const branchesRes = await apiFetch('/master/branches', token, handleLogout);
        if (branchesRes.success) setBranches(branchesRes.data || []);

        const typesRes = await apiFetch('/master/staff-types', token, handleLogout);
        if (typesRes.success) setStaffTypes(typesRes.data || []);

        const deptsRes = await apiFetch('/master/departments', token, handleLogout);
        if (deptsRes.success) setDepartments(deptsRes.data || []);
      } catch (err) {
        console.error('Failed to load metadata in StaffTab', err);
      }
    };

    if (token) {
      fetchMetadata();
      fetchStaff();
    }
  }, [token, handleLogout, fetchStaff]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.salary) return;

    try {
      const res = await apiFetch('/master/staff', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          school_id: form.school_id ? parseInt(form.school_id, 10) : null,
          branch_id: form.branch_id ? parseInt(form.branch_id, 10) : null,
          staff_type_id: form.staff_type_id ? parseInt(form.staff_type_id, 10) : null,
          department_id: form.department_id ? parseInt(form.department_id, 10) : null,
          salary: parseFloat(form.salary)
        })
      });

      if (res.success) {
        fetchStaff();
        setForm({
          name: '',
          email: '',
          phone_number: '',
          school_id: '',
          branch_id: '',
          staff_type_id: '',
          department_id: '',
          qualification: '',
          experience: '',
          salary: '',
          password: ''
        });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register staff member');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await apiFetch(`/master/staff/${id}/approve`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchStaff();
      }
    } catch (err) {
      alert(err.message || 'Failed to approve staff');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/staff/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchStaff();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle staff status');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.school_name && s.school_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.department_name && s.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Staff Management Directory ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Register Staff'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New Staff Member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Name *</label>
              <input type="text" className="form-input" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Email Address *</label>
              <input type="email" className="form-input" placeholder="email@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Password *</label>
              <input type="password" className="form-input" placeholder="At least 6 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Phone Number</label>
              <input type="text" className="form-input" placeholder="e.g. 9876543210" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">School Associated *</label>
              <select className="form-input" value={form.school_id} onChange={e => setForm({ ...form, school_id: e.target.value })} required>
                <option value="">-- Select School --</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Campus Branch</label>
              <select className="form-input" value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })}>
                <option value="">-- Select Branch --</option>
                {branches.filter(b => !form.school_id || b.school_id === parseInt(form.school_id)).map(b => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Staff Category / Type</label>
              <select className="form-input" value={form.staff_type_id} onChange={e => setForm({ ...form, staff_type_id: e.target.value })}>
                <option value="">-- Select Type --</option>
                {staffTypes.map(st => <option key={st.id} value={st.id}>{st.type_name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Department</label>
              <select className="form-input" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                <option value="">-- Select Department --</option>
                {departments.map(sd => <option key={sd.id} value={sd.id}>{sd.department_name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Qualification *</label>
              <input type="text" className="form-input" placeholder="e.g. M.Sc. Physics" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Salary (Monthly INR) *</label>
              <input type="number" className="form-input" placeholder="e.g. 50000" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Experience</label>
              <input type="text" className="form-input" placeholder="e.g. 5 Years" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>Save Staff</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Institution & Branch</th>
              <th>Category / Dept</th>
              <th>Qualifications / Exp</th>
              <th>Monthly Salary</th>
              <th>Reg. Status</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <strong>{s.name}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.email}</div>
                </td>
                <td>
                  <div>{s.school_name || 'Global / Unlinked'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.branch_name || '-'}</div>
                </td>
                <td>
                  <div>{s.staff_type || 'Unspecified'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.department_name || '-'}</div>
                </td>
                <td>
                  <div>{s.qualification}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Exp: {s.experience || '0 Years'}</div>
                </td>
                <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{formatCurrency(s.salary || 0)}</td>
                <td>
                  <span className={`status-badge status-badge-${(s.registration_status || 'Pending').toLowerCase()}`}>
                    {s.registration_status || 'Pending'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {s.registration_status === 'Pending' && (
                      <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }} onClick={() => handleApprove(s.id)}>Approve</button>
                    )}
                    <button className="btn btn-secondary" onClick={() => toggleStatus(s.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>Toggle</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffTab;
