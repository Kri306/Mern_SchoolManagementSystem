import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import DashboardTab from './portal/DashboardTab';
import SchoolsTab from './portal/SchoolsTab';
import BranchesTab from './portal/BranchesTab';
import SchoolAdminsTab from './portal/SchoolAdminsTab';
import SchoolBoardsTab from './portal/SchoolBoardsTab';
import SchoolMediumsTab from './portal/SchoolMediumsTab';
import StaffTab from './portal/StaffTab';
import StudentsTab from './portal/StudentsTab';
import ParentsTab from './portal/ParentsTab';
import AcademicYearsTab from './portal/AcademicYearsTab';
import SessionsTab from './portal/SessionsTab';
import ClassesTab from './portal/ClassesTab';
import SectionsTab from './portal/SectionsTab';
import BatchesTab from './portal/BatchesTab';
import StaffTypesTab from './portal/StaffTypesTab';
import DepartmentsTab from './portal/DepartmentsTab';
import RolesTab from './portal/RolesTab';
import ModulesTab from './portal/ModulesTab';
import PermissionsTab from './portal/PermissionsTab';
import ProfileTab from './portal/ProfileTab';

function Portal({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardTab token={token} handleLogout={onLogout} onNavigate={setActiveTab} />;
      case 'schools':
        return <SchoolsTab token={token} handleLogout={onLogout} user={user} searchTerm={searchTerm} />;
      case 'branches':
        return <BranchesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'admins':
        return <SchoolAdminsTab token={token} handleLogout={onLogout} user={user} searchTerm={searchTerm} />;
      case 'boards':
        return <SchoolBoardsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'mediums':
        return <SchoolMediumsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'staff':
        return <StaffTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'students':
        return <StudentsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'parents':
        return <ParentsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'academic-years':
        return <AcademicYearsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'sessions':
        return <SessionsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'classes':
        return <ClassesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'sections':
        return <SectionsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'batches':
        return <BatchesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'staff-types':
        return <StaffTypesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'departments':
        return <DepartmentsTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'roles':
        return <RolesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'modules':
        return <ModulesTab token={token} handleLogout={onLogout} searchTerm={searchTerm} />;
      case 'permissions':
        return <PermissionsTab token={token} handleLogout={onLogout} />;
      case 'profile':
        return <ProfileTab token={token} handleLogout={onLogout} user={user} />;
      default:
        return <DashboardTab token={token} handleLogout={onLogout} onNavigate={setActiveTab} />;
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
