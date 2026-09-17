import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function BatchesTab({ token, handleLogout, searchTerm }) {
  const [loading, setLoading] = useState(true);
  const [batchesList, setBatchesList] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/batches', token, handleLogout);
        if (res.success) {
          setBatchesList(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load batches', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBatches();
    }
  }, [token, handleLogout]);

  const filteredBatches = batchesList.filter(b => 
    b.batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.section_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading batches details...</div>;
  }

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2 className="panel-card-title">My Assigned Classes / Batches ({filteredBatches.length})</h2>
      </div>

      <div className="table-responsive" style={{ marginTop: '16px' }}>
        <table className="clean-table">
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Class Name</th>
              <th>Section</th>
              <th>Academic Year</th>
              <th>Classroom / Location</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBatches.map(b => (
              <tr key={b.batch_id}>
                <td><span className="school-code-text">{b.batch_code}</span></td>
                <td>{b.class_name}</td>
                <td>{b.section_name}</td>
                <td>{b.academic_year_name}</td>
                <td>{b.location || 'Main Block'}</td>
                <td>{b.student_capacity ? `${b.student_capacity} Students` : 'N/A'}</td>
                <td>
                  <span className={`status-badge ${b.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>No batches assigned.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatchesTab;
