import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatCard from '../components/StatCard';
import SchoolModal from '../components/SchoolModal';
import AdminModal from '../components/AdminModal';
import * as Icons from '../components/Icons';

const API_BASE_URL = 'http://localhost:5001/api/super-admin';

function Dashboard({ token, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'schools', 'admins'
  
  // App Data states
  const [schools, setSchools] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // School form state
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

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    school_id: '',
    name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  useEffect(() => {
    fetchSchools();
    fetchAdmins();
  }, []);

  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401 || response.status === 403) {
        onLogout();
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  };

  const fetchSchools = async () => {
    setIsLoadingData(true);
    try {
      const res = await apiFetch('/schools');
      if (res.success) {
        setSchools(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load schools', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchAdmins = async () => {
    setIsLoadingData(true);
    try {
      const res = await apiFetch('/schools/admins');
      if (res.success) {
        setAdmins(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load school admins', err);
    } finally {
      setIsLoadingData(false);
    }
  };

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

      const res = await apiFetch('/schools', {
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

      const res = await apiFetch('/schools/admins', {
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
      const res = await apiFetch(`/schools/admins/${adminId}/approve`, {
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

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email_id && s.email_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.school_name && a.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={onLogout} 
      />

      {/* Main Content Area */}
      <main className="main-content">
        <TopNavbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onLogout={onLogout} 
        />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-cards-grid">
              <StatCard 
                title="Total Schools" 
                value={schools.length} 
                indicatorText="12% Increase" 
                Illustration={Icons.StudentsIllustration} 
              />
              <StatCard 
                title="Total Admins" 
                value={admins.length} 
                indicatorText="09% Increase" 
                Illustration={Icons.NewStudentsIllustration} 
              />
              <StatCard 
                title="Active Schools" 
                value={schools.filter(s => s.status === 'Active').length} 
                indicatorText="100% Active" 
                Illustration={Icons.CollectionIllustration} 
              />
              {/* <StatCard 
                title="Inactive / Pending" 
                value={schools.filter(s => s.status !== 'Active').length} 
                indicatorText="0 Pending" 
                isNeutral={true}
                Illustration={Icons.PendingIllustration} 
              /> */}
            </div>

            <div className="details-grid">
              <div className="panel-card">
                <div className="panel-card-header">
                  <h2 className="panel-card-title">Recent Academic Registrations</h2>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('schools')}>Manage List</button>
                </div>
                
                <div className="table-responsive">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>School Name</th>
                        <th>Code</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.slice(0, 5).map(school => (
                        <tr key={school.id}>
                          <td>
                            <div className="avatar-cell">
                              <div className="avatar-round-icon">
                                {school.logo ? <img src={school.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : school.name.charAt(0)}
                              </div>
                              <div>
                                <div className="school-name-text">{school.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{school.email_id || 'No email registered'}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="school-code-text">{school.school_code}</span></td>
                          <td>
                            <span className={`status-badge ${school.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                              {school.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {schools.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No schools created. Set up your first institution!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel-card">
                <h2 className="panel-card-title" style={{ marginBottom: '20px' }}>School Setup Workflow</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="setup-guide-item">
                    <div className="setup-guide-num">1</div>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Create School Profile</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>Add basic billing, website links, codes, and location rules.</p>
                    </div>
                  </div>
                  <div className="setup-guide-item">
                    <div className="setup-guide-num">2</div>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Register Administrator</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>Create linked credentials that grants access to the school admins.</p>
                    </div>
                  </div>
                  <div className="setup-guide-item">
                    <div className="setup-guide-num">3</div>
                    <div>
                      <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Initialize Branch Panels</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>School Admins then configure schedules, branches, and register staff.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Schools List */}
        {activeTab === 'schools' && (
          <div className="panel-card">
            <div className="panel-card-header">
              <h2 className="panel-card-title">Schools Database ({filteredSchools.length})</h2>
              <div>
                <button className="btn btn-primary" onClick={() => setShowSchoolModal(true)}>
                  <Icons.Plus /> Register School
                </button>
              </div>
            </div>

            {isLoadingData ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <svg className="spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
              </div>
            ) : (
              <div className="table-responsive">
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
                            <div className="avatar-round-icon">
                              {school.logo ? <img src={school.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : school.name.charAt(0)}
                            </div>
                            <div>
                              <div className="school-name-text">{school.name}</div>
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
            )}
          </div>
        )}

        {/* Tab 3: Admins List */}
        {activeTab === 'admins' && (
          <div className="panel-card">
            <div className="panel-card-header">
              <h2 className="panel-card-title">School Administrators ({filteredAdmins.length})</h2>
              <div>
                <button className="btn btn-primary" onClick={() => setShowAdminModal(true)}>
                  <Icons.Plus /> Add Administrator
                </button>
              </div>
            </div>

            {isLoadingData ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <svg className="spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Account details</th>
                      <th>Phone</th>
                      <th>Linked School ID/Name</th>
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
                            <div className="avatar-round-icon admin-role">
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
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>School Index: {admin.school_id}</span>
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
            )}
          </div>
        )}
      </main>

      {/* Modal 1: Register School */}
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

      {/* Modal 2: Create Admin */}
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

export default Dashboard;
