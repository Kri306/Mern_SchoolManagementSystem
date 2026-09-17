import React, { useState } from 'react';
import * as Icons from './Icons';

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const isParent = user?.role_id === 5;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      badge: null
    },
    {
      id: 'profile',
      label: isParent ? "Ward's Profile" : 'My Profile',
      icon: '👤',
      badge: null
    },
    {
      id: 'schedule',
      label: 'Class & Schedule',
      icon: '🕒',
      badge: null
    },
    {
      id: 'teachers',
      label: 'Teachers & Faculty',
      icon: '👨‍🏫',
      badge: null
    },
    {
      id: 'academics',
      label: 'Academic Year',
      icon: '📅',
      badge: null
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '📁',
      badge: null
    },
    {
      id: 'school',
      label: 'School & Branch',
      icon: '🏫',
      badge: null
    },
    {
      id: 'settings',
      label: 'Security & Settings',
      icon: '⚙️',
      badge: null
    }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <Icons.SwirlLogo />
        <h1 className="logo-text">SM<span>S</span></h1>
      </div>

      {/* User profile dropdown box */}
      <div 
        className="profile-box" 
        onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="profile-avatar">
          <div 
            className="avatar-round-icon" 
            style={{ 
              backgroundColor: isParent ? '#fef3c7' : 'var(--primary-light)', 
              color: isParent ? '#b45309' : 'var(--primary)', 
              fontWeight: '700', 
              fontSize: '14px', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : (isParent ? 'P' : 'S')}
          </div>
        </div>
        <div className="profile-info">
          <div 
            className="profile-name" 
            style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}
          >
            {user?.name || 'User'}
          </div>
          <div className="profile-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {isParent ? '👨‍👩‍👦 Parent' : '🎓 Student'}
          </div>
        </div>
        <div className="profile-dropdown-arrow">
          <Icons.ArrowDown />
        </div>

        {showProfileDropdown && (
          <div 
            className="dropdown-menu-box" 
            style={{ 
              position: 'absolute',
              top: '100%', 
              left: 0, 
              width: '100%', 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              zIndex: 100, 
              marginTop: '4px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div 
              className="dropdown-item" 
              onClick={(e) => { e.stopPropagation(); setActiveTab('profile'); setShowProfileDropdown(false); }} 
              style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              <span>👤 Profile</span>
            </div>
            <div 
              className="dropdown-item" 
              onClick={(e) => { e.stopPropagation(); setActiveTab('settings'); setShowProfileDropdown(false); }} 
              style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}
            >
              <span>⚙️ Change Password</span>
            </div>
            <div 
              className="dropdown-item" 
              onClick={(e) => { e.stopPropagation(); onLogout(); }} 
              style={{ color: '#ef4444', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}
            >
              <Icons.Logout />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>

      <div className="nav-group-title">{isParent ? 'PARENT PORTAL' : 'STUDENT PORTAL'}</div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '17px', marginRight: '6px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="badge badge-primary">{item.badge}</span>
            )}
          </div>
        ))}

        {/* Logout item */}
        <div 
          className="nav-item"
          onClick={onLogout}
          style={{ color: '#ef4444', marginTop: '24px' }}
        >
          <div className="nav-item-left">
            <Icons.Logout />
            <span style={{ marginLeft: '6px' }}>Logout</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
