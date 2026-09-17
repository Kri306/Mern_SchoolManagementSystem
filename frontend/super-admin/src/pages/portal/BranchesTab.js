import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';


function BranchesTab({ token, handleLogout, searchTerm }) {
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    school_id: '',
    branch_name: '',
    branch_code: '',
    short_branch_code: '',
    principal_name: '',
    contact_person: '',
    contact_number: '',
    branch_email: '',
    is_main_branch: false,
    address: ''
  });

  const fetchBranches = useCallback(async () => {
    try {
      const res = await apiFetch('/master/branches', token, handleLogout);
      if (res.success) {
        setBranches(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await apiFetch('/schools', token, handleLogout);
        if (res.success) {
          setSchools(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load schools list for dropdowns', err);
      }
    };
    fetchSchools();
    fetchBranches();
  }, [token, handleLogout, fetchBranches]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.school_id || !form.branch_name || !form.branch_code) {
      alert('School, Branch Name and Branch Code are required.');
      return;
    }

    try {
      const res = await apiFetch('/master/branches', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({
          school_id: parseInt(form.school_id, 10),
          branch_name: form.branch_name,
          branch_code: form.branch_code,
          short_branch_code: form.short_branch_code,
          address: form.address,
          contact_person: form.contact_person,
          contact_number: form.contact_number,
          branch_email: form.branch_email,
          principal_name: form.principal_name,
          is_main_branch: form.is_main_branch
        })
      });

      if (res.success) {
        fetchBranches();
        setForm({
          school_id: '',
          branch_name: '',
          branch_code: '',
          short_branch_code: '',
          principal_name: '',
          contact_person: '',
          contact_number: '',
          branch_email: '',
          is_main_branch: false,
          address: ''
        });
        setShowAddForm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to register branch');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/master/branches/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchBranches();
      }
    } catch (err) {
      alert(err.message || 'Failed to update branch status');
    }
  };

  const filtered = branches.filter(b =>
    (b.branch_name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (b.branch_code || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (b.school_name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Branches Directory ({filtered.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : 'Add Branch'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ margin: '20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '14px', fontWeight: '600' }}>Register New School Branch</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Select Associated School *</label>
              <select className="form-input" value={form.school_id} onChange={e => setForm({ ...form, school_id: e.target.value })} required>
                <option value="">-- Select School --</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.school_code})</option>)}
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Branch Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Dwarka Campus" value={form.branch_name} onChange={e => setForm({ ...form, branch_name: e.target.value })} required />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Branch Code *</label>
                <input type="text" className="form-input" placeholder="e.g. DPS-DWK-02" value={form.branch_code} onChange={e => setForm({ ...form, branch_code: e.target.value })} required />
              </div>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Short Code</label>
                <input type="text" className="form-input" placeholder="e.g. DWK" value={form.short_branch_code} onChange={e => setForm({ ...form, short_branch_code: e.target.value })} />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Principal Name</label>
              <input type="text" className="form-input" placeholder="e.g. Dr. Jane Doe" value={form.principal_name} onChange={e => setForm({ ...form, principal_name: e.target.value })} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Contact Person</label>
              <input type="text" className="form-input" placeholder="e.g. Administrator Head" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Contact Number</label>
              <input type="text" className="form-input" placeholder="+919999999999" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Branch Email</label>
              <input type="email" className="form-input" placeholder="branch@school.com" value={form.branch_email} onChange={e => setForm({ ...form, branch_email: e.target.value })} />
            </div>

            <div className="input-group" style={{ marginBottom: 0, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                <input type="checkbox" checked={form.is_main_branch} onChange={e => setForm({ ...form, is_main_branch: e.target.checked })} style={{ accentColor: 'var(--primary)', scale: '1.2' }} />
                <span>Is Main Branch (Campus Headquarter)</span>
              </label>
            </div>

            <div className="input-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
              <label className="input-label">Postal Address</label>
              <input type="text" className="form-input" placeholder="Full street address details" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '14px' }}>Save Branch</button>
        </form>
      )}

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>School & Branch</th>
              <th>Branch Code</th>
              <th>Principal / Contact</th>
              <th>Address Details</th>
              <th>Branch Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <div>
                    <strong style={{ color: 'var(--primary)' }}>{b.branch_name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Short Code: {b.short_branch_code || 'N/A'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.school_name}</div>
                  </div>
                </td>
                <td><span className="school-code-text">{b.branch_code}</span></td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: '600' }}>{b.principal_name || 'N/A'}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{b.branch_email} | {b.contact_number}</div>
                  </div>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'normal' }}>
                  {b.address || 'N/A'}
                </td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: b.is_main_branch ? 'var(--primary-light)' : '#f1f5f9', color: b.is_main_branch ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {b.is_main_branch ? 'Main Campus' : 'Sub-Branch'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(b.id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No branches registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BranchesTab;
