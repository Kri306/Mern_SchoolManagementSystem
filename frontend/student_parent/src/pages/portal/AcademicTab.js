import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function AcademicTab({ token, user, selectedChildId, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAcademics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchAcademics = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/academics?student_id=${selectedChildId}`
        : '/dashboard/academics';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load academic records');
      }
    } catch (err) {
      setError(err.message || 'Error loading academic records');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="tab-content-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-container">
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="btn btn-secondary" onClick={fetchAcademics} style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const years = data?.years || [];
  const sessions = data?.sessions || [];
  const mediums = data?.mediums || [];
  const boards = data?.boards || [];

  return (
    <div className="tab-content-container">

      {/* 📅 Academic Sessions Overview */}
      <div className="table-container" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
            📅 Academic Terms & Sessions
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Scheduled school sessions, exam terms, and vacation intervals for the academic year
          </p>
        </div>

        {sessions.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {sessions.map((sess) => (
              <div 
                key={sess.session_id}
                style={{
                  background: sess.is_current ? '#eff6ff' : '#ffffff',
                  border: sess.is_current ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative'
                }}
              >
                {sess.is_current === 1 && (
                  <span 
                    className="badge badge-primary" 
                    style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      right: '16px',
                      fontSize: '11px',
                      background: '#3b82f6'
                    }}
                  >
                    Active Session
                  </span>
                )}

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {sess.academic_year_name || 'Academic Term'}
                </div>

                <h4 style={{ margin: '4px 0 12px', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {sess.session_name}
                </h4>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>📅 <strong>Start Date:</strong> {formatDate(sess.start_date)}</div>
                  <div>🏁 <strong>End Date:</strong> {formatDate(sess.end_date)}</div>
                  <div>🏷️ <strong>Session No:</strong> {sess.session_number || '1'}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No sessions listed for this academic year.
          </div>
        )}
      </div>

      {/* 📚 Academic Years History */}
      <div className="table-container" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px 0' }}>
          🎓 Academic Years
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Academic Year</th>
                <th style={{ padding: '12px 16px' }}>Semester / Cycle</th>
                <th style={{ padding: '12px 16px' }}>Start Date</th>
                <th style={{ padding: '12px 16px' }}>End Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {years.map((ay) => (
                <tr key={ay.academic_year_id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                    {ay.academic_year_name}
                    {ay.is_current === 1 && (
                      <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '11px' }}>Current</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{ay.semester || 'Annual'}</td>
                  <td style={{ padding: '12px 16px' }}>{formatDate(ay.start_date)}</td>
                  <td style={{ padding: '12px 16px' }}>{formatDate(ay.end_date)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-primary">{ay.status || 'Active'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🏷️ Mediums & Boards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="table-container" style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700' }}>🗣️ Instruction Mediums</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {mediums.length > 0 ? (
              mediums.map(m => (
                <div key={m.school_medium_id} style={{ background: '#f1f5f9', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                  {m.medium_name}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>English Medium, Gujarati Medium</span>
            )}
          </div>
        </div>

        <div className="table-container" style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700' }}>📜 Affiliated Boards</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {boards.length > 0 ? (
              boards.map(b => (
                <div key={b.school_board_id} style={{ background: '#f1f5f9', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                  {b.board_name}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gujarat Secondary and Higher Secondary Education Board (GSEB)</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default AcademicTab;
