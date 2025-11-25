import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    fullName: user.fullName || '',
    department: user.department || 'CSE',
    bio: user.bio || '',
    phone: user.phone || '',
  });

  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

  const departments = [
    'CSE', 'ECE', 'Mechanical', 'Chemical', 'Ceramic', 'Mining',
    'Metallurgy & Materials', 'BMBT', 'Physics & Applied', 'BBA', 'Other'
  ];

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size must be less than 5MB');
        return;
      }

      setImageError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply image change
  const applyImageChange = () => {
    if (tempImagePreview) {
      setProfileImage(tempImagePreview);
      setTempImagePreview(null);
      setSaveSuccess(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setProfileImage(null);
    setTempImagePreview(null);
  };

  // Cancel image preview
  const cancelImagePreview = () => {
    setTempImagePreview(null);
    setImageError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.fullName && formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (formData.phone && !/^\d{10}$|^\d{3}-\d{3}-\d{4}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes
  const handleSaveProfile = () => {
    if (!validateForm()) {
      return;
    }

    const updatedUser = {
      ...user,
      ...formData,
      profileImage
    };

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Call parent update function
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSaveSuccess(true);
    setIsEditing(false);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = formData.fullName || formData.username;
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar background color based on username
  const getAvatarColor = () => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-indigo-500 to-indigo-600',
      'from-cyan-500 to-cyan-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600'
    ];
    const index = formData.username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const joinDate = user.joinDate || new Date().toLocaleDateString();
  const memberSince = user.memberSince || 'Recently';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campus Building Classifier</h1>
            <p className="text-sm text-slate-600">User Profile</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700">Welcome, <strong>{user.username}</strong></span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
            <Link to="/" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Classifier
            </Link>
            <Link to="/dataset" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Dataset Browser
            </Link>
            <Link to="/metrics" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Model Metrics
            </Link>
            <Link to="/confusion" className="px-4 py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
              Confusion Matrix
            </Link>
            <Link to="/profile" className="px-4 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
              Profile
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Profile Picture</h2>

              {/* Avatar Display */}
              <div className="flex flex-col items-center">
                {profileImage ? (
                  <div className="relative mb-4">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                    />
                    {isEditing && (
                      <button
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white text-4xl font-bold mb-4 border-4 border-slate-200`}
                  >
                    {getInitials() || '?'}
                  </div>
                )}

                {/* Image Preview */}
                {tempImagePreview && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg w-full">
                    <img
                      src={tempImagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={applyImageChange}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium text-sm transition"
                      >
                        Apply
                      </button>
                      <button
                        onClick={cancelImagePreview}
                        className="flex-1 bg-slate-400 hover:bg-slate-500 text-white py-2 rounded font-medium text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isEditing && !tempImagePreview && (
                  <>
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <span className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center block cursor-pointer transition">
                        Upload Photo
                      </span>
                    </label>
                    {imageError && (
                      <p className="text-red-600 text-sm mt-2 text-center">{imageError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Member Info */}
              <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Member Since</p>
                  <p className="text-lg font-bold text-slate-900">{memberSince}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Account Status</p>
                  <p className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Account Details</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                        setFormData({
                          username: user.username || '',
                          email: user.email || '',
                          fullName: user.fullName || '',
                          department: user.department || 'CSE',
                          bio: user.bio || '',
                          phone: user.phone || '',
                        });
                      }}
                      className="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Username *
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.username ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled
                      />
                      <p className="text-xs text-slate-600 mt-1">Username cannot be changed</p>
                    </>
                  ) : (
                    <p className="text-lg text-slate-700 font-medium">{formData.username}</p>
                  )}
                  {errors.username && (
                    <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="your@email.com"
                    />
                  ) : (
                    <p className="text-lg text-slate-700 font-medium">{formData.email}</p>
                  )}
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="John Doe"
                    />
                  ) : (
                    <p className="text-lg text-slate-700 font-medium">
                      {formData.fullName || '—'}
                    </p>
                  )}
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg text-slate-700 font-medium">{formData.department}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="10-digit or XXX-XXX-XXXX"
                    />
                  ) : (
                    <p className="text-lg text-slate-700 font-medium">
                      {formData.phone || '—'}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength="250"
                    />
                  ) : (
                    <p className="text-lg text-slate-700 font-medium whitespace-pre-wrap">
                      {formData.bio || '—'}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-slate-600 mt-1">
                      {formData.bio.length}/250 characters
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Additional Options */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Settings</h3>
              
              <div className="space-y-3">
                <button className="w-full p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-left font-medium text-slate-900 flex justify-between items-center">
                  <span>Change Password</span>
                  <span>→</span>
                </button>
                <button className="w-full p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-left font-medium text-slate-900 flex justify-between items-center">
                  <span>Privacy Settings</span>
                  <span>→</span>
                </button>
                <button className="w-full p-4 border border-red-300 rounded-lg hover:bg-red-50 transition text-left font-medium text-red-700 flex justify-between items-center">
                  <span>Delete Account</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Profile;
