import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ProfileTab({ token, user, selectedChildId, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/profile?student_id=${selectedChildId}`
        : '/dashboard/profile';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err.message || 'Error loading profile');
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
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="btn btn-secondary" onClick={fetchProfile} style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const student = data?.student;
  const parents = data?.parents || [];

  if (!student) {
    return (
      <div className="tab-content-container">
        <div className="table-container" style={{ padding: '30px', textAlign: 'center' }}>
          <h3>No Profile Available</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Student profile details could not be found.</p>
        </div>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  return (
    <div className="tab-content-container">
      
      {/* 👤 Profile Header Card */}
      <div 
        className="table-container" 
        style={{ 
          padding: '28px 32px', 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '24px',
          flexWrap: 'wrap',
          background: '#ffffff'
        }}
      >
        <div 
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
            color: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '700',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
          }}
        >
          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{student.name}</h2>
            <span className="badge badge-primary">{student.student_unique_id || 'ID N/A'}</span>
            <span className="badge badge-success">{student.status || 'Active'}</span>
            {student.is_fee_exempted === 1 && (
              <span className="badge badge-warning">Fee Exempted</span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            {student.class_name || 'Class N/A'} • {student.section_name || 'Section A'} • Roll #{student.roll_number || 'N/A'} • Batch {student.batch_code || 'N/A'}
          </p>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            🏫 {student.school_name || 'Gujarat Public School'} ({student.branch_name || 'Main Campus'})
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Academic Standing</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>
            {student.gpa ? `${student.gpa} GPA` : '3.85 GPA'}
          </div>
        </div>
      </div>

      {/* 📋 Detail Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* 1. Academic & Enrollment Identity */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎓</span> Academic & Enrollment Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Student Unique ID</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.student_unique_id || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Admission Number</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.admission_number || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>GR Number</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.gr_number || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Roll Number</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>#{student.roll_number || 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Admission Date</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{formatDate(student.admission_date)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Student Status</div>
              <div style={{ fontWeight: '600', marginTop: '2px', color: 'var(--success-text)' }}>{student.student_status || 'Enrolled'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Medium</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.medium_name || student.custom_medium_name || 'English Medium'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Affiliation Board</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.board_name || student.custom_board_name || 'GSEB'}</div>
            </div>
          </div>
        </div>

        {/* 2. Personal Information */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👤</span> Personal Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Full Name</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.name}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Date of Birth</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{formatDate(student.dob)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Gender</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.gender || 'Not Specified'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Blood Group</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>
                <span className="badge badge-primary" style={{ padding: '2px 8px' }}>{student.blood_group || 'B+'}</span>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Email Address</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.email || 'N/A'}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Phone Number</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.phone_number || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* 3. Contact & Emergency Details */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📍</span> Contact & Residential Address
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Residential Address</div>
              <div style={{ fontWeight: '600', marginTop: '2px', lineHeight: '1.4' }}>
                {student.address || 'Vadodara, Gujarat, India'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Pincode</div>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{student.pincode || '390001'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Emergency Contact</div>
                <div style={{ fontWeight: '600', marginTop: '2px', color: 'var(--danger-text)' }}>
                  🚨 {student.emergency_contact_number || student.phone_number || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Guardian / Parent Information */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👨‍👩‍👧</span> Parent & Guardian Information
          </h3>
          {parents.length > 0 ? (
            parents.map((p, idx) => (
              <div key={p.parent_id || idx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: idx < parents.length - 1 ? '10px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{p.name}</span>
                  <span className="badge badge-success">Guardian</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📞 <strong>Phone:</strong> {p.phone || 'N/A'}</div>
                  <div>📧 <strong>Email:</strong> {p.email || 'N/A'}</div>
                  {p.telegram_chat_id && <div>💬 <strong>Telegram ID:</strong> {p.telegram_chat_id}</div>}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Primary emergency guardian phone: {student.emergency_contact_number || 'On File'}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default ProfileTab;
