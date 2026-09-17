import React, { useState } from 'react';
import * as Icons from './Icons';

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    academic: true,
    staff: false,
    students: false,
    profile: false
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
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
            {user?.name || 'School Admin'}
          </div>
          <div className="profile-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Admin Portal
          </div>
        </div>
        <div className="profile-dropdown-arrow">
          <Icons.ArrowDown />
        </div>

        {showProfileDropdown && (
          <div className="dropdown-menu-box" style={{ top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 10, marginTop: '4px' }}>
            <div className="dropdown-item" onClick={() => setActiveTab('profile')} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <span>My Profile / Password</span>
            </div>
            <div className="dropdown-item" onClick={onLogout} style={{ color: '#ef4444', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
              <Icons.Logout />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>

      <div className="nav-group-title">SCHOOL ADMIN PANEL</div>
      <div className="nav-links" style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: '4px' }}>
        
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

        {/* 🏫 My School */}
        <div 
          className={`nav-item ${activeTab === 'school' ? 'active' : ''}`}
          onClick={() => setActiveTab('school')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🏫</span>
            <span>My School</span>
          </div>
        </div>

        {/* 📍 Branches */}
        <div 
          className={`nav-item ${activeTab === 'branches' ? 'active' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>📍</span>
            <span>Branches</span>
          </div>
        </div>

        {/* 📅 Academic Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('academic')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>📅</span>
              <span>Academic</span>
            </div>
            <span style={{ transform: openMenus.academic ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.academic && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'academic-years' ? 'active' : ''}`}
                onClick={() => setActiveTab('academic-years')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Academic Years</span>
              </div>
              <div 
                className={`nav-item sub-item ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Classes</span>
              </div>
              <div 
                className={`nav-item sub-item ${activeTab === 'sections' ? 'active' : ''}`}
                onClick={() => setActiveTab('sections')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Sections</span>
              </div>
              <div 
                className={`nav-item sub-item ${activeTab === 'batches' ? 'active' : ''}`}
                onClick={() => setActiveTab('batches')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Batches</span>
              </div>
            </div>
          )}
        </div>

        {/* 👥 Staff Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('staff')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>👥</span>
              <span>Staff</span>
            </div>
            <span style={{ transform: openMenus.staff ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.staff && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'staff' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Staff List</span>
              </div>
            </div>
          )}
        </div>

        {/* 👨🎓 Students Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('students')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>👨‍🎓</span>
              <span>Students</span>
            </div>
            <span style={{ transform: openMenus.students ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.students && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Student List</span>
              </div>
              <div 
                className={`nav-item sub-item ${activeTab === 'parents' ? 'active' : ''}`}
                onClick={() => setActiveTab('parents')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Parents</span>
              </div>
            </div>
          )}
        </div>

        {/* 🗣️ Medium */}
        <div 
          className={`nav-item ${activeTab === 'mediums' ? 'active' : ''}`}
          onClick={() => setActiveTab('mediums')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🗣️</span>
            <span>Medium</span>
          </div>
        </div>

        {/* 📋 Board */}
        <div 
          className={`nav-item ${activeTab === 'boards' ? 'active' : ''}`}
          onClick={() => setActiveTab('boards')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>📋</span>
            <span>Board</span>
          </div>
        </div>

        {/* 📩 Requests */}
        <div 
          className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>📩</span>
            <span>Requests</span>
          </div>
        </div>

        {/* 📊 Reports */}
        <div 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>📊</span>
            <span>Reports</span>
          </div>
        </div>

        {/* 🔐 Permissions */}
        <div 
          className={`nav-item ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          <div className="nav-item-left">
            <span style={{ fontSize: '16px' }}>🔐</span>
            <span>Permissions</span>
          </div>
        </div>

        {/* 👤 Profile Submenu */}
        <div>
          <div 
            className="nav-item"
            onClick={() => toggleMenu('profile')}
          >
            <div className="nav-item-left">
              <span style={{ fontSize: '16px' }}>👤</span>
              <span>Profile</span>
            </div>
            <span style={{ transform: openMenus.profile ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
              <Icons.ArrowDown />
            </span>
          </div>
          {openMenus.profile && (
            <div className="sidebar-submenu" style={{ paddingLeft: '24px' }}>
              <div 
                className={`nav-item sub-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                style={{ fontSize: '13px', height: '36px' }}
              >
                <span>Change Password</span>
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
