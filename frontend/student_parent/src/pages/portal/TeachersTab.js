import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function TeachersTab({ token, user, selectedChildId, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/teachers?student_id=${selectedChildId}`
        : '/dashboard/teachers';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load teachers');
      }
    } catch (err) {
      setError(err.message || 'Error loading teachers');
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
          <button className="btn btn-secondary" onClick={fetchTeachers} style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const classTeacher = data?.classTeacher;
  const faculty = data?.faculty || [];

  const filteredFaculty = faculty.filter(f => {
    const q = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.department_name?.toLowerCase().includes(q) ||
      f.qualification?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="tab-content-container">

      {/* 👨‍🏫 Class Teacher Spotlight Card */}
      {classTeacher && (
        <div 
          className="table-container" 
          style={{ 
            padding: '28px 32px', 
            marginBottom: '24px',
            background: 'linear-gradient(to right, #ffffff, #fcfaff)',
            borderLeft: '4px solid #6366f1'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div 
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                background: '#e0e7ff', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '700'
              }}
            >
              {classTeacher.name ? classTeacher.name.charAt(0).toUpperCase() : 'T'}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{classTeacher.name}</h2>
                <span className="badge badge-success">Assigned Class Teacher</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                {classTeacher.qualification || 'Educator'} • Department: <strong>{classTeacher.department_name || 'Academic'}</strong>
              </p>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                📍 Office Location: {classTeacher.office_location || 'Staff Room A'} • Experience: {classTeacher.experience || '5+ Years'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '12px 18px', borderRadius: '10px', fontSize: '13px' }}>
              <div>📧 <strong>Email:</strong> {classTeacher.email || 'N/A'}</div>
              <div>📞 <strong>Phone:</strong> {classTeacher.phone_number || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 📚 School Faculty & Teachers Directory */}
      <div className="table-container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
              🏫 Campus Faculty Directory ({filteredFaculty.length})
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Teaching and academic staff members at your school branch
            </p>
          </div>

          <div style={{ width: '260px' }}>
            <input 
              type="text"
              placeholder="Search faculty by name/subject..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
        </div>

        {filteredFaculty.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredFaculty.map((teacher) => (
              <div 
                key={teacher.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div 
                  style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    background: '#f1f5f9', 
                    color: 'var(--text-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}
                >
                  {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'T'}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {teacher.name}
                    </h4>
                    <span className="badge badge-primary" style={{ fontSize: '11px', padding: '2px 6px' }}>
                      {teacher.department_name || 'Teacher'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {teacher.qualification || 'Educator'}
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📧 {teacher.email || 'N/A'}
                    </div>
                    <div>
                      📞 {teacher.phone_number || 'N/A'}
                    </div>
                    <div>
                      📍 {teacher.office_location || 'Campus Office'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No teachers found matching your search.
          </div>
        )}
      </div>

    </div>
  );
}

export default TeachersTab;
