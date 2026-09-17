import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import DashboardTab from './portal/DashboardTab';
import ProfileTab from './portal/ProfileTab';
import ClassScheduleTab from './portal/ClassScheduleTab';
import TeachersTab from './portal/TeachersTab';
import AcademicTab from './portal/AcademicTab';
import DocumentsTab from './portal/DocumentsTab';
import SchoolInfoTab from './portal/SchoolInfoTab';
import SettingsTab from './portal/SettingsTab';
import { apiFetch } from '../utils/api';

function Portal({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  const isParent = user?.role_id === 5;

  // If Parent, fetch all linked children on mount
  useEffect(() => {
    if (isParent) {
      fetchChildren();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isParent]);

  const fetchChildren = async () => {
    try {
      const res = await apiFetch('/dashboard/children', token, onLogout);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setChildrenList(res.data);
        setSelectedChildId(res.data[0].student_id);
      }
    } catch (err) {
      console.error('Failed to load children for parent:', err);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            setActiveTab={setActiveTab} 
            handleLogout={onLogout} 
          />
        );
      case 'profile':
        return (
          <ProfileTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'schedule':
        return (
          <ClassScheduleTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'teachers':
        return (
          <TeachersTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'academics':
        return (
          <AcademicTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'documents':
        return (
          <DocumentsTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'school':
        return (
          <SchoolInfoTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            handleLogout={onLogout} 
          />
        );
      case 'settings':
        return (
          <SettingsTab 
            token={token} 
            user={user} 
            handleLogout={onLogout} 
          />
        );
      default:
        return (
          <DashboardTab 
            token={token} 
            user={user} 
            selectedChildId={selectedChildId} 
            setActiveTab={setActiveTab} 
            handleLogout={onLogout} 
          />
        );
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
          user={user}
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          childrenList={childrenList}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          onLogout={onLogout} 
        />
        {renderTabContent()}
      </main>
    </div>
  );
}

export default Portal;
