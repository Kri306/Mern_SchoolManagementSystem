import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ReportsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [studentsByClass, setStudentsByClass] = useState([]);
  const [staffByDept, setStaffByDept] = useState([]);
  const [branchSummary, setBranchSummary] = useState([]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const classRes = await apiFetch('/reports/student-distribution', token, handleLogout);
      if (classRes.success) setStudentsByClass(classRes.data || []);

      const deptRes = await apiFetch('/reports/staff-distribution', token, handleLogout);
      if (deptRes.success) setStaffByDept(deptRes.data || []);

      const branchRes = await apiFetch('/reports/branch-summary', token, handleLogout);
      if (branchRes.success) setBranchSummary(branchRes.data || []);
    } catch (err) {
      console.error('Failed to load reports data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReports();
    }
  }, [token]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading analytical reports...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Branch Summaries */}
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '14px' }}>Branch campus Activity Summary</h2>
        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Branch Campus</th>
                <th>Branch Code</th>
                <th>Staff Count</th>
                <th>Enrolled Students</th>
              </tr>
            </thead>
            <tbody>
              {branchSummary.map(b => (
                <tr key={b.branch_id}>
                  <td style={{ fontWeight: '600' }}>{b.branch_name}</td>
                  <td><span className="school-code-text">{b.branch_code}</span></td>
                  <td><strong>{b.staff_count}</strong> staff members</td>
                  <td><strong>{b.student_count}</strong> students</td>
                </tr>
              ))}
              {branchSummary.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No branch data summarized.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Student Class distribution chart/progress lines */}
        <div className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Students distribution by Class Level</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {studentsByClass.map((c, i) => {
              const maxCount = Math.max(...studentsByClass.map(x => x.student_count), 1);
              const percentage = (c.student_count / maxCount) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>{c.class_name}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{c.student_count} Students</span>
                  </div>
                  <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--primary)', width: `${percentage}%`, height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
            {studentsByClass.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>No student distributions recorded.</div>
            )}
          </div>
        </div>

        {/* Staff Department distribution */}
        <div className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Staff distribution by Department</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {staffByDept.map((d, i) => {
              const maxCount = Math.max(...staffByDept.map(x => x.staff_count), 1);
              const percentage = (d.staff_count / maxCount) * 100;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>{d.department_name}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{d.staff_count} Staff</span>
                  </div>
                  <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#0ea5e9', width: `${percentage}%`, height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
            {staffByDept.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>No staff assignments.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default ReportsTab;
