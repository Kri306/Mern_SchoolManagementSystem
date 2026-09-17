import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

// Portal Tab Imports
import DashboardTab from './portal/DashboardTab';
import SchoolInfoTab from './portal/SchoolInfoTab';
import BranchInfoTab from './portal/BranchInfoTab';
import SessionsTab from './portal/SessionsTab';
import ClassesSectionsTab from './portal/ClassesSectionsTab';
import BatchesTab from './portal/BatchesTab';
import StaffTab from './portal/StaffTab';
import StudentsTab from './portal/StudentsTab';
import ParentsTab from './portal/ParentsTab';
import MediumsTab from './portal/MediumsTab';
import BoardsTab from './portal/BoardsTab';
import RequestsTab from './portal/RequestsTab';
import ReportsTab from './portal/ReportsTab';
import PermissionsTab from './portal/PermissionsTab';
import ProfileTab from './portal/ProfileTab';

function Dashboard({ token, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab token={token} handleLogout={onLogout} />;
      case 'school':
        return <SchoolInfoTab token={token} handleLogout={onLogout} />;
      case 'branches':
        return <BranchInfoTab token={token} handleLogout={onLogout} />;
      case 'academic-years':
        return <SessionsTab token={token} handleLogout={onLogout} />;
      case 'classes':
      case 'sections':
        return <ClassesSectionsTab token={token} handleLogout={onLogout} />;
      case 'batches':
        return <BatchesTab token={token} handleLogout={onLogout} />;
      case 'staff':
        return <StaffTab token={token} handleLogout={onLogout} />;
      case 'students':
        return <StudentsTab token={token} handleLogout={onLogout} />;
      case 'parents':
        return <ParentsTab token={token} handleLogout={onLogout} />;
      case 'mediums':
        return <MediumsTab token={token} handleLogout={onLogout} />;
      case 'boards':
        return <BoardsTab token={token} handleLogout={onLogout} />;
      case 'requests':
        return <RequestsTab token={token} handleLogout={onLogout} />;
      case 'reports':
        return <ReportsTab token={token} handleLogout={onLogout} />;
      case 'permissions':
        return <PermissionsTab token={token} handleLogout={onLogout} />;
      case 'profile':
        return <ProfileTab token={token} handleLogout={onLogout} />;
      default:
        return <DashboardTab token={token} handleLogout={onLogout} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={onLogout} 
      />

      <main className="main-content">
        <TopNavbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onLogout={onLogout} 
        />
        <div style={{ padding: '24px' }}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
