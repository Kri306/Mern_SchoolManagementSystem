import React, { useState, useEffect } from 'react';
import * as Icons from '../components/Icons';

function Register({ onNavigateToLogin }) {
  const [schools, setSchools] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [schoolOption, setSchoolOption] = useState('select'); // 'select' or 'create'

  // Admin form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');

  // School creation form
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolContact, setSchoolContact] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [schoolWebsite, setSchoolWebsite] = useState('');
  const [schoolWorkingHours, setSchoolWorkingHours] = useState('');
  const [schoolBankDetails, setSchoolBankDetails] = useState('');
  const [schoolTelegram, setSchoolTelegram] = useState('');

  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setIsLoadingSchools(true);
    try {
      const response = await fetch('http://localhost:5002/api/school-admin/auth/schools');
      const data = await response.json();
      if (data.success) {
        setSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (!name || !email || !password) {
      setRegisterError('Admin Name, Email, and Password are required.');
      return;
    }

    if (schoolOption === 'select' && !schoolId) {
      setRegisterError('Please select a school.');
      return;
    }

    if (schoolOption === 'create' && (!schoolName || !schoolCode)) {
      setRegisterError('School Name and School Code are required for registering a new school.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone_number: phone,
        password,
        school_id: schoolOption === 'select' ? parseInt(schoolId, 10) : null,
        school_name: schoolOption === 'create' ? schoolName : undefined,
        school_code: schoolOption === 'create' ? schoolCode : undefined,
        school_address: schoolOption === 'create' ? schoolAddress : undefined,
        school_contact: schoolOption === 'create' ? schoolContact : undefined,
        school_email: schoolOption === 'create' ? schoolEmail : undefined,
        school_logo: schoolOption === 'create' ? schoolLogo : undefined,
        school_website: schoolOption === 'create' ? schoolWebsite : undefined,
        school_working_hours: schoolOption === 'create' ? schoolWorkingHours : undefined,
        school_bank_details: schoolOption === 'create' ? schoolBankDetails : undefined,
        school_telegram: schoolOption === 'create' ? schoolTelegram : undefined
      };

      const response = await fetch('http://localhost:5002/api/school-admin/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        setRegisterSuccess(data.message || 'Registration request sent successfully! Awaiting Super Admin approval.');
        setTimeout(() => {
          onNavigateToLogin();
        }, 3000);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setRegisterError(err.message || 'Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '520px' }}>
        <div className="login-header">
          <div className="login-logo">
            <Icons.SwirlLogo />
          </div>
          <h1 className="login-title">School Admin Registration</h1>
          <p className="login-subtitle">Institution & Administrator Credentials</p>
        </div>

        {registerError && (
          <div className="alert alert-error">
            <span>{registerError}</span>
          </div>
        )}

        {registerSuccess && (
          <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success)' }}>
            <span>{registerSuccess}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Institution Options */}
          <div style={{ marginBottom: '20px' }}>
            <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Choose School Option</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px', 
                  border: `1px solid ${schoolOption === 'select' ? 'var(--primary)' : 'var(--border-light)'}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  backgroundColor: schoolOption === 'select' ? 'var(--primary-light)' : 'transparent',
                  fontWeight: '500',
                  fontSize: '13.5px'
                }}
              >
                <input 
                  type="radio" 
                  name="schoolOption" 
                  value="select" 
                  checked={schoolOption === 'select'}
                  onChange={() => setSchoolOption('select')}
                />
                Select Existing School
              </label>

              <label 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px', 
                  border: `1px solid ${schoolOption === 'create' ? 'var(--primary)' : 'var(--border-light)'}`, 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  backgroundColor: schoolOption === 'create' ? 'var(--primary-light)' : 'transparent',
                  fontWeight: '500',
                  fontSize: '13.5px'
                }}
              >
                <input 
                  type="radio" 
                  name="schoolOption" 
                  value="create" 
                  checked={schoolOption === 'create'}
                  onChange={() => setSchoolOption('create')}
                />
                Register New School
              </label>
            </div>
          </div>

          {/* Option A: Select Existing School */}
          {schoolOption === 'select' && (
            <div className="input-group">
              <label className="input-label">Select School</label>
              <div className="input-wrapper">
                <select
                  className="form-input"
                  style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%' }}
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  disabled={isLoadingSchools}
                > 
                  <option value="">-- Choose School --</option>
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.school_code})
                    </option>
                  ))}
                </select>
                {isLoadingSchools && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    Loading...
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Option B: Register New School */}
          {schoolOption === 'create' && (
            <fieldset style={{ border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <legend style={{ padding: '0 8px', fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>School details</legend>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">School Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Greenwood High School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required={schoolOption === 'create'}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">School Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="GHS001"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    required={schoolOption === 'create'}
                  />
                </div>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">School Contact</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+12345678"
                    value={schoolContact}
                    onChange={(e) => setSchoolContact(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">School Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="info@greenwood.com"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">School Website</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="www.greenwood.com"
                    value={schoolWebsite}
                    onChange={(e) => setSchoolWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">School Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="123 Education Lane, NY"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                />
              </div>
            </fieldset>
          )}

          {/* Admin Credentials Details */}
          <fieldset style={{ border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <legend style={{ padding: '0 8px', fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Administrator credentials</legend>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Admin Name *</label>
              <div className="input-wrapper">
                <span className="input-icon"><Icons.Mail style={{ visibility: 'hidden' }} /></span>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Admin Email *</label>
              <div className="input-wrapper">
                <span className="input-icon"><Icons.Mail /></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Admin Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+198765432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Admin Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </fieldset>
          
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
            style={{ marginBottom: '16px' }}
          >
            {isSubmitting ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="0"></circle></svg>
                Registering...
              </>
            ) : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onNavigateToLogin}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              fontWeight: '600', 
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit'
            }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
