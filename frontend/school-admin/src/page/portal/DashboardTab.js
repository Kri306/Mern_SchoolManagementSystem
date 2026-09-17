import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function DashboardTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalBranches: 0,
    totalClasses: 0,
    currentAcademicYear: 'Not Configured',
    activeBatches: 0
  });
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const metricsRes = await apiFetch('/dashboard/metrics', token, handleLogout);
        if (metricsRes.success) {
          setMetrics(metricsRes.data);
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
        <StatCard title="Total Students" value={metrics.totalStudents} indicatorText="Enrolled active students" Illustration={Icons.StudentsIllustration} />
        <StatCard title="Total Staff" value={metrics.totalStaff} indicatorText="Teachers and administrators" Illustration={Icons.NewStudentsIllustration} />
        <StatCard title="Total Branches" value={metrics.totalBranches} indicatorText="Operating campuses" Illustration={Icons.CollectionIllustration} />
        <StatCard title="Total Classes" value={metrics.totalClasses} indicatorText="Assigned branch levels" Illustration={Icons.CollectionIllustration} />
        <StatCard title="Current Academic Year" value={metrics.currentAcademicYear} indicatorText="Active terms" Illustration={Icons.NewStudentsIllustration} />
        <StatCard title="Active Batches" value={metrics.activeBatches} indicatorText="Ongoing study cohorts" Illustration={Icons.CollectionIllustration} />
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
              {loginHistory.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                    No audit logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
