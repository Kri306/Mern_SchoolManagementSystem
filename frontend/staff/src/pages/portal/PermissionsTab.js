import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function PermissionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/dashboard/permissions', token, handleLogout);
        if (res.success) {
          setPermissions(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load permissions', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPermissions();
    }
  }, [token, handleLogout]);

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading permissions details...</div>;
  }

  return (
    <div className="panel-card">
      <h2 className="panel-card-title" style={{ marginBottom: '16px' }}>My Account Role & Permissions</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
        Below are the access rights and feature constraints configured for your staff account role.
      </p>

      <div className="table-responsive">
        <table className="clean-table">
          <thead>
            <tr>
              <th>Module / Resource</th>
              <th>Read / View</th>
              <th>Write / Create</th>
              <th>Update / Edit</th>
              <th>Delete</th>
              <th>Other Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '600' }}>{p.module_name}</td>
                <td>
                  <input type="checkbox" checked={p.can_read === 1} readOnly style={{ accentColor: 'var(--primary)' }} />
                </td>
                <td>
                  <input type="checkbox" checked={p.can_write === 1} readOnly style={{ accentColor: 'var(--primary)' }} />
                </td>
                <td>
                  <input type="checkbox" checked={p.can_update === 1} readOnly style={{ accentColor: 'var(--primary)' }} />
                </td>
                <td>
                  <input type="checkbox" checked={p.can_delete === 1} readOnly style={{ accentColor: 'var(--primary)' }} />
                </td>
                <td>
                  <input type="checkbox" checked={p.can_more === 1} readOnly style={{ accentColor: 'var(--primary)' }} />
                </td>
              </tr>
            ))}
            {permissions.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                  Default full rights enabled for Teaching/Staff categories.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PermissionsTab;
