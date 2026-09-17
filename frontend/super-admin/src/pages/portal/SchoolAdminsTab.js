import React, { useState, useEffect, useCallback } from 'react';
import * as Icons from '../../components/Icons';
import AdminModal from '../../components/AdminModal';
import { apiFetch } from '../../utils/api';

function SchoolAdminsTab({ token, handleLogout, user, searchTerm }) {
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Form state
  const [adminForm, setAdminForm] = useState({
    school_id: '',
    name: '',
    email: '',
    phone_number: '',
    password: ''
  });
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/schools/admins', token, handleLogout);
      if (res.success) {
        setAdmins(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load administrators', err);
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  const fetchSchools = useCallback(async () => {
    try {
      const res = await apiFetch('/schools', token, handleLogout);
      if (res.success) {
        setSchools(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load schools for dropdown', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchAdmins();
      fetchSchools();
    }
  }, [token, fetchAdmins, fetchSchools]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsSubmittingModal(true);

    const { school_id, name, email, password } = adminForm;
    if (!school_id || !name || !email || !password) {
      setModalError('All fields marked as required are required.');
      setIsSubmittingModal(false);
      return;
    }

    try {
      const payload = {
        ...adminForm,
        school_id: parseInt(school_id, 10),
        created_by: user?.id || null
      };

      const res = await apiFetch('/schools/admins', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setModalSuccess('School Admin account created!');
        setAdminForm({
          school_id: '',
          name: '',
          email: '',
          phone_number: '',
          password: ''
        });
        fetchAdmins();
        setTimeout(() => {
          setShowAdminModal(false);
          setModalSuccess('');
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to create school admin');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleApproveAdmin = async (adminId, targetStatus) => {
    try {
      const res = await apiFetch(`/schools/admins/${adminId}/approve`, token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify({ status: targetStatus })
      });

      if (res.success) {
        fetchAdmins();
      }
    } catch (err) {
      alert(err.message || 'Failed to update administrator status');
    }
  };

  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.school_name && a.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && admins.length === 0) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading administrators...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">School Administrators ({filteredAdmins.length})</h2>
        <div>
          <button className="btn btn-primary" onClick={() => setShowAdminModal(true)}>
            <Icons.Plus /> Add Administrator
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Account Details</th>
              <th>Phone</th>
              <th>Linked School</th>
              <th>Account Status</th>
              <th>Reg. Status</th>
              <th>Registration Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(admin => (
              <tr key={admin.id}>
                <td>
                  <div className="avatar-cell">
                    <div className="avatar-round-icon admin-role" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{admin.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td>{admin.phone_number || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{admin.school_name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>School ID: {admin.school_id}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${admin.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {admin.status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-badge-${(admin.registration_status || 'Pending').toLowerCase()}`}>
                    {admin.registration_status || 'Pending'}
                  </span>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {admin.registration_status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="btn"
                        style={{ padding: '4px 8px', fontSize: '11px', background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }}
                        onClick={() => handleApproveAdmin(admin.id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn"
                        style={{ padding: '4px 8px', fontSize: '11px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }}
                        onClick={() => handleApproveAdmin(admin.id, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No administrator accounts configured.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdminModal && (
        <AdminModal 
          onClose={() => { setShowAdminModal(false); setModalError(''); }}
          onSubmit={handleAddAdmin}
          formState={adminForm}
          setFormState={setAdminForm}
          schools={schools}
          error={modalError}
          success={modalSuccess}
          isSubmitting={isSubmittingModal}
        />
      )}
    </div>
  );
}

export default SchoolAdminsTab;
