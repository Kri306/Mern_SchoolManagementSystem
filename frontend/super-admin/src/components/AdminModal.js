import React from 'react';
import * as Icons from './Icons';

function AdminModal({ onClose, onSubmit, formState, setFormState, schools, error, success, isSubmitting }) {
  return (
    <div className="modal-overlay-panel">
      <div className="modal-content-card">
        <div className="modal-header-section">
          <h3 className="modal-header-title">Create School Admin Account</h3>
          <button className="modal-close-icon" onClick={onClose}><Icons.Close /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body-section">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="modal-form-grid">
              <div className="input-group span-full">
                <label className="input-label">Select Associated School *</label>
                <select
                  className="form-select-control"
                  value={formState.school_id}
                  onChange={(e) => setFormState({ ...formState, school_id: e.target.value })}
                  required
                >

                  <option value="">-- Choose School --</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.school_code})</option>
                  ))}
                </select>
              </div>           


              <div className="input-group">
                <label className="input-label">Administrator Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. John Doe"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Admin Email Address *</label>
                <input
                  type="email"
                  className="form-input"           
                  style={{ paddingLeft: '14px' }}
                  placeholder="admin@school.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                />

              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="+1 (555) 123-4567"
                  value={formState.phone_number}
                  onChange={(e) => setFormState({ ...formState, phone_number: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Portal Account Password *</label>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="••••••••"
                  value={formState.password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
          <div className="modal-footer-section">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;
