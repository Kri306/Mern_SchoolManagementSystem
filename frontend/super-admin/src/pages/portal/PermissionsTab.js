import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';

function PermissionsTab({ token, handleLogout }) {
  const [permissions, setPermissions] = useState([]);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await apiFetch('/master/permissions', token, handleLogout);
      if (res.success) {
        setPermissions(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load permissions matrix', err);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (token) {
      fetchPermissions();
    }
  }, [token, fetchPermissions]);

  const handleToggle = async (index, field) => {
    const targetNode = permissions[index];
    if (!targetNode) return;

    const updatedNode = {
      ...targetNode,
      [field]: !targetNode[field]
    };

    try {
      const res = await apiFetch(`/master/permissions/${targetNode.id}`, token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify({
          can_read: updatedNode.can_read ? 1 : 0,
          can_write: updatedNode.can_write ? 1 : 0,
          can_update: updatedNode.can_update ? 1 : 0,
          can_delete: updatedNode.can_delete ? 1 : 0,
          can_more: updatedNode.can_more ? 1 : 0
        })
      });
      if (res.success) {
        fetchPermissions();
      }
    } catch (err) {
      alert(err.message || 'Failed to update permission setting');
    }
  };

  return (
    <div className="panel-card">
      <h2 className="panel-card-title">Role & Module Permissions Matrix</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
        Check or uncheck permission nodes to dynamically adjust system access scopes for each role.
      </p>

      <div className="table-responsive">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Role Type</th>
              <th>System Module</th>
              <th style={{ textAlign: 'center' }}>READ</th>
              <th style={{ textAlign: 'center' }}>WRITE</th>
              <th style={{ textAlign: 'center' }}>UPDATE</th>
              <th style={{ textAlign: 'center' }}>DELETE</th>
              <th style={{ textAlign: 'center' }}>MORE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, idx) => (
              <tr key={p.id}>
                <td><strong>{p.role_name}</strong></td>
                <td><code style={{ fontSize: '12px' }}>{p.module_name}</code></td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!p.can_read} onChange={() => handleToggle(idx, 'can_read')} style={{ accentColor: 'var(--primary)', scale: '1.2', cursor: 'pointer' }} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!p.can_write} onChange={() => handleToggle(idx, 'can_write')} style={{ accentColor: 'var(--primary)', scale: '1.2', cursor: 'pointer' }} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!p.can_update} onChange={() => handleToggle(idx, 'can_update')} style={{ accentColor: 'var(--primary)', scale: '1.2', cursor: 'pointer' }} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!p.can_delete} onChange={() => handleToggle(idx, 'can_delete')} style={{ accentColor: 'var(--primary)', scale: '1.2', cursor: 'pointer' }} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!p.can_more} onChange={() => handleToggle(idx, 'can_more')} style={{ accentColor: 'var(--primary)', scale: '1.2', cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
            {permissions.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No roles/modules permissions mapped in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermissionsTab;
