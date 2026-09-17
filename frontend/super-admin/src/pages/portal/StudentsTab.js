import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function StudentsTab({ token, handleLogout, searchTerm }) {
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await apiFetch('/master/students', token, handleLogout);
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load students list', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token, fetchStudents]);

  const toggleStatus = async (studentId) => {
    try {
      const res = await apiFetch(`/master/students/${studentId}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        fetchStudents();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle student status');
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.student_unique_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.school_name && s.school_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">Students Registry ({filtered.length})</h2>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>ID & Name</th>
              <th>Admission Number</th>
              <th>Institution & Batch</th>
              <th>Student Contact</th>
              <th>Parent Details</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.student_id}>
                <td>
                  <div><strong>{s.name}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: <code>{s.student_unique_id}</code></div>
                </td>
                <td><span className="school-code-text">{s.admission_number}</span></td>
                <td>
                  <div>{s.school_name || 'Global / Unlinked'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Batch: {s.batch_code || '-'}</div>
                </td>
                <td>{s.email || 'N/A'}</td>
                <td>
                  <div>{s.parent_name || 'N/A'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.parent_phone || '-'}</div>
                </td>
                <td>
                  <span className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary" onClick={() => toggleStatus(s.student_id)} style={{ padding: '4px 8px', fontSize: '11px' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No student records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsTab;
