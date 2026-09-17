import React, { useState, useEffect } from 'react';
import * as Icons from '../../components/Icons';
import { apiFetch } from '../../utils/api';

function ClassesSectionsTab({ token, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [masterClasses, setMasterClasses] = useState([]);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Modals state
  const [showClassModal, setShowClassModal] = useState(false);
  const [classModalMode, setClassModalMode] = useState('add_master'); // 'add_master', 'assign_branch', 'edit_assignment'
  const [selectedSchoolClassId, setSelectedSchoolClassId] = useState(null);
  const [classForm, setClassForm] = useState({
    class_name: '',
    display_order: '',
    class_id: '',
    branch_id: '',
    location: '',
    student_capacity: 40,
    status: 'Active'
  });
  const [classError, setClassError] = useState('');
  const [classSuccess, setClassSuccess] = useState('');

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionModalMode, setSectionModalMode] = useState('add');
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    section_name: '',
    room_number: '',
    status: 'Active'
  });
  const [sectionError, setSectionError] = useState('');
  const [sectionSuccess, setSectionSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const mcRes = await apiFetch('/classes/master', token, handleLogout);
      if (mcRes.success) setMasterClasses(mcRes.data || []);

      const scRes = await apiFetch('/classes', token, handleLogout);
      if (scRes.success) setSchoolClasses(scRes.data || []);

      const secRes = await apiFetch('/sections', token, handleLogout);
      if (secRes.success) setSections(secRes.data || []);

      const brRes = await apiFetch('/branches', token, handleLogout);
      if (brRes.success) {
        setBranches(brRes.data || []);
        if (brRes.data.length > 0) setSelectedBranchId(brRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load classes/sections data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadBranchClasses = async (branchId) => {
    setSelectedBranchId(branchId);
    try {
      const res = await apiFetch(`/classes?branch_id=${branchId}`, token, handleLogout);
      if (res.success) {
        setSchoolClasses(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    setClassError('');
    setClassSuccess('');
    setIsSubmitting(true);

    try {
      let res;
      if (classModalMode === 'add_master') {
        res = await apiFetch('/classes/master', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify({
            class_name: classForm.class_name,
            display_order: parseInt(classForm.display_order || 0, 10)
          })
        });
      } else if (classModalMode === 'assign_branch') {
        res = await apiFetch('/classes', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify({
            class_id: parseInt(classForm.class_id, 10),
            branch_id: parseInt(classForm.branch_id, 10),
            location: classForm.location,
            student_capacity: parseInt(classForm.student_capacity, 10)
          })
        });
      } else {
        res = await apiFetch(`/classes/${selectedSchoolClassId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify({
            branch_id: parseInt(classForm.branch_id, 10),
            location: classForm.location,
            student_capacity: parseInt(classForm.student_capacity, 10),
            status: classForm.status
          })
        });
      }

      if (res.success) {
        setClassSuccess('Class details saved successfully!');
        loadData();
        setTimeout(() => {
          setShowClassModal(false);
        }, 1200);
      }
    } catch (err) {
      setClassError(err.message || 'Failed to save class info.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    setSectionError('');
    setSectionSuccess('');
    setIsSubmitting(true);

    try {
      let res;
      if (sectionModalMode === 'add') {
        res = await apiFetch('/sections', token, handleLogout, {
          method: 'POST',
          body: JSON.stringify(sectionForm)
        });
      } else {
        res = await apiFetch(`/sections/${selectedSectionId}`, token, handleLogout, {
          method: 'PUT',
          body: JSON.stringify(sectionForm)
        });
      }

      if (res.success) {
        setSectionSuccess('Section details saved successfully!');
        loadData();
        setTimeout(() => {
          setShowSectionModal(false);
        }, 1200);
      }
    } catch (err) {
      setSectionError(err.message || 'Failed to save section details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSchoolClassStatus = async (id) => {
    try {
      const res = await apiFetch(`/classes/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadBranchClasses(selectedBranchId);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSectionStatus = async (id) => {
    try {
      const res = await apiFetch(`/sections/${id}/status`, token, handleLogout, {
        method: 'PUT'
      });
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddMasterClass = () => {
    setClassForm({ class_name: '', display_order: '', class_id: '', branch_id: '', location: '', student_capacity: 40, status: 'Active' });
    setClassModalMode('add_master');
    setClassError('');
    setClassSuccess('');
    setShowClassModal(true);
  };

  const openAssignClass = () => {
    setClassForm({
      class_name: '',
      display_order: '',
      class_id: masterClasses[0]?.class_id || '',
      branch_id: selectedBranchId || branches[0]?.id || '',
      location: '',
      student_capacity: 40,
      status: 'Active'
    });
    setClassModalMode('assign_branch');
    setClassError('');
    setClassSuccess('');
    setShowClassModal(true);
  };

  const openEditClassAssignment = (sc) => {
    setClassForm({
      class_name: sc.class_name,
      display_order: '',
      class_id: sc.class_id,
      branch_id: selectedBranchId || branches[0]?.id || '',
      location: sc.location || '',
      student_capacity: sc.student_capacity || 40,
      status: sc.status || 'Active'
    });
    setSelectedSchoolClassId(sc.school_class_id);
    setClassModalMode('edit_assignment');
    setClassError('');
    setClassSuccess('');
    setShowClassModal(true);
  };

  const openAddSection = () => {
    setSectionForm({ section_name: '', room_number: '', status: 'Active' });
    setSectionModalMode('add');
    setSectionError('');
    setSectionSuccess('');
    setShowSectionModal(true);
  };

  const openEditSection = (s) => {
    setSectionForm({
      section_name: s.section_name || '',
      room_number: s.room_number || '',
      status: s.status || 'Active'
    });
    setSelectedSectionId(s.section_id);
    setSectionModalMode('edit');
    setSectionError('');
    setSectionSuccess('');
    setShowSectionModal(true);
  };

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading classes and sections...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
      
      {/* Classes Management */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h2 className="panel-card-title">School Classes</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={openAddMasterClass} style={{ padding: '6px 10px', fontSize: '12px' }}>
              Create Master Class
            </button>
            <button className="btn btn-primary" onClick={openAssignClass} style={{ padding: '6px 10px', fontSize: '12px' }}>
              <Icons.Plus /> Link Class to Branch
            </button>
          </div>
        </div>

        <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Filter by Branch:</label>
          <select 
            className="form-input" 
            value={selectedBranchId} 
            onChange={(e) => loadBranchClasses(e.target.value)}
            style={{ maxWidth: '240px', padding: '6px 10px', fontSize: '13px' }}
          >
            {branches.map(br => (
              <option key={br.id} value={br.id}>{br.branch_name}</option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="clean-table">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Physical Location</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schoolClasses.map(sc => (
                <tr key={sc.school_class_id}>
                  <td style={{ fontWeight: '600' }}>{sc.class_name}</td>
                  <td>{sc.location || 'Not Specified'}</td>
                  <td>{sc.student_capacity} students</td>
                  <td>
                    <span 
                      className={`status-badge ${sc.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                      onClick={() => toggleSchoolClassStatus(sc.school_class_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {sc.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => openEditClassAssignment(sc)}
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {schoolClasses.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No classes mapped to this branch campus.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sections Management */}
      <div className="panel-card">
        <div className="panel-card-header">
          <h2 className="panel-card-title">Sections ({sections.length})</h2>
          <button className="btn btn-primary" onClick={openAddSection}>
            <Icons.Plus /> Add Section
          </button>
        </div>

        <div className="table-responsive" style={{ marginTop: '16px' }}>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Room No</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(s => (
                <tr key={s.section_id}>
                  <td style={{ fontWeight: '600' }}>{s.section_name}</td>
                  <td>{s.room_number || 'N/A'}</td>
                  <td>
                    <span 
                      className={`status-badge ${s.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
                      onClick={() => toggleSectionStatus(s.section_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => openEditSection(s)}
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {sections.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '16px' }}>No sections added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Modal */}
      {showClassModal && (
        <div className="modal-overlay-panel" onClick={() => setShowClassModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">
                {classModalMode === 'add_master' && 'Create Master Class'}
                {classModalMode === 'assign_branch' && 'Link Class to Branch'}
                {classModalMode === 'edit_assignment' && `Edit Class Assignment: ${classForm.class_name}`}
              </h3>
              <button className="modal-close-icon" onClick={() => setShowClassModal(false)}>✕</button>
            </div>
            <form onSubmit={handleClassSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {classError && <div className="alert alert-error">{classError}</div>}
                {classSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{classSuccess}</div>}

                {classModalMode === 'add_master' && (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Class Level Name *</label>
                      <input type="text" className="form-input" placeholder="e.g. Grade 10" value={classForm.class_name} onChange={e => setClassForm({...classForm, class_name: e.target.value})} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Display/Sort Order</label>
                      <input type="number" className="form-input" placeholder="e.g. 10" value={classForm.display_order} onChange={e => setClassForm({...classForm, display_order: e.target.value})} />
                    </div>
                  </>
                )}

                {classModalMode === 'assign_branch' && (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Select Master Class *</label>
                      <select className="form-input" value={classForm.class_id} onChange={e => setClassForm({...classForm, class_id: e.target.value})} required>
                        {masterClasses.map(c => (
                          <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Target Branch Campus *</label>
                      <select className="form-input" value={classForm.branch_id} onChange={e => setClassForm({...classForm, branch_id: e.target.value})} required>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.branch_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Physical Location (Room/Hall)</label>
                      <input type="text" className="form-input" placeholder="e.g. Building A, Room 101" value={classForm.location} onChange={e => setClassForm({...classForm, location: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Student Capacity</label>
                      <input type="number" className="form-input" value={classForm.student_capacity} onChange={e => setClassForm({...classForm, student_capacity: e.target.value})} />
                    </div>
                  </>
                )}

                {classModalMode === 'edit_assignment' && (
                  <>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Selected Branch Campus *</label>
                      <select className="form-input" value={classForm.branch_id} onChange={e => setClassForm({...classForm, branch_id: e.target.value})} required>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.branch_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Physical Location (Room/Hall)</label>
                      <input type="text" className="form-input" placeholder="e.g. Building A, Room 101" value={classForm.location} onChange={e => setClassForm({...classForm, location: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Student Capacity</label>
                      <input type="number" className="form-input" value={classForm.student_capacity} onChange={e => setClassForm({...classForm, student_capacity: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Status</label>
                      <select className="form-input" value={classForm.status} onChange={e => setClassForm({...classForm, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowClassModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <div className="modal-overlay-panel" onClick={() => setShowSectionModal(false)}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header-section">
              <h3 className="modal-header-title">{sectionModalMode === 'add' ? 'Create Section' : 'Edit Section'}</h3>
              <button className="modal-close-icon" onClick={() => setShowSectionModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSectionSubmit}>
              <div className="modal-body-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sectionError && <div className="alert alert-error">{sectionError}</div>}
                {sectionSuccess && <div className="alert alert-info" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>{sectionSuccess}</div>}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Section Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. A" value={sectionForm.section_name} onChange={e => setSectionForm({...sectionForm, section_name: e.target.value})} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Room Number</label>
                  <input type="text" className="form-input" placeholder="e.g. Room 204" value={sectionForm.room_number} onChange={e => setSectionForm({...sectionForm, room_number: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer-section">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSectionModal(false)} style={{ marginRight: '8px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesSectionsTab;
