import React, { useState } from 'react';
import * as Icons from './Icons';

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    schools: true,
    users: false,
    academic: false,
    staff: false,
    access: false
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
          <div className="avatar-round-icon" style={{ backgroundColor: '#fef08a', color: '#64748b', fontWeight: '700', fontSize: '14px', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
            {user?.name || 'System Admin'}
          </div>
          <div className="profile-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Super Admin
          </div>
        </div>
        <div className="profile-dropdown-arrow">
          <Icons.ArrowDown />
        </div>

        {showProfileDropdown && (
          <div className="dropdown-menu-box" style={{ top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 10, marginTop: '4px' }}>
            <div className="dropdown-item" onClick={() => setActiveTab('profile')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <span>My Profile</span>
            </div>
            <div className="dropdown-item" onClick={onLogout} style={{ color: '#ef4444', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
              <Icons.Logout />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>

      <div className="nav-group-title">SUPER ADMIN</div>
      <div className="nav-links">
        
        {/* 🏠 Dashboard */}
        <div 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🏠</span>
            <span>Dashboard</span>
          </div>
        </div>

        {/* 🏫 School Management Submenu */}
        <div>
          <div className="nav-item" onClick={() => toggleMenu('schools')}>
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>🏫</span>
              <span>School Setup</span>
            </div>
            <span style={{ transform: openMenus.schools ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.schools && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div className={`nav-item sub-item ${activeTab === 'schools' ? 'active' : ''}`} onClick={() => setActiveTab('schools')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Schools</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Branches</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Admins</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'boards' ? 'active' : ''}`} onClick={() => setActiveTab('boards')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Boards Request</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'mediums' ? 'active' : ''}`} onClick={() => setActiveTab('mediums')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Mediums Request</span>
              </div>
            </div>
          )}
        </div>

        {/* 👥 User Management Submenu */}
        <div>
          <div className="nav-item" onClick={() => toggleMenu('users')}>
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>👥</span>
              <span>User Directories</span>
            </div>
            <span style={{ transform: openMenus.users ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.users && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div className={`nav-item sub-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Staff</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Students</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'parents' ? 'active' : ''}`} onClick={() => setActiveTab('parents')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Parents</span>
              </div>
            </div>
          )}
        </div>

        {/* 📚 Academic Management Submenu */}
        <div>
          <div className="nav-item" onClick={() => toggleMenu('academic')}>
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>📚</span>
              <span>Academics</span>
            </div>
            <span style={{ transform: openMenus.academic ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.academic && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div className={`nav-item sub-item ${activeTab === 'academic-years' ? 'active' : ''}`} onClick={() => setActiveTab('academic-years')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Academic Years</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Sessions</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Classes</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Sections</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'batches' ? 'active' : ''}`} onClick={() => setActiveTab('batches')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Batches</span>
              </div>
            </div>
          )}
        </div>

        {/* 👔 Staff Management Submenu */}
        <div>
          <div className="nav-item" onClick={() => toggleMenu('staff')}>
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>👔</span>
              <span>Staff Setup</span>
            </div>
            <span style={{ transform: openMenus.staff ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.staff && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div className={`nav-item sub-item ${activeTab === 'staff-types' ? 'active' : ''}`} onClick={() => setActiveTab('staff-types')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Staff Types</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Departments</span>
              </div>
            </div>
          )}
        </div>

        {/* 🔐 Access Control Submenu */}
        <div>
          <div className="nav-item" onClick={() => toggleMenu('access')}>
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>🔐</span>
              <span>Access Control</span>
            </div>
            <span style={{ transform: openMenus.access ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
            
          </div>
          {openMenus.access && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div className={`nav-item sub-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Roles</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Modules</span>
              </div>
              <div className={`nav-item sub-item ${activeTab === 'permissions' ? 'active' : ''}`} onClick={() => setActiveTab('permissions')} style={{ fontSize: '13px', height: '36px' }}>
                <span> Permissions</span>
              </div>
            </div>
          )}
        </div>

        {/* 👤 My Profile */}
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          style={{ marginTop: '12px' }}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>👤</span>
            <span>My Profile</span>
          </div>
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
