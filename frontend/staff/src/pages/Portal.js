import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import DashboardTab from './portal/DashboardTab';
import ProfileTab from './portal/ProfileTab';
import BatchesTab from './portal/BatchesTab';
import StudentsTab from './portal/StudentsTab';
import SchoolInfoTab from './portal/SchoolInfoTab';
import BranchInfoTab from './portal/BranchInfoTab';
import SessionsTab from './portal/SessionsTab';
import ClassesSectionsTab from './portal/ClassesSectionsTab';
import PermissionsTab from './portal/PermissionsTab';
import SettingsTab from './portal/SettingsTab';

function Portal({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab token={token} handleLogout={onLogout} />;
      case 'profile':
        return <ProfileTab token={token} handleLogout={onLogout} />;
      case 'batches':
        return <BatchesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'students':
        return <StudentsTab token={token} handleLogout={onLogout} user={user} searchTerm={searchTerm} />;
      case 'school':
        return <SchoolInfoTab token={token} handleLogout={onLogout} />;
      case 'branch':
        return <BranchInfoTab token={token} handleLogout={onLogout} />;
      case 'sessions':
        return <SessionsTab token={token} handleLogout={onLogout} />;
      case 'classes-sections':
        return <ClassesSectionsTab token={token} handleLogout={onLogout} />;
      case 'permissions':
        return <PermissionsTab token={token} handleLogout={onLogout} />;
      case 'settings-password':
        return <SettingsTab token={token} handleLogout={onLogout} />;
      default:
        return <DashboardTab token={token} handleLogout={onLogout} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />

      <main className="main-content">
        <TopNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onLogout={onLogout} />
        {renderTabContent()}
      </main>
    </div>
  );
}

export default Portal;
