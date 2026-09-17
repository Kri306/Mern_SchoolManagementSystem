import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function DashboardTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({ counts: {}, batches: [], students: [] });
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/summary', token, handleLogout);
        if (res.success) {
          setSummaryData(res.data);
        }
        const historyRes = await apiFetch('/auth/login-history', token, handleLogout);
        if (historyRes.success) {
          setLoginHistory(historyRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, handleLogout]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading dashboard details...</div>;
  }

  return (
    <div>
      <div className="stats-cards-grid">
        <StatCard title="My Batches" value={summaryData.counts.batches || 0} indicatorText="Assigned classes" Illustration={Icons.CollectionIllustration} />
        <StatCard title="My Students" value={summaryData.counts.students || 0} indicatorText="Under my batches" Illustration={Icons.StudentsIllustration} />
        <StatCard title="Current Session" value={summaryData.counts.session || 'N/A'} indicatorText="Academic year" Illustration={Icons.NewStudentsIllustration} />
        <StatCard title="School Branch" value={summaryData.counts.branch || 'N/A'} indicatorText="Assigned location" Illustration={Icons.CollectionIllustration} />
      </div>

      <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Left Column: My Batches List */}
        <div className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '14px' }}>My Assigned Batches</h2>
          <div className="table-responsive">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Batch Code</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.batches && summaryData.batches.length > 0 ? (
                  summaryData.batches.map(b => (
                    <tr key={b.batch_id}>
                      <td><span className="school-code-text">{b.batch_code}</span></td>
                      <td>{b.class_name}</td>
                      <td>{b.section_name}</td>
                      <td>
                        <span className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No assigned batches.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: My Students List */}
        <div className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '14px' }}>My Students Summary</h2>
          <div className="table-responsive">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Admission No</th>
                  <th>Batch</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.students && summaryData.students.length > 0 ? (
                  summaryData.students.map(s => (
                    <tr key={s.id}>
                      <td><code>{s.id}</code></td>
                      <td style={{ fontWeight: '600' }}>{s.name}</td>
                      <td><span className="school-code-text">{s.admission_number}</span></td>
                      <td>{s.batch_code}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No students registered under your batches.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div className="panel-card" style={{ marginTop: '24px' }}>
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Your Login History & Audit Trails</h2>
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
          <table className="clean-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>User Agent</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.login_time)}</td>
                  <td><code>{log.ip_address || '127.0.0.1'}</code></td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.user_agent}>
                    {log.user_agent || 'Mozilla/5.0'}
                  </td>
                  <td>
                    <span className={`status-badge ${log.status === 'Success' ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ color: log.status === 'Failed' ? '#f43f5e' : 'var(--text-secondary)' }}>
                    {log.failure_reason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
