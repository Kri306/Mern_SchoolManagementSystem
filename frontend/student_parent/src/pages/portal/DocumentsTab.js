import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function DocumentsTab({ token, user, selectedChildId, handleLogout }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', type: 'Identification', file_url: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/documents?student_id=${selectedChildId}`
        : '/dashboard/documents';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setDocuments(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res?.message || 'Failed to load documents');
      }
    } catch (err) {
      setError(err.message || 'Error loading documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.title) {
      alert('Please enter a document title');
      return;
    }

    setSaving(true);
    try {
      const docItem = {
        id: Date.now(),
        title: newDoc.title,
        type: newDoc.type,
        file_url: newDoc.file_url || '#',
        notes: newDoc.notes,
        uploaded_at: new Date().toISOString().split('T')[0],
        status: 'Verified'
      };

      const updatedList = [...documents, docItem];
      const endpoint = selectedChildId
        ? `/dashboard/documents?student_id=${selectedChildId}`
        : '/dashboard/documents';

      const res = await apiFetch(endpoint, token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({ documents: updatedList })
      });

      if (res && res.success) {
        setDocuments(updatedList);
        setShowAddModal(false);
        setNewDoc({ title: '', type: 'Identification', file_url: '', notes: '' });
      } else {
        alert(res?.message || 'Failed to save document');
      }
    } catch (err) {
      alert(err.message || 'Error saving document');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Are you sure you want to remove this document?')) return;
    try {
      const updatedList = documents.filter(d => d.id !== id);
      const endpoint = selectedChildId
        ? `/dashboard/documents?student_id=${selectedChildId}`
        : '/dashboard/documents';

      const res = await apiFetch(endpoint, token, handleLogout, {
        method: 'POST',
        body: JSON.stringify({ documents: updatedList })
      });

      if (res && res.success) {
        setDocuments(updatedList);
      }
    } catch (err) {
      alert(err.message || 'Error deleting document');
    }
  };

  if (loading) {
    return (
      <div className="tab-content-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="tab-content-container">

      {/* Header and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>📁 Student Document Vault</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Official enrollment certificates, birth records, and academic documents on file
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddModal(true)}
          style={{ fontSize: '13px' }}
        >
          + Upload Document
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Documents Grid / List */}
      <div className="table-container" style={{ padding: '24px' }}>
        {documents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {documents.map((doc) => (
              <div 
                key={doc.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ fontSize: '28px' }}>📄</div>
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      {doc.status || 'Verified'}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700' }}>
                    {doc.title}
                  </h4>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Type: <strong>{doc.type || 'General Document'}</strong>
                  </div>

                  {doc.notes && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                      {doc.notes}
                    </p>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Added: {doc.uploaded_at || 'Recent'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {doc.file_url && doc.file_url !== '#' ? (
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        View
                      </a>
                    ) : (
                      <span className="badge badge-primary" style={{ fontSize: '11px', padding: '3px 8px' }}>Archived</span>
                    )}
                    <button 
                      onClick={() => handleDeleteDoc(doc.id)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                      title="Remove document"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '42px', marginBottom: '10px' }}>📁</div>
            <h4 style={{ margin: '0 0 6px' }}>No Documents Uploaded Yet</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '400px', margin: '0 auto 16px' }}>
              Upload copies of birth certificate, previous school marksheet, photo ID, or vaccination records.
            </p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              + Add First Document
            </button>
          </div>
        )}
      </div>

      {/* Upload / Add Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Add Student Document</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument}>
              <div className="input-group">
                <label className="input-label">Document Title *</label>
                <input 
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Birth Certificate, Grade 8 Report Card"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Document Type</label>
                <select 
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                >
                  <option value="Identification">Identification (Aadhar / Birth Cert)</option>
                  <option value="Academic">Academic Marksheet / Transcript</option>
                  <option value="Transfer">Transfer Certificate (TC)</option>
                  <option value="Medical">Medical / Vaccination Record</option>
                  <option value="Other">Other Certificate</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Document Link or URL (Optional)</label>
                <input 
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="https://... or leave blank"
                  value={newDoc.file_url}
                  onChange={(e) => setNewDoc({ ...newDoc, file_url: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Notes / Remarks</label>
                <input 
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="Verified by registrar office..."
                  value={newDoc.notes}
                  onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DocumentsTab;
