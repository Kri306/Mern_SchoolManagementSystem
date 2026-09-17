import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ClassesSectionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [classesSections, setClassesSections] = useState({ classes: [], sections: [] });

  useEffect(() => {
    const fetchClassesAndSections = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/classes-sections', token, handleLogout);
        if (res.success) {
          setClassesSections(res.data);
        }
      } catch (err) {
        console.error('Failed to load classes and sections', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchClassesAndSections();
    }
  }, [token, handleLogout]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading classes and sections...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>Classes Configuration</h2>
        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Location / Block</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classesSections.classes.map(c => (
                <tr key={c.school_class_id}>
                  <td style={{ fontWeight: '600' }}>{c.class_name}</td>
                  <td>{c.location || 'Main Academic Building'}</td>
                  <td>{c.student_capacity} Students</td>
                  <td>
                    <span className={`status-badge ${c.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {c.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-card">
        <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>School Sections</h2>
        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Section Name</th>
                <th>Room Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classesSections.sections.map(sec => (
                <tr key={sec.section_id}>
                  <td style={{ fontWeight: '600' }}>{sec.section_name}</td>
                  <td><code>{sec.room_number || 'N/A'}</code></td>
                  <td>
                    <span className={`status-badge ${sec.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                      {sec.status || 'Active'}
                    </span>
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

export default ClassesSectionsTab;
