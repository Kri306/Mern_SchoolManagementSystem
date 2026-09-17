import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function SessionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Year Modal
  const [showYearModal, setShowYearModal] = useState(false);
  const [yearModalMode, setYearModalMode] = useState('add');
  const [yearForm, setYearForm] = useState({
    academic_year_name: '',
    semester: '',
    start_date: '',
    end_date: '',
    branch_id: '',
    status: 'Active'
  });
  const [yearError, setYearError] = useState('');
  const [yearSuccess, setYearSuccess] = useState('');

  // Session Modal
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState('add');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    session_name: '',
    session_number: '',
    start_date: '',
    end_date: '',
    status: 'Active'
  });
  const [sessionError, setSessionError] = useState('');
  const [sessionSuccess, setSessionSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchYearsAndBranches = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/academic-years', token, handleLogout);
      if (res.success) {
        setAcademicYears(res.data || []);
      }
      const brRes = await apiFetch('/branches', token, handleLogout);
      if (brRes.success) {
        setBranches(brRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load years/branches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchYearsAndBranches();
    }
  }, [token]);

  const loadSessions = async (yearId) => {
    setLoadingSessions(true);
    setSelectedYearId(yearId);
    try {
      const res = await apiFetch(`/academic-years/${yearId}/sessions`, token, handleLogout);
      if (res.success) {
        setSessions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleYearSubmit = async (e) => {
    e.preventDefault();
    setYearError('');
    setYearSuccess('');
    setIsSubmitting(true);

    if (!yearForm.academic_year_name) {
      setYearError('Academic Year Name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      if (yearModalMode === 'add') {
        res = await apiFetch('/academic-years', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(yearForm)
        });
      } else {
        res = await apiFetch(`/academic-years/${selectedYearId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(yearForm)
        });
      }

      if (res.success) {
        setYearSuccess(`Academic Year ${yearModalMode === 'add' ? 'created' : 'updated'} successfully!`);
        fetchYearsAndBranches();
        setTimeout(() => {
          setShowYearModal(false);
        }, 1200);
      }
    } catch (err) {
      setYearError(err.message || 'Failed to save academic year.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setSessionError('');
    setSessionSuccess('');
    setIsSubmitting(true);

    if (!sessionForm.session_name) {
      setSessionError('Session Name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let res;
      if (sessionModalMode === 'add') {
        res = await apiFetch(`/academic-years/${selectedYearId}/sessions`, token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(sessionForm)
        });
      } else {
        res = await apiFetch(`/academic-years/${selectedYearId}/sessions/${selectedSessionId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(sessionForm)
        });
      }

      if (res.success) {
        setSessionSuccess(`Session ${sessionModalMode === 'add' ? 'created' : 'updated'} successfully!`);
        loadSessions(selectedYearId);
        setTimeout(() => {
          setShowSessionModal(false);
        }, 1200);
      }
    } catch (err) {
      setSessionError(err.message || 'Failed to save session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetCurrentYear = async (yearId) => {
    try {
      const res = await apiFetch(`/academic-years/${yearId}/current`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchYearsAndBranches();
      }
    } catch (err) {
      alert(err.message || 'Failed to set current academic year.');
    }
  };

  const handleSetCurrentSession = async (sessionId) => {
    try {
      const res = await apiFetch(`/academic-years/${selectedYearId}/sessions/${sessionId}/current`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadSessions(selectedYearId);
      }
    } catch (err) {
      alert(err.message || 'Failed to set current session.');
    }
  };

  const openAddYear = () => {
    setYearForm({
      academic_year_name: '',
      semester: '',
      start_date: '',
      end_date: '',
      branch_id: branches[0]?.id || '',
      status: 'Active'
    });
    setYearModalMode('add');
    setYearError('');
    setYearSuccess('');
    setShowYearModal(true);
  };

  const openEditYear = (y) => {
    setYearForm({
      academic_year_name: y.academic_year_name || '',
      semester: y.semester || '',
      start_date: y.start_date ? y.start_date.substring(0, 10) : '',
      end_date: y.end_date ? y.end_date.substring(0, 10) : '',
      branch_id: y.branch_id || '',
      status: y.status || 'Active'
    });
    setSelectedYearId(y.academic_year_id);
    setYearModalMode('edit');
    setYearError('');
    setYearSuccess('');
    setShowYearModal(true);
  };

  const openAddSession = () => {
    setSessionForm({
      session_name: '',
      session_number: '',
      start_date: '',
      end_date: '',
      status: 'Active'
    });
    setSessionModalMode('add');
    setSessionError('');
    setSessionSuccess('');
    setShowSessionModal(true);
  };

  const openEditSession = (s) => {
    setSessionForm({
      session_name: s.session_name || '',
      session_number: s.session_number || '',
      start_date: s.start_date ? s.start_date.substring(0, 10) : '',
      end_date: s.end_date ? s.end_date.substring(0, 10) : '',
      status: s.status || 'Active'
    });
    setSelectedSessionId(s.session_id);
    setSessionModalMode('edit');
    setSessionError('');
    setSessionSuccess('');
    setShowSessionModal(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading calendar terms...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Left Panel: Academic Years */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h2 className="panel-card-title">Academic Years ({academicYears.length})</h2>
          <button className="btn btn-primary" onClick={openAddYear}>
            <Icons.Plus /> Add Year
          </button>
        </div>

        <div className="table-responsive" style={{ marginTop: '16px' }}>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Academic Year</th>
                <th>Dates</th>
                <th>Current</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.map(y => (
                <tr 
                  key={y.academic_year_id} 
                  style={{ cursor: 'pointer', background: selectedYearId === y.academic_year_id ? '#f8fafc' : 'none' }}
                  onClick={() => loadSessions(y.academic_year_id)}
                >
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{y.academic_year_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Semester: {y.semester || 'N/A'}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {y.start_date ? y.start_date.substring(0, 10) : 'N/A'} to {y.end_date ? y.end_date.substring(0, 10) : 'N/A'}
                  </td>
                  <td>
                    <span 
                      className={`status-badge ${y.is_current ? 'status-badge-active' : 'status-badge-inactive'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCurrentYear(y.academic_year_id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {y.is_current ? 'Current' : 'Set Active'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditYear(y);
                      }}
                      style={{ padding: '4px 8px', fontSize: '11.5px' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {academicYears.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No academic years defined.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel: Sessions */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h2 className="panel-card-title">Sessions & Terms</h2>
          {selectedYearId && (
            <button className="btn btn-primary" onClick={openAddSession}>
              <Icons.Plus /> Add Session
            </button>
          )}
        </div>

        {!selectedYearId ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Select an Academic Year from the left panel to load session terms.
          </div>
        ) : loadingSessions ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <svg className="spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
          </div>
        ) : (
          <div className="table-responsive" style={{ marginTop: '16px' }}>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Session Term</th>
                  <th>Dates</th>
                  <th>Current</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.session_id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{s.session_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Number: {s.session_number || 'N/A'}</div>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {s.start_date ? s.start_date.substring(0, 10) : 'N/A'} to {s.end_date ? s.end_date.substring(0, 10) : 'N/A'}
                    </td>
                    <td>
                      <span 
                        className={`status-badge ${s.is_current ? 'status-badge-active' : 'status-badge-inactive'}`}
                        onClick={() => handleSetCurrentSession(s.session_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {s.is_current ? 'Current' : 'Set Active'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => openEditSession(s)}
                        style={{ padding: '4px 8px', fontSize: '11.5px' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No session terms added to this year.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Year Modal */}
      {showYearModal && (
        <div className="modal-overlay-panel" onClick={() => setShowYearModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{yearModalMode === 'add' ? 'Add Academic Year' : 'Edit Academic Year'}</h3>
              <button className="modal-close-icon" onClick={() => setShowYearModal(false)}>✕</button>
            </div>
            <form onSubmit={handleYearSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {yearError && <div className="alert alert-error">{yearError}</div>}
                {yearSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{yearSuccess}</div>}
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Academic Year Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. 2026-2027" value={yearForm.academic_year_name} onChange={e => setYearForm({...yearForm, academic_year_name: e.target.value})} required />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Semester / Term Code</label>
                  <input type="text" className="form-input" placeholder="e.g. SEM1" value={yearForm.semester} onChange={e => setYearForm({...yearForm, semester: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Start Date</label>
                    <input type="date" className="form-input" value={yearForm.start_date} onChange={e => setYearForm({...yearForm, start_date: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">End Date</label>
                    <input type="date" className="form-input" value={yearForm.end_date} onChange={e => setYearForm({...yearForm, end_date: e.target.value})} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Select Branch</label>
                  <select 
                    className="form-input" 
                    value={yearForm.branch_id} 
                    onChange={e => setYearForm({...yearForm, branch_id: e.target.value})}
                  >
                    {branches.map(br => (
                      <option key={br.id} value={br.id}>{br.branch_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowYearModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Year'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && (
        <div className="modal-overlay-panel" onClick={() => setShowSessionModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{sessionModalMode === 'add' ? 'Add Session Term' : 'Edit Session Term'}</h3>
              <button className="modal-close-icon" onClick={() => setShowSessionModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSessionSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sessionError && <div className="alert alert-error">{sessionError}</div>}
                {sessionSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{sessionSuccess}</div>}
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Session Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Fall Term" value={sessionForm.session_name} onChange={e => setSessionForm({...sessionForm, session_name: e.target.value})} required />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Session Number</label>
                  <input type="text" className="form-input" placeholder="e.g. Session 1" value={sessionForm.session_number} onChange={e => setSessionForm({...sessionForm, session_number: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Start Date</label>
                    <input type="date" className="form-input" value={sessionForm.start_date} onChange={e => setSessionForm({...sessionForm, start_date: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">End Date</label>
                    <input type="date" className="form-input" value={sessionForm.end_date} onChange={e => setSessionForm({...sessionForm, end_date: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSessionModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionsTab;
