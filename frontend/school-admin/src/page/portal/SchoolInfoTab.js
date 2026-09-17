import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

function SchoolInfoTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    school_code: '',
    address: '',
    contact_number: '',
    email_id: '',
    logo: '',
    website_link: '',
    working_hours: '',
    bank_details: '',
    telegram_channel_id: ''
  });

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/school', token, handleLogout);
        if (res.success && res.data) {
          setSchoolForm({
            name: res.data.name || '',
            school_code: res.data.school_code || '',
            address: res.data.address || '',
            contact_number: res.data.contact_number || '',
            email_id: res.data.email_id || '',
            logo: res.data.logo || '',
            website_link: res.data.website_link || '',
            working_hours: res.data.working_hours || '',
            bank_details: res.data.bank_details || '',
            telegram_channel_id: res.data.telegram_channel_id || ''
          });
        }
      } catch (err) {
        console.error('Failed to load school profile', err);
        setError('Failed to load school profile information.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSchoolInfo();
    }
  }, [token, handleLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!schoolForm.name || !schoolForm.school_code) {
      setError('School Name and School Code are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiFetch('/school', token, handleLogout, {
        method: 'PUT',
        body: JSON.stringify(schoolForm)
      });
      if (res.success) {
        setSuccess('School profile updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update school profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading school profile...</div>;
  }

  return (
    <div className="panel-card" style={{ maxWidth: '800px' }}>
      <h2 className="panel-card-title" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        My School Profile
      </h2>

      {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
      {success && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', marginBottom: '16px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">School Name *</label>
            <input 
              type="text" 
              className="form-input" 
              value={schoolForm.name} 
              onChange={e => setSchoolForm({...schoolForm, name: e.target.value})}
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">School Code *</label>
            <input 
              type="text" 
              className="form-input" 
              value={schoolForm.school_code} 
              onChange={e => setSchoolForm({...schoolForm, school_code: e.target.value})}
              required 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Contact Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={schoolForm.contact_number} 
              onChange={e => setSchoolForm({...schoolForm, contact_number: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={schoolForm.email_id} 
              onChange={e => setSchoolForm({...schoolForm, email_id: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Website URL</label>
            <input 
              type="url" 
              className="form-input" 
              value={schoolForm.website_link} 
              onChange={e => setSchoolForm({...schoolForm, website_link: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Working Hours</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Mon-Fri 8:00 AM - 4:00 PM"
              value={schoolForm.working_hours} 
              onChange={e => setSchoolForm({...schoolForm, working_hours: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Logo Path or URL</label>
            <input 
              type="text" 
              className="form-input" 
              value={schoolForm.logo} 
              onChange={e => setSchoolForm({...schoolForm, logo: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Telegram Channel ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. -1001234567"
              value={schoolForm.telegram_channel_id} 
              onChange={e => setSchoolForm({...schoolForm, telegram_channel_id: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
            <label className="input-label">Postal Address</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '60px', padding: '10px 14px' }}
              value={schoolForm.address} 
              onChange={e => setSchoolForm({...schoolForm, address: e.target.value})}
            />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
            <label className="input-label">Bank Details</label>
            <textarea 
              className="form-input" 
              placeholder="Bank Name, Account Number, IFSC Code..."
              style={{ minHeight: '60px', padding: '10px 14px' }}
              value={schoolForm.bank_details} 
              onChange={e => setSchoolForm({...schoolForm, bank_details: e.target.value})}
            />
          </div>
          
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SchoolInfoTab;
