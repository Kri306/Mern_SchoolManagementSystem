import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function ClassScheduleTab({ token, user, selectedChildId, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/schedule?student_id=${selectedChildId}`
        : '/dashboard/schedule';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load class schedule');
      }
    } catch (err) {
      setError(err.message || 'Error loading class schedule');
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
          <button className="btn btn-secondary" onClick={fetchSchedule} style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const batch = data?.batch;
  const classmates = data?.classmates || [];

  const filteredClassmates = classmates.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.roll_number?.toLowerCase().includes(q) ||
      c.student_unique_id?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="tab-content-container">

      {/* 🕒 Class & Batch Details Banner */}
      <div 
        className="table-container" 
        style={{ 
          padding: '24px 30px', 
          marginBottom: '24px',
          borderLeft: '4px solid var(--primary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">{batch?.batch_code || 'GPS-VAD-9A'}</span>
              <span className="badge badge-success">{batch?.status || 'Active Batch'}</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0' }}>
              {batch?.class_name || 'Class 9'} - {batch?.section_name || 'Section A'}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
              Academic Year: <strong>{batch?.academic_year_name || '2026-2027'}</strong> • Room: <strong>{batch?.room_number || 'Room 101'}</strong> • Location: <strong>{batch?.class_location || 'Main Building, 1st Floor'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Daily Timings</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)', marginTop: '2px' }}>
                {batch?.start_time && batch?.end_time ? `${batch.start_time.slice(0,5)} - ${batch.end_time.slice(0,5)}` : '08:30 - 13:30'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Duration</div>
              <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '2px' }}>
                {batch?.duration_minutes ? `${batch.duration_minutes} Mins` : '300 Mins'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Capacity</div>
              <div style={{ fontSize: '15px', fontWeight: '700', marginTop: '2px' }}>
                {batch?.student_capacity ? `${classmates.length} / ${batch.student_capacity}` : `${classmates.length} Students`}
              </div>
            </div>
          </div>
        </div>

        {/* Medium & Teacher quick note */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <div>🗣️ <strong>Medium:</strong> {batch?.medium_name || batch?.custom_medium_name || 'English Medium'}</div>
          <div>📜 <strong>Board:</strong> {batch?.board_name || batch?.custom_board_name || 'Gujarat State Board (GSEB)'}</div>
          <div>👨‍🏫 <strong>Class Teacher:</strong> {batch?.teacher_name || 'Assigned Educator'} ({batch?.teacher_qualification || 'B.Ed, M.Sc'})</div>
        </div>
      </div>

      {/* 👥 Classmates Directory Table */}
      <div className="table-container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
              👥 Classmates & Peer Directory ({filteredClassmates.length})
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Students currently enrolled in {batch?.batch_code || 'this batch'}
            </p>
          </div>

          <div style={{ width: '260px' }}>
            <input 
              type="text"
              placeholder="Search classmates by name/roll..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>
        </div>

        {filteredClassmates.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Roll #</th>
                  <th style={{ padding: '12px 16px' }}>Student Name</th>
                  <th style={{ padding: '12px 16px' }}>Student ID</th>
                  <th style={{ padding: '12px 16px' }}>Admission No</th>
                  <th style={{ padding: '12px 16px' }}>Gender</th>
                  <th style={{ padding: '12px 16px' }}>Blood Group</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassmates.map((student) => (
                  <tr key={student.student_id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--primary)' }}>
                      #{student.roll_number || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: '#eef2ff', 
                            color: 'var(--primary)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}
                        >
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <span style={{ fontWeight: '600' }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {student.student_unique_id || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {student.admission_number || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {student.gender || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {student.blood_group ? (
                        <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                          {student.blood_group}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-success" style={{ fontSize: '11px' }}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No classmates match your search criteria.
          </div>
        )}
      </div>

    </div>
  );
}

export default ClassScheduleTab;
