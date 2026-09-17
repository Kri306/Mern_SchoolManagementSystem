import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function DashboardTab({ token, user, selectedChildId, setActiveTab, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isParent = user?.role_id === 5;

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/summary?student_id=${selectedChildId}`
        : '/dashboard/summary';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load dashboard summary');
      }
    } catch (err) {
      setError(err.message || 'Error loading dashboard summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-content-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-container">
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button className="btn btn-secondary" onClick={fetchSummary} style={{ padding: '4px 12px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const student = data?.student;

  if (!student) {
    return (
      <div className="tab-content-container">
        <div className="table-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎓</div>
          <h3>No Student Record Enrolled</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            {isParent ? 'No children records are linked to your parent account yet.' : 'Your student profile is currently being processed.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content-container">
      {/* 🌟 Welcome / Student Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
              {isParent ? '👨‍👩‍👦 Ward Details' : '🎓 Student Portal'}
            </span>
            {student.session_name && (
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                📅 {student.session_name}
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 6px 0' }}>
            {student.name}
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
            {student.class_name ? `${student.class_name} - ${student.section_name || ''}` : 'Class N/A'} • Roll #{student.roll_number || 'N/A'} • Admission #{student.admission_number || 'N/A'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Student ID</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>{student.student_unique_id || 'N/A'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Current GPA</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px' }}>{student.gpa ? `${student.gpa} / 4.0` : '3.80 / 4.0'}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Status</div>
            <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '2px', color: '#a7f3d0' }}>
              {student.status || 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Quick Stats Grid */}
      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="dashboard-stat-card">
          <div className="stat-left">
            <span className="stat-title-label">Class & Section</span>
            <span className="stat-number-value" style={{ fontSize: '20px' }}>{student.class_name || 'Class 9'}</span>
            <div className="stat-indicator-row indicator-positive">
              <span>Section: {student.section_name || 'A'} • Room {student.room_number || '101'}</span>
            </div>
          </div>
          <div style={{ fontSize: '32px' }}>📚</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-left">
            <span className="stat-title-label">Batch Code</span>
            <span className="stat-number-value" style={{ fontSize: '20px' }}>{student.batch_code || 'GPS-VAD-9A'}</span>
            <div className="stat-indicator-row indicator-positive">
              <span>{student.duration_minutes ? `${student.duration_minutes} Mins / Day` : 'Active Batch'}</span>
            </div>
          </div>
          <div style={{ fontSize: '32px' }}>🕒</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-left">
            <span className="stat-title-label">Classmates</span>
            <span className="stat-number-value">{data.classmatesCount || 0}</span>
            <div className="stat-indicator-row indicator-positive">
              <span>Active peers in batch</span>
            </div>
          </div>
          <div style={{ fontSize: '32px' }}>👥</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-left">
            <span className="stat-title-label">Class Teacher</span>
            <span className="stat-number-value" style={{ fontSize: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
              {student.teacher_name || 'Assigned Staff'}
            </span>
            <div className="stat-indicator-row indicator-positive">
              <span>{student.teacher_qualification || 'Faculty'}</span>
            </div>
          </div>
          <div style={{ fontSize: '32px' }}>👨‍🏫</div>
        </div>
      </div>

      {/* 📌 Two Column Layout: Schedule & Teacher Spotlight */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Daily Schedule Card */}
        <div className="table-container" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>🕒 Daily Class Schedule</h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('schedule')} 
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Full Details →
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Class Hours:</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                {student.start_time && student.end_time ? `${student.start_time.slice(0,5)} - ${student.end_time.slice(0,5)}` : '08:30 - 13:30'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Room Number:</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Room {student.room_number || '101'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Academic Year:</span>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{student.academic_year_name || 'Current Year'}</span>
            </div>
          </div>

          {/* Quick Classmates Avatars */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Classmates in this Batch ({data.classmatesCount}):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.classmatesPreview && data.classmatesPreview.length > 0 ? (
                data.classmatesPreview.map((peer) => (
                  <div 
                    key={peer.student_id}
                    title={`${peer.name} (Roll #${peer.roll_number || 'N/A'})`}
                    style={{
                      background: '#eef2ff',
                      color: 'var(--primary)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>👤</span>
                    <span>{peer.name}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No other classmates listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Teacher & School Contact Card */}
        <div className="table-container" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>👨‍🏫 Class Teacher Contact</h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveTab('teachers')} 
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              All Faculty →
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
            <div 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: '#e0e7ff', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700'
              }}
            >
              {student.teacher_name ? student.teacher_name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>{student.teacher_name || 'Class Teacher'}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{student.teacher_qualification || 'Academic Educator'}</div>
              <span className="badge badge-success" style={{ marginTop: '4px', display: 'inline-block' }}>Class Incharge</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span>📧</span>
              <span><strong>Email:</strong> {student.teacher_email || 'teacher@gpsgujarat.ac.in'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span>📞</span>
              <span><strong>Phone:</strong> {student.teacher_phone || '+91 98980 12345'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏫</span>
              <span><strong>Branch:</strong> {student.branch_name || 'Vadodara Campus'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 Quick Actions Bar */}
      <div className="table-container" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Quick Access</h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Jump to frequently accessed student records and school information</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('profile')}>
            👤 Full Profile
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('schedule')}>
            🕒 Class Schedule
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('academics')}>
            📅 Academic Sessions
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('documents')}>
            📁 Student Documents
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('school')}>
            🏫 School Information
          </button>
        </div>
      </div>

    </div>
  );
}

export default DashboardTab;
