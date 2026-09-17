import React, { useState } from 'react';
import * as Icons from './Icons';

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    classes: true,
    schoolInfo: false,
    academic: false,
    settings: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Icons.SwirlLogo />
        <h1 className="logo-text">SM<span>S</span></h1>
      </div>
      
      {/* User profile dropdown box */}
      <div className="profile-box" onClick={() => setShowProfileDropdown(!showProfileDropdown)} style={{ cursor: 'pointer' }}>
        <div className="profile-avatar">
          <div className="avatar-round-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '14px', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
            {user?.name || 'Staff Member'}
          </div>
          <div className="profile-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {user?.staff_type || 'Staff / Teacher'}
          </div>
        </div>
        <div className="profile-dropdown-arrow">
          <Icons.ArrowDown />
        </div>

        {showProfileDropdown && (
          <div className="dropdown-menu-box" style={{ top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 10, marginTop: '4px' }}>
            <div className="dropdown-item" onClick={() => setActiveTab('settings-password')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <span>Change Password</span>
            </div>
            <div className="dropdown-item" onClick={onLogout} style={{ color: '#ef4444', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
              <Icons.Logout />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>

      <div className="nav-group-title">STAFF PANEL</div>
      <div className="nav-links">
        
        {/* 🏠 Dashboard */}
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🏠</span>
            <span>Dashboard</span>
          </div>
        </div>

        {/* 👤 My Profile */}
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>👤</span>
            <span>My Profile</span>
          </div>
        </div>

        {/* 🎓 My Classes Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('classes')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>🎓</span>
              <span>My Classes</span>
            </div>
            <span style={{ transform: openMenus.classes ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.classes && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => setActiveTab('batches')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>My Batches</span>
              </div>
            </div>
          )}
        </div>

        {/* 👨🎓 My Students */}
        <div 
          className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>👨‍🎓</span>
            <span>My Students</span>
          </div>
        </div>

        {/* 🏫 School Information Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('schoolInfo')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>🏫</span>
              <span>School Info</span>
            </div>
            <span style={{ transform: openMenus.schoolInfo ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.schoolInfo && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'school' ? 'active' : ''}`}
                onClick={() => setActiveTab('school')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span> School</span>
              </div>
              <div 
                className={`nav-item sub-item ${activeTab === 'branch' ? 'active' : ''}`}
                onClick={() => setActiveTab('branch')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Branch</span>
              </div>
            </div>
          )}
        </div>

        {/* 📅 Academic Year Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('academic')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>📅</span>
              <span>Academic Year</span>
            </div>
            <span style={{ transform: openMenus.academic ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.academic && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'sessions' ? 'active' : ''}`}
                onClick={() => setActiveTab('sessions')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span> Current Session</span>
              </div>
            </div>
          )}
        </div>

        {/* 📚 Classes & Sections */}
        <div 
          className={`nav-item ${activeTab === 'classes-sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes-sections')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>📚</span>
            <span>Classes & Sections</span>
          </div>
        </div>

        {/* 🔐 My Permissions */}
        <div 
          className={`nav-item ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🔐</span>
            <span>My Permissions</span>
          </div>
        </div>

        {/* ⚙️ Settings Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('settings')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>⚙️</span>
              <span>Settings</span>
            </div>
            <span style={{ transform: openMenus.settings ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.settings && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'settings-password' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings-password')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>└── Change Password</span>
              </div>
            </div>
          )}
        </div>

        {/* 🚪 Logout */}
        <div 
          className="nav-item"
          onClick={onLogout}
          style={{ color: '#ef4444', marginTop: '20px' }}
        >
          <div className="nav-item-left">
            <Icons.Logout />
            <span>Logout</span>
          </div>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;
