import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function SchoolInfoTab({ token, user, selectedChildId, handleLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchoolInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const fetchSchoolInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedChildId
        ? `/dashboard/school-info?student_id=${selectedChildId}`
        : '/dashboard/school-info';
      const res = await apiFetch(endpoint, token, handleLogout);
      if (res && res.success) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to load school information');
      }
    } catch (err) {
      setError(err.message || 'Error loading school information');
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
          <button className="btn btn-secondary" onClick={fetchSchoolInfo} style={{ marginLeft: '10px', padding: '2px 8px', fontSize: '12px' }}>Retry</button>
        </div>
      </div>
    );
  }

  const school = data?.school;
  const branch = data?.branch;
  const allBranches = data?.allBranches || [];

  return (
    <div className="tab-content-container">

      {/* 🏫 School Header Banner */}
      <div 
        className="table-container" 
        style={{ 
          padding: '28px 32px', 
          marginBottom: '24px',
          background: 'linear-gradient(to right, #ffffff, #f8fafc)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '16px', 
              background: '#eef2ff', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '32px'
            }}
          >
            🏫
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>
                {school?.name || 'Gujarat Public School'}
              </h2>
              <span className="badge badge-primary">{school?.school_code || 'GPS-GUJ-01'}</span>
            </div>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
              📍 {school?.address || 'Vadodara, Gujarat, India'}
            </p>
            <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              🕒 Working Hours: {school?.working_hours || '08:00 AM - 04:00 PM (Mon - Sat)'}
            </p>
          </div>
        </div>

        {school?.website_link && (
          <a 
            href={school.website_link} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary"
            style={{ fontSize: '13px' }}
          >
            Visit School Portal ↗
          </a>
        )}
      </div>

      {/* Info Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* 🏢 Enrolled Branch Details */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📍</span> Your Enrolled Campus & Branch
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Branch Name</div>
              <div style={{ fontWeight: '700', fontSize: '15px', marginTop: '2px' }}>
                {branch?.branch_name || 'Vadodara Main Branch'}
                {branch?.is_main_branch === 1 && (
                  <span className="badge badge-success" style={{ marginLeft: '8px', fontSize: '11px' }}>Main Branch</span>
                )}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Principal</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{branch?.principal_name || 'Prof. Rajesh Patel'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Contact Person</div>
              <div style={{ fontWeight: '600', marginTop: '2px' }}>{branch?.contact_person || 'Office Administration'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Branch Phone</div>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{branch?.contact_number || '+91 98980 11000'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Branch Email</div>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{branch?.branch_email || 'info@gpsgujarat.ac.in'}</div>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Branch Address</div>
              <div style={{ fontWeight: '600', marginTop: '2px', lineHeight: '1.4' }}>
                {branch?.address || 'Near Akshar Chowk, Vadodara, Gujarat'}
              </div>
            </div>
          </div>
        </div>

        {/* 🏦 Fee & Banking Details */}
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏦</span> Fee Inquiry & Official Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--primary)' }}>Official Bank Details (For Fee Deposits)</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {school?.bank_details || 'Bank of Baroda, Vadodara Main Branch\nA/C No: 1234002100056789\nIFSC Code: BARB0VADODA'}
              </p>
            </div>

            {school?.telegram_channel_id && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontWeight: '700', marginBottom: '4px', color: '#15803d' }}>📢 School Broadcast Channel</div>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
                  Telegram Updates: <strong>@{school.telegram_channel_id}</strong>
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <div>📧 <strong>Head Office Email:</strong> {school?.email_id || 'contact@gpsgujarat.ac.in'}</div>
              <div>📞 <strong>Helpdesk Hotline:</strong> {school?.contact_number || '+91 265 2334455'}</div>
            </div>
          </div>
        </div>

      </div>

      {/* 🌐 All School Campuses / Branches */}
      {allBranches.length > 1 && (
        <div className="table-container" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>
            🏫 All Network Campuses ({allBranches.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {allBranches.map(b => (
              <div key={b.id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>
                  {b.branch_name}
                  {b.is_main_branch === 1 && <span className="badge badge-primary" style={{ marginLeft: '6px', fontSize: '10px' }}>Main</span>}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Principal: {b.principal_name || 'N/A'} • Contact: {b.contact_number || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {b.address || 'Gujarat, India'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default SchoolInfoTab;
