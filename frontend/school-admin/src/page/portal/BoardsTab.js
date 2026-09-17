import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function BoardsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [schoolBoards, setSchoolBoards] = useState([]);
  const [masterBoards, setMasterBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('existing'); // 'existing' or 'custom'
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    master_board_id: '',
    name: '',
    description: '',
    logo: '',
    custom_board_name: '',
    custom_board_logo: '',
    custom_description: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sbRes = await apiFetch('/boards', token, handleLogout);
      if (sbRes.success) setSchoolBoards(sbRes.data || []);

      const mbRes = await apiFetch('/boards/master', token, handleLogout);
      if (mbRes.success) {
        setMasterBoards(mbRes.data || []);
        if (mbRes.data.length > 0) {
          setForm(f => ({ ...f, master_board_id: mbRes.data[0].master_board_id }));
        }
      }
    } catch (err) {
      console.error('Failed to load school board details', err);
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
        ? {
            master_board_id: parseInt(form.master_board_id, 10),
            custom_board_name: form.custom_board_name,
            custom_board_logo: form.custom_board_logo,
            custom_description: form.custom_description
          }
        : {
            name: form.name,
            description: form.description,
            logo: form.logo
          };

      const res = await apiFetch('/boards/request', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setModalSuccess('Board request submitted successfully! Awaiting approval.');
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
      const res = await apiFetch(`/boards/${id}/status`, token, handleLogout, {
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
      master_board_id: masterBoards[0]?.master_board_id || '',
      name: '',
      description: '',
      logo: '',
      custom_board_name: '',
      custom_board_logo: '',
      custom_description: ''
    });
    setModalMode('existing');
    setModalError('');
    setModalSuccess('');
    setShowModal(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading school boards...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Boards ({schoolBoards.length})</h2>
        <button className="btn btn-primary" onClick={openRequestModal}>
          <Icons.Plus /> Request Board Link
        </button>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>School Board ID</th>
              <th>Board Name</th>
              <th>Description / Details</th>
              <th>Request Status</th>
              <th>Status</th>
              <th>Toggle Active</th>
            </tr>
          </thead>
          <tbody>
            {schoolBoards.map(b => (
              <tr key={b.school_board_id}>
                <td><code>{b.school_board_id}</code></td>
                <td>
                  <div style={{ fontWeight: '600' }}>{b.board_name}</div>
                  {b.custom_board_name && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Custom: {b.custom_board_name}</div>}
                </td>
                <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{b.description || 'Global School Board Option'}</td>
                <td>
                  <span className={`status-badge ${b.request_status === 'Approved' ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: b.request_status === 'Approved' ? 'var(--success-bg)' : 'var(--warning-bg)', color: b.request_status === 'Approved' ? 'var(--success-text)' : 'var(--warning-text)' }}>
                    {b.request_status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(b.school_board_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {schoolBoards.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No boards configured.</td>
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
              <h3 className="modal-header-title">Request Board Affiliation</h3>
              <button className="modal-close-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {modalError && <div className="alert alert-error">{modalError}</div>}
                {modalSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{modalSuccess}</div>}

                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', gap: '12px' }}>
                  <label style={{ cursor: 'pointer', fontSize: '13px', fontWeight: modalMode === 'existing' ? '700' : '400', color: modalMode === 'existing' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    <input type="radio" name="boardMode" checked={modalMode === 'existing'} onChange={() => setModalMode('existing')} style={{ marginRight: '4px' }} />
                    Link Master Board
                  </label>
                  <label style={{ cursor: 'pointer', fontSize: '13px', fontWeight: modalMode === 'custom' ? '700' : '400', color: modalMode === 'custom' ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    <input type="radio" name="boardMode" checked={modalMode === 'custom'} onChange={() => setModalMode('custom')} style={{ marginRight: '4px' }} />
                    Request Custom Board
                  </label>
                </div>

                {modalMode === 'existing' ? (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Select Master Board *</label>
                      <select className="form-input" value={form.master_board_id} onChange={e => setForm({...form, master_board_id: e.target.value})} required>
                        {masterBoards.map(b => (
                          <option key={b.master_board_id} value={b.master_board_id}>{b.board_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Custom Display Name (Optional)</label>
                      <input type="text" className="form-input" placeholder="e.g. CBSE Surat Branch" value={form.custom_board_name} onChange={e => setForm({...form, custom_board_name: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Board Name *</label>
                      <input type="text" className="form-input" placeholder="e.g. State Board Gujarat" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Logo Path or Abbreviation</label>
                      <input type="text" className="form-input" placeholder="e.g. GSEB" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Description / Purpose</label>
                      <textarea className="form-input" placeholder="Enter board details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ minHeight: '60px', padding: '10px' }} />
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

export default BoardsTab;
