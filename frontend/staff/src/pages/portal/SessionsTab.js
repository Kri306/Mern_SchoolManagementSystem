import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function SessionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = useState({ years: [], sessions: [] });

  useEffect(() => {
    const fetchAcademicYears = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/academic-years', token, handleLogout);
        if (res.success) {
          setAcademicYears(res.data);
        }
      } catch (err) {
        console.error('Failed to load academic years', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAcademicYears();
    }
  }, [token, handleLogout]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading sessions...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Academic Years Registered</h2>
        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Academic Year Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.years.map(y => (
                <tr key={y.academic_year_id}>
                  <td style={{ fontWeight: '600' }}>{y.academic_year_name}</td>
                  <td>{new Date(y.start_date).toLocaleDateString()}</td>
                  <td>{new Date(y.end_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${y.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {y.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Academic Sessions Detail</h2>
        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Session Name</th>
                <th>Academic Year</th>
                <th>Session Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Current Active Session</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.sessions.map(s => (
                <tr key={s.session_id}>
                  <td style={{ fontWeight: '600' }}>{s.session_name}</td>
                  <td>{s.academic_year_name}</td>
                  <td><code>{s.session_number}</code></td>
                  <td>{s.start_date ? new Date(s.start_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{s.end_date ? new Date(s.end_date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${s.is_current ? 'status-badge-active' : 'status-badge-inactive'}`} style={{ backgroundColor: s.is_current ? 'var(--success-bg)' : '#f1f5f9', color: s.is_current ? 'var(--success-text)' : 'var(--text-secondary)' }}>
                      {s.is_current ? 'Current Session' : 'Prior Session'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {academicYears.sessions.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No academic year sessions mapped.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SessionsTab;
