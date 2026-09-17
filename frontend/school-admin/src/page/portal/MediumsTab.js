import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function MediumsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [schoolMediums, setSchoolMediums] = useState([]);
  const [masterMediums, setMasterMediums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('existing'); // 'existing' or 'custom'
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    master_medium_id: '',
    name: '',
    description: '',
    custom_medium_name: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const smRes = await apiFetch('/mediums', token, handleLogout);
      if (smRes.success) setSchoolMediums(smRes.data || []);

      const mmRes = await apiFetch('/mediums/master', token, handleLogout);
      if (mmRes.success) {
        setMasterMediums(mmRes.data || []);
        if (mmRes.data.length > 0) {
          setForm(f => ({ ...f, master_medium_id: mmRes.data[0].master_medium_id }));
        }
      }
    } catch (err) {
      console.error('Failed to load school medium details', err);
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

    try {
      const payload = modalMode === 'existing' 
        ? { master_medium_id: parseInt(form.master_medium_id, 10), custom_medium_name: form.custom_medium_name }
        : { name: form.name, description: form.description };

      const res = await apiFetch('/mediums/request', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setModalSuccess('Medium request submitted successfully! Awaiting approval.');
        loadData();
        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await apiFetch(`/mediums/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openRequestModal = () => {
    setForm({
      master_medium_id: masterMediums[0]?.master_medium_id || '',
      name: '',
      description: '',
      custom_medium_name: ''
    });
    setModalMode('existing');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading educational mediums...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Educational Mediums ({schoolMediums.length})</h2>
        <button className="btn btn-primary" onClick={openRequestModal}>
          <Icons.Plus /> Request Medium Link
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>School Medium ID</th>
              <th>Medium Type</th>
              <th>Description / Note</th>
              <th>Approval State</th>
              <th>Status</th>
              <th>Toggle Active</th>
            </tr>
          </thead>
          <tbody>
            {schoolMediums.map(m => (
              <tr key={m.school_medium_id}>
                <td><code>{m.school_medium_id}</code></td>
                <td>
                  <div style={{ fontWeight: '600' }}>{m.medium_name}</div>
                  {m.custom_medium_name && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Custom: {m.custom_medium_name}</div>}
                </td>
                <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{m.description || 'Global Medium Option'}</td>
                <td>
                  <span className={`status-badge ${m.approval_status === 'Approved' ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: m.approval_status === 'Approved' ? 'var(--success-bg)' : 'var(--warning-bg)', color: m.approval_status === 'Approved' ? 'var(--success-text)' : 'var(--warning-text)' }}>
                    {m.approval_status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${m.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(m.school_medium_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {schoolMediums.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No mediums configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="modal-overlay-panel" onClick={() => setShowModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">Request Educational Medium</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', gap: '12px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '13px', fontWeight: modalMode === 'existing' ? '700' : '400', color: modalMode === 'existing' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    <input type="radio" name="mode" checked={modalMode === 'existing'} onChange={() => setModalMode('existing')} style={{ marginRight: '4px' }} />
                    Link Master Medium
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '13px', fontWeight: modalMode === 'custom' ? '700' : '400', color: modalMode === 'custom' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    <input type="radio" name="mode" checked={modalMode === 'custom'} onChange={() => setModalMode('custom')} style={{ marginRight: '4px' }} />
                    Request New Custom Medium
                  </label>
                </div>

                {modalMode === 'existing' ? (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Select Master Medium *</label>
                      <select className="form-input" value={form.master_medium_id} onChange={e => setForm({...form, master_medium_id: e.target.value})} required>
                        {masterMediums.map(m => (
                          <option key={m.master_medium_id} value={m.master_medium_id}>{m.medium_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Custom Display Name (Optional)</label>
                      <input type="text" className="form-input" placeholder="e.g. English (Oxford Curriculum)" value={form.custom_medium_name} onChange={e => setForm({...form, custom_medium_name: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Medium Name *</label>
                      <input type="text" className="form-input" placeholder="e.g. French Medium" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Description / Purpose</label>
                      <textarea className="form-input" placeholder="Justify the need for this custom instruction medium..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ minHeight: '60px', padding: '10px' }} />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediumsTab;
