import React, { useState, useEffect } from 'react';
import { authService } from '../service/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response.data);
      setFormData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({ ...profile });
    setEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setEditing(false);
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const response = await authService.updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!profile) return '?';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase() || profile.username?.[0]?.toUpperCase() || '?';
  };

  if (loading) return (
    <div className="loading-container">
      <i className="bi bi-arrow-repeat spinner"></i>
      <p>Loading your profile...</p>
    </div>
  );

  if (error && !profile) return (
    <div className="error-container">
      <i className="bi bi-exclamation-triangle-fill"></i>
      <p>{error}</p>
      <button onClick={fetchProfile} className="retry-btn">
        <i className="bi bi-arrow-clockwise"></i>
        Retry
      </button>
    </div>
  );

  return (
    <div className="profile">

      {/* Page Header */}
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      {/* Avatar Card */}
      <div className="profile-avatar-card">
        <div className="profile-avatar">
          {getInitials()}
        </div>
        <div className="profile-avatar-info">
          <h3>{profile.first_name || profile.username} {profile.last_name}</h3>
          <span>@{profile.username}</span>
        </div>
      </div>

      {/* Success / Error banners */}
      {success && (
        <div className="success-message">
          <i className="bi bi-check-circle-fill"></i>
          {success}
        </div>
      )}
      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      )}

      {/* Details Card */}
      <div className="profile-card">
        <div className="profile-card-title">
          <i className="bi bi-person-lines-fill"></i>
          Account Information
        </div>

        {editing ? (
          /* ── Edit Form ── */
          <form className="profile-edit-form" onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  placeholder="Enter first name"
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  placeholder="Enter last name"
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                placeholder="Enter email address"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={formData.username || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving
                  ? <><i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }}></i> Saving...</>
                  : <><i className="bi bi-check-lg"></i> Save Changes</>
                }
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* ── View Mode ── */
          <>
            <div className="profile-fields">
              <div className="profile-field">
                <label>First Name</label>
                <span>{profile.first_name || '—'}</span>
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <span>{profile.last_name || '—'}</span>
              </div>
              <div className="profile-field">
                <label>Username</label>
                <span>@{profile.username}</span>
              </div>
              <div className="profile-field">
                <label>Email Address</label>
                <span>{profile.email || '—'}</span>
              </div>
            </div>

            <div className="profile-actions" style={{ marginTop: '28px' }}>
              <button className="btn-primary" onClick={handleEdit}>
                <i className="bi bi-pencil-fill"></i>
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Profile;