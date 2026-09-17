import React, { useState, useEffect } from 'react';
import * as Icons from '../components/Icons';
import { API_BASE_URL } from '../utils/api';

function Register({ onRegisterSuccess, onNavigateToLogin }) {
  // Dropdown Lists for Registration
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);

  // Registration View States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSchoolId, setRegSchoolId] = useState('');
  const [regBranchId, setRegBranchId] = useState('');
  const [regRole, setRegRole] = useState('student'); // 'student' or 'parent'
  
  // Student Specific Fields
  const [studentUniqueId, setStudentUniqueId] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');

  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Fetch schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  // Fetch branches when school changes
  useEffect(() => {
    if (regSchoolId) {
      fetchBranches(regSchoolId);
    } else {
      setBranches([]);
      setRegBranchId('');
    }
  }, [regSchoolId]);

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/schools`);
      const data = await response.json();
      if (data.success) setSchools(data.data || []);
    } catch (err) {
      console.error('Failed to fetch schools', err);
    }
  };

  const fetchBranches = async (schoolId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/branches/${schoolId}`);
      const data = await response.json();
      if (data.success) setBranches(data.data || []);
    } catch (err) {
      console.error('Failed to fetch branches', err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!regName || !regEmail || !regSchoolId || !regBranchId || !regRole || !regPassword) {
      setRegError('All fields marked with * are required');
      return;
    }

    if (regRole === 'student' && (!studentUniqueId || !admissionNumber)) {
      setRegError('Unique Student ID and Admission Number are required for Student Registration');
      return;
    }

    setRegLoading(true);
    setRegError('');
    setRegSuccess('');

    try {
      const payload = {
        name: regName,
        email: regEmail,
        phone_number: regPhone,
        school_id: parseInt(regSchoolId),
        branch_id: parseInt(regBranchId),
        role: regRole,
        password: regPassword
      };

      if (regRole === 'student') {
        payload.student_unique_id = studentUniqueId;
        payload.admission_number = admissionNumber;
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setRegError(data.message || 'Registration failed.');
        setRegLoading(false);
        return;
      }

      setRegSuccess('Account registered successfully! Redirecting to login...');
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegSchoolId('');
      setRegBranchId('');
      setRegRole('student');
      setStudentUniqueId('');
      setAdmissionNumber('');

      setTimeout(() => {
        onRegisterSuccess();
        setRegSuccess('');
      }, 2000);
    } catch (err) {
      setRegError('Connection to server failed');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '520px' }}>
        <div className="login-header">
          <div className="login-logo">
            <Icons.SwirlLogo />
          </div>
          <h1 className="login-title">Student & Parent Registration</h1>
          <p className="login-subtitle">Institution & Account Credentials</p>
        </div>

        {regError && <div className="alert alert-error"><span>{regError}</span></div>}
        {regSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}><span>{regSuccess}</span></div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Account Role Type *</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  <input 
                    type="radio" 
                    name="regRole" 
                    value="student" 
                    checked={regRole === 'student'} 
                    onChange={() => setRegRole('student')} 
                  />
                  Student
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  <input 
                    type="radio" 
                    name="regRole" 
                    value="parent" 
                    checked={regRole === 'parent'} 
                    onChange={() => setRegRole('parent')} 
                  />
                  Parent
                </label>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Alice Smith" value={regName} onChange={e => setRegName(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Email Address *</label>
              <input type="email" className="form-input" placeholder="example@school.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Phone Number</label>
                <input type="text" className="form-input" placeholder="+12345678" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
              </div>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Password *</label>
                <input type="password" className="form-input" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Select School *</label>
                <select className="form-input" value={regSchoolId} onChange={e => setRegSchoolId(e.target.value)} required>
                  <option value="">-- Choose School --</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="input-label">Select Branch *</label>
                <select className="form-input" value={regBranchId} onChange={e => setRegBranchId(e.target.value)} disabled={!regSchoolId} required>
                  <option value="">-- Choose Branch --</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                </select>
              </div>
            </div>

            {regRole === 'student' && (
              <div style={{ display: 'flex', gap: '12px', animation: 'fadeIn 0.2s ease' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">Student Unique ID *</label>
                  <input type="text" className="form-input" placeholder="e.g. ST001" value={studentUniqueId} onChange={e => setStudentUniqueId(e.target.value)} required />
                </div>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="input-label">Admission Number *</label>
                  <input type="text" className="form-input" placeholder="e.g. ADM001" value={admissionNumber} onChange={e => setAdmissionNumber(e.target.value)} required />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={regLoading} style={{ marginTop: '20px', marginBottom: '16px' }}>
            {regLoading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button type="button" onClick={onNavigateToLogin} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
