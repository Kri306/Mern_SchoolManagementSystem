import React from 'react';
import * as Icons from './Icons';

function TopNavbar({ 
  user, 
  searchTerm, 
  setSearchTerm, 
  childrenList = [], 
  selectedChildId, 
  onSelectChild, 
  onLogout 
}) {
  const isParent = user?.role_id === 5;

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <div className="top-search-box">
          <span className="top-search-icon"><Icons.Search /></span>
          <input
            type="text"
            className="top-search-input"
            placeholder="Search details, classmates, staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Parent child switcher */}
        {isParent && childrenList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Viewing Child:
            </span>
            <select
              value={selectedChildId || ''}
              onChange={(e) => onSelectChild(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--primary)',
                background: '#ffffff',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {childrenList.map((child) => (
                <option key={child.student_id} value={child.student_id}>
                  {child.name} ({child.class_name || 'Class N/A'} - {child.roll_number ? `Roll #${child.roll_number}` : child.student_unique_id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="top-navbar-right">
        {user?.school_name && (
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--text-secondary)', 
              background: '#f1f5f9', 
              padding: '4px 10px', 
              borderRadius: '6px' 
            }}
          >
            🏫 {user.school_name}
          </span>
        )}
        <button 
          className="btn btn-secondary" 
          onClick={onLogout}
          style={{ 
            fontSize: '12px', 
            padding: '6px 14px', 
            border: '1px solid #fee2e2', 
            color: '#ef4444',
            background: '#fff5f5'
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default TopNavbar;
