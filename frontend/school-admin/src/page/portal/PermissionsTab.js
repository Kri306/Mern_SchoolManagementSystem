import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function PermissionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [matrix, setMatrix] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/permissions', token, handleLogout);
      if (res.success) {
        setMatrix(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load permissions config matrix', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMatrix();
    }
  }, [token]);

  const handleCheckboxChange = async (nodeId, field, currentValue) => {
    setIsSubmitting(true);
    try {
      // Find current node in state
      const node = matrix.find(n => n.id === nodeId);
      if (!node) return;

      const payload = {
        can_read: node.can_read,
        can_write: node.can_write,
        can_update: node.can_update,
        can_delete: node.can_delete,
        can_more: node.can_more,
        [field]: currentValue ? 0 : 1 // toggle
      };

      const res = await apiFetch(`/permissions/${nodeId}`, token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        // Optimistic state update
        setMatrix(prev => prev.map(n => n.id === nodeId ? { ...n, [field]: currentValue ? 0 : 1 } : n));
      }
    } catch (err) {
      alert(err.message || 'Failed to update permission setting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading system permissions matrix...</div>;
  }

  return (
    <div className="panel-card">
      <h2 className="panel-card-title" style={{ marginBottom: '10px' }}>Role Permissions Matrix</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Control modular authorization grants (Read, Write, Update, Delete) for institutional user roles.
      </p>

      <div className="table-responsive">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Role Type</th>
              <th>System Module</th>
              <th style={{ textAlign: 'center' }}>Read (View)</th>
              <th style={{ textAlign: 'center' }}>Write (Create)</th>
              <th style={{ textAlign: 'center' }}>Update (Edit)</th>
              <th style={{ textAlign: 'center' }}>Delete (Remove)</th>
              <th style={{ textAlign: 'center' }}>Custom Action</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(row => (
              <tr key={row.id}>
                <td>
                  <span className="status-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700' }}>
                    {row.role_name}
                  </span>
                </td>
                <td style={{ fontWeight: '600' }}>{row.module_name}</td>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={row.can_read === 1} 
                    disabled={isSubmitting}
                    onChange={() => handleCheckboxChange(row.id, 'can_read', row.can_read)} 
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={row.can_write === 1} 
                    disabled={isSubmitting}
                    onChange={() => handleCheckboxChange(row.id, 'can_write', row.can_write)} 
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={row.can_update === 1} 
                    disabled={isSubmitting}
                    onChange={() => handleCheckboxChange(row.id, 'can_update', row.can_update)} 
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={row.can_delete === 1} 
                    disabled={isSubmitting}
                    onChange={() => handleCheckboxChange(row.id, 'can_delete', row.can_delete)} 
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={row.can_more === 1} 
                    disabled={isSubmitting}
                    onChange={() => handleCheckboxChange(row.id, 'can_more', row.can_more)} 
                  />
                </td>
              </tr>
            ))}
            {matrix.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No modules permission mapping defined.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermissionsTab;
