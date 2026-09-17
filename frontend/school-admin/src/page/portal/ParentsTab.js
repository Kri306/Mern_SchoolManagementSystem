import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function ParentsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [branches, setBranches] = useState([]);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    branch_id: '',
    telegram_chat_id: '',
    parent_details: '',
    status: 'Active'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await apiFetch('/parents', token, handleLogout);
      if (pRes.success) setParents(pRes.data || []);

      const bRes = await apiFetch('/branches', token, handleLogout);
      if (bRes.success) {
        setBranches(bRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load parents profiles', err);
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

    if (!form.name || !form.phone || (modalMode === 'add' && !form.password)) {
      setModalError('Name, Phone Number, and Password (for new parents) are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      const payload = {
        ...form,
        branch_id: form.branch_id ? parseInt(form.branch_id, 10) : 1
      };

      if (modalMode === 'add') {
        res = await apiFetch('/parents', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiFetch(`/parents/${selectedParentId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }

      if (res.success) {
        setModalSuccess(`Parent profile ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
        loadData();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to save parent details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (parentId) => {
    try {
      const res = await apiFetch(`/parents/${parentId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddParent = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      branch_id: branches[0]?.id || '',
      telegram_chat_id: '',
      parent_details: '',
      status: 'Active'
    });
    setModalMode('add');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  const openEditParent = async (parentId) => {
    setModalError('');
    setModalSuccess('');
    try {
      const res = await apiFetch(`/parents/${parentId}`, token, handleLogout);
      if (res.success && res.data) {
        const p = res.data;
        setForm({
          name: p.name || '',
          email: p.email || '',
          phone: p.phone || '',
          password: '',
          branch_id: p.branch_id || '',
          telegram_chat_id: p.telegram_chat_id || '',
          parent_details: p.parent_details || '',
          status: p.status || 'Active'
        });
        setSelectedParentId(parentId);
        setModalMode('edit');
        setShowModal(true);
      }
    } catch (err) {
      alert('Failed to retrieve parent details.');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading parent profiles...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Parent Profiles ({parents.length})</h2>
        <button className="btn btn-primary" onClick={openAddParent}>
          <Icons.Plus /> Add Parent
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Parent ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Telegram Chat ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map(p => (
              <tr key={p.parent_id}>
                <td><code>{p.parent_id}</code></td>
                <td style={{ fontWeight: '600' }}>{p.name}</td>
                <td>{p.email || 'N/A'}</td>
                <td>{p.phone}</td>
                <td>{p.telegram_chat_id || 'N/A'}</td>
                <td>
                  <span 
                    className={`status-badge ${p.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                    onClick={() => toggleStatus(p.parent_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => openEditParent(p.parent_id)} style={{ padding: '4px 8px', fontSize: '11.5px' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {parents.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No parent profiles registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{modalMode === 'add' ? 'Create Parent Profile' : 'Edit Parent Details'}</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Parent Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Robert Smith" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Phone Number *</label>
                  <input type="text" className="form-input" placeholder="e.g. +91 99999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="e.g. parent@school.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Select Branch</label>
                    <select className="form-input" value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}>
                      {branches.map(br => (
                        <option key={br.id} value={br.id}>{br.branch_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Telegram Chat ID</label>
                    <input type="text" className="form-input" placeholder="e.g. 987654321" value={form.telegram_chat_id} onChange={e => setForm({...form, telegram_chat_id: e.target.value})} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Login Password {modalMode === 'edit' && '(blank to keep)'}</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={modalMode === 'add'} />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Other Details / Note</label>
                  <textarea className="form-input" value={form.parent_details} onChange={e => setForm({...form, parent_details: e.target.value})} style={{ minHeight: '60px', padding: '10px' }} />
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentsTab;
