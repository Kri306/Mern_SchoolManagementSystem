import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function BranchInfoTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    branch_name: '',
    branch_code: '',
    address: '',
    contact_person: '',
    contact_number: '',
    branch_email: '',
    principal_name: '',
    is_main_branch: 0,
    short_branch_code: '',
    status: 'Active'
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/branches', token, handleLogout);
      if (res.success) {
        setBranches(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load branches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBranches();
    }
  }, [token]);

  const openAddModal = () => {
    setForm({
      branch_name: '',
      branch_code: '',
      address: '',
      contact_person: '',
      contact_number: '',
      branch_email: '',
      principal_name: '',
      is_main_branch: 0,
      short_branch_code: '',
      status: 'Active'
    });
    setModalMode('add');
    setSelectedBranchId(null);
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setForm({
      branch_name: branch.branch_name || '',
      branch_code: branch.branch_code || '',
      address: branch.address || '',
      contact_person: branch.contact_person || '',
      contact_number: branch.contact_number || '',
      branch_email: branch.branch_email || '',
      principal_name: branch.principal_name || '',
      is_main_branch: branch.is_main_branch || 0,
      short_branch_code: branch.short_branch_code || '',
      status: branch.status || 'Active'
    });
    setModalMode('edit');
    setSelectedBranchId(branch.id);
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsSubmitting(true);

    if (!form.branch_name || !form.branch_code) {
      setModalError('Branch Name and Branch Code are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      if (modalMode === 'add') {
        res = await apiFetch('/branches', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(form)
        });
      } else {
        res = await apiFetch(`/branches/${selectedBranchId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      }

      if (res.success) {
        setModalSuccess(`Branch ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        fetchBranches();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save branch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (branchId) => {
    try {
      const res = await apiFetch(`/branches/${branchId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchBranches();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading branches...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Branch Management ({branches.length})</h2>
        <div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Icons.Plus /> Add Branch
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Branch Details</th>
              <th>Branch Code</th>
              <th>Principal</th>
              <th>Contacts</th>
              <th>Address</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch.id}>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{branch.branch_name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Short Code: {branch.short_branch_code || 'N/A'}</div>
                </td>
                <td><span className="school-code-text">{branch.branch_code}</span></td>
                <td>{branch.principal_name || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{branch.branch_email || 'N/A'}</span>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.Phone /> {branch.contact_number || 'N/A'}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', display: 'flex', alignItems: 'flex-start', gap: '4px', maxWidth: '200px' }}>
                    <Icons.MapPin />
                    <span>{branch.address || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${branch.is_main_branch ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: branch.is_main_branch ? 'var(--primary-light)' : '#f1f5f9', color: branch.is_main_branch ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {branch.is_main_branch ? 'Main Campus' : 'Sub-Branch'}
                  </span>
                </td>
                <td>
                  <span 
                    className={`status-badge ${branch.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                    onClick={() => toggleStatus(branch.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to toggle status"
                  >
                    {branch.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => openEditModal(branch)}
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No branches registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{modalMode === 'add' ? 'Create School Branch' : 'Edit School Branch'}</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Branch Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. North Campus" 
                    value={form.branch_name} 
                    onChange={e => setForm({...form, branch_name: e.target.value})}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Branch Code *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. BR002" 
                      value={form.branch_code} 
                      onChange={e => setForm({...form, branch_code: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Short Code</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. NC" 
                      value={form.short_branch_code} 
                      onChange={e => setForm({...form, short_branch_code: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Principal Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Dr. Smith" 
                      value={form.principal_name} 
                      onChange={e => setForm({...form, principal_name: e.target.value})}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Contact Person</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. coordinator" 
                      value={form.contact_person} 
                      onChange={e => setForm({...form, contact_person: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Branch Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. north@school.com" 
                      value={form.branch_email} 
                      onChange={e => setForm({...form, branch_email: e.target.value})}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Contact Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. +91 99999" 
                      value={form.contact_number} 
                      onChange={e => setForm({...form, contact_number: e.target.value})}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Address</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 123 Street Road" 
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '500' }}>
                      <input 
                        type="checkbox" 
                        checked={form.is_main_branch === 1} 
                        onChange={e => setForm({...form, is_main_branch: e.target.checked ? 1 : 0})}
                      />
                      Is Main Branch
                    </label>
                  </div>

                  {modalMode === 'edit' && (
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '500' }}>
                        <select 
                          className="form-input" 
                          value={form.status} 
                          onChange={e => setForm({...form, status: e.target.value})}
                          style={{ padding: '4px 8px', fontSize: '12.5px' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        Status
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : modalMode === 'add' ? 'Create Branch' : 'Update Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BranchInfoTab;
