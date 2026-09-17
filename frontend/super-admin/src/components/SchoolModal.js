import React from 'react';
import * as Icons from './Icons';

function SchoolModal({ onClose, onSubmit, formState, setFormState, error, success, isSubmitting }) {
  return (
    <div className="modal-overlay-panel">
      <div className="modal-content-card">
        <div className="modal-header-section">
          <h3 className="modal-header-title">Register New Institution</h3>
          <button className="modal-close-icon" onClick={onClose}><Icons.Close /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body-section">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            <div className="modal-form-grid">
              <div className="input-group">
                <label className="input-label">School Name *</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Green Valley Academy"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">School Code *</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. GVA001"
                  value={formState.school_code}
                  onChange={(e) => setFormState({ ...formState, school_code: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="contact@school.com"
                  value={formState.email_id || ''}
                  onChange={(e) => setFormState({ ...formState, email_id: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Contact Number</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="+1 (555) 123-4567"
                  value={formState.contact_number || ''}
                  onChange={(e) => setFormState({ ...formState, contact_number: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">School Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="https://school.com"
                  value={formState.website_link || ''}
                  onChange={(e) => setFormState({ ...formState, website_link: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">School Logo URL</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="https://imgur.com/logo.png"
                  value={formState.logo || ''}
                  onChange={(e) => setFormState({ ...formState, logo: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Working Hours</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Mon-Fri: 8:00 AM - 3:00 PM"
                  value={formState.working_hours || ''}
                  onChange={(e) => setFormState({ ...formState, working_hours: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Telegram Channel ID</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="@gva_telegram"
                  value={formState.telegram_channel_id || ''}
                  onChange={(e) => setFormState({ ...formState, telegram_channel_id: e.target.value })}
                />
              </div>

              <div className="input-group span-full">
                <label className="input-label">Physical Address</label>
                <textarea
                  className="form-input"
                  style={{ paddingLeft: '14px', minHeight: '60px', resize: 'vertical' }}
                  placeholder="Street, City, Country"
                  value={formState.address || ''}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                />
              </div>

              <div className="input-group span-full">
                <label className="input-label">Bank Account Details</label>
                <textarea
                  className="form-input"
                  style={{ paddingLeft: '14px', minHeight: '60px', resize: 'vertical' }}
                  placeholder="Bank Name, IBAN, Swift Code..."
                  value={formState.bank_details || ''}
                  onChange={(e) => setFormState({ ...formState, bank_details: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer-section">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SchoolModal;
