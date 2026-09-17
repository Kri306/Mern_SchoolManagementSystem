import React, { useState, useEffect } from 'react';
import StatCard from '../../components/StatCard';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function DashboardTab({ token, handleLogout, onNavigate }) {
  const [schools, setSchools] = useState([]);
  const [counts, setCounts] = useState({ schools: 0, branches: 0, admins: 0, staff: 0, students: 0, parents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolsRes = await apiFetch('/schools', token, handleLogout);
        if (schoolsRes.success) {
          setSchools(schoolsRes.data || []);
        }
        const countsRes = await apiFetch('/master/dashboard-counts', token, handleLogout);
        if (countsRes.success) {
          setCounts(countsRes.counts || { schools: 0, branches: 0, admins: 0, staff: 0, students: 0, parents: 0 });
        }
      } catch (err) {
        console.error('Failed to load dashboard summaries', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, handleLogout]);

  return (
    <div>
      <div className="stats-cards-grid">
        <StatCard 
          title="Total Schools" 
          value={loading ? '...' : counts.schools} 
          indicatorText="Schools Registered" 
          Illustration={Icons.SchoolIllustration} 
        />
        <StatCard 
          title="Total Branches" 
          value={loading ? '...' : counts.branches} 
          indicatorText="Campuses Active" 
          Illustration={Icons.SchoolIllustration} 
        />
        <StatCard 
          title="School Admins" 
          value={loading ? '...' : counts.admins} 
          indicatorText="Administrators" 
          Illustration={Icons.AdminIllustration} 
        />
        <StatCard 
          title="Total Staff" 
          value={loading ? '...' : counts.staff} 
          indicatorText="Across all campuses" 
          Illustration={Icons.StudentsIllustration} 
        />
        <StatCard 
          title="Total Students" 
          value={loading ? '...' : counts.students} 
          indicatorText="Enrolled active" 
          Illustration={Icons.NewStudentsIllustration} 
        />
        <StatCard 
          title="Total Parents" 
          value={loading ? '...' : counts.parents} 
          indicatorText="Registered parent accounts" 
          Illustration={Icons.CollectionIllustration} 
        />
      </div>

      <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Left Column: Recent Registrations */}
        <div className="panel-card">
          <div className="panel-card-header">
            <h2 className="panel-card-title">Recent Academic Registrations</h2>
            <button className="btn btn-secondary" onClick={() => onNavigate('schools')}>Manage List</button>
          </div>
          
          <div className="table-responsive" style={{ marginTop: '12px' }}>
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
                        <div className="avatar-round-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {school.logo ? <img src={school.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : school.name.charAt(0)}
                        </div>
                        <div>
                          <div className="school-name-text" style={{ fontWeight: '600' }}>{school.name}</div>
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
                {schools.length === 0 && !loading && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No schools created. Set up your first institution!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Workflow */}
        <div className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '20px' }}>School Onboarding Setup Workflow</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="setup-guide-item" style={{ display: 'flex', gap: '12px' }}>
              <div className="setup-guide-num" style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Create School Profile</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>Add basic billing, website links, codes, and location rules.</p>
              </div>
            </div>
            <div className="setup-guide-item" style={{ display: 'flex', gap: '12px' }}>
              <div className="setup-guide-num" style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Register Administrator</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>Create linked credentials that grants access to the school admins.</p>
              </div>
            </div>
            <div className="setup-guide-item" style={{ display: 'flex', gap: '12px' }}>
              <div className="setup-guide-num" style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '13.5px', marginBottom: '3px' }}>Initialize Branch Panels</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', lineHeight: '1.4' }}>School Admins then configure schedules, branches, and register staff.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
