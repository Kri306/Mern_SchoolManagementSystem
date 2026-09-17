import React, { useState, useEffect, useCallback } from 'react';
import * as Icons from '../../components/Icons';
import SchoolModal from '../../components/SchoolModal';
import { apiFetch } from '../../utils/api';

function SchoolsTab({ token, handleLogout, user, searchTerm }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  // Form state
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    school_code: '',
    address: '',
    contact_number: '',
    email_id: '',
    logo: '',
    website_link: '',
    working_hours: '',
    bank_details: '',
    telegram_channel_id: ''
  });
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/schools', token, handleLogout);
      if (res.success) {
        setSchools(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load schools', err);
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchSchools();
    }
  }, [token, fetchSchools]);

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsSubmittingModal(true);

    if (!schoolForm.name || !schoolForm.school_code) {
      setModalError('School Name and School Code are required.');
      setIsSubmittingModal(false);
      return;
    }

    try {
      const payload = {
        ...schoolForm,
        created_by: user?.id || null
      };

      const res = await apiFetch('/schools', token, handleLogout, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        setModalSuccess('School registered successfully!');
        setSchoolForm({
          name: '',
          school_code: '',
          address: '',
          contact_number: '',
          email_id: '',
          logo: '',
          website_link: '',
          working_hours: '',
          bank_details: '',
          telegram_channel_id: ''
        });
        fetchSchools();
        setTimeout(() => {
          setShowSchoolModal(false);
          setModalSuccess('');
        }, 1200);
      }
    } catch (err) {
      setModalError(err.message || 'Failed to create school');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email_id && s.email_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && schools.length === 0) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading schools database...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Schools Database ({filteredSchools.length})</h2>
        <div>
          <button className="btn btn-primary" onClick={() => setShowSchoolModal(true)}>
            <Icons.Plus /> Register School
          </button>
        </div>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>School Profile</th>
              <th>School Code</th>
              <th>Contact Details</th>
              <th>Location Address</th>
              <th>Bank Config</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map(school => (
              <tr key={school.id}>
                <td>
                  <div className="avatar-cell">
                    <div className="avatar-round-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {school.logo ? <img src={school.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : school.name.charAt(0)}
                    </div>
                    <div>
                      <div className="school-name-text" style={{ fontWeight: '600' }}>{school.name}</div>
                      {school.website_link && (
                        <a href={school.website_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', marginTop: '2px' }}>
                          <Icons.Globe /> Visit Link
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td><span className="school-code-text">{school.school_code}</span></td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12.5px' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{school.email_id || 'N/A'}</span>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.Phone /> {school.contact_number || 'N/A'}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12.5px', display: 'flex', alignItems: 'flex-start', gap: '4px', maxWidth: '200px' }}>
                    <Icons.MapPin />
                    <span>{school.address || 'N/A'}</span>
                  </div>
                </td>
                <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {school.bank_details || 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${school.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {school.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSchools.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No academic profiles registered in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showSchoolModal && (
        <SchoolModal 
          onClose={() => { setShowSchoolModal(false); setModalError(''); }} 
          onSubmit={handleAddSchool}
          formState={schoolForm}
          setFormState={setSchoolForm}
          error={modalError}
          success={modalSuccess}
          isSubmitting={isSubmittingModal}
        />
      )}
    </div>
  );
}

export default SchoolsTab;
