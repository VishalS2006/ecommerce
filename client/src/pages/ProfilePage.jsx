import React, { useState, useEffect } from 'react';
import { User, MapPin, Lock, Plus, Trash2, Edit2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { success, error, warning } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'security'

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Address modal / edit state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    addressType: 'Home',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      warning('Name cannot be empty');
      return;
    }
    setUpdatingProfile(true);
    await updateProfile({ name: name.trim(), mobile: mobile.trim() });
    setUpdatingProfile(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      warning('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      warning('New passwords do not match');
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await authService.updatePassword({ currentPassword, newPassword });
      if (res.success) {
        success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || '',
      mobile: user?.mobile || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      addressType: 'Home',
      isDefault: false
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName,
      mobile: addr.mobile,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'United States',
      addressType: addr.addressType || 'Home',
      isDefault: !!addr.isDefault
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await authService.updateAddress(editingAddressId, addressForm);
        success('Address updated');
      } else {
        await authService.addAddress(addressForm);
        success('New address added');
      }
      await refreshUser();
      setShowAddressModal(false);
    } catch (err) {
      error(err.customMessage || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await authService.deleteAddress(addressId);
      await refreshUser();
      success('Address deleted');
    } catch (err) {
      error(err.customMessage || 'Failed to delete address');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
          Account Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-soft p-4 space-y-1">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-black text-lg flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 truncate">{user?.name}</h3>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-brand-50 text-brand-700 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-brand-50 text-brand-700 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-brand-50 text-brand-700 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-10">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-400">Update your name and primary contact details</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address (Read-only)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
                  >
                    {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Delivery Addresses</h2>
                    <p className="text-xs text-slate-400">Manage where your packages are delivered</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                </div>

                {user?.addresses?.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No addresses saved yet. Click &quot;Add Address&quot; above to create one.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div
                        key={addr._id}
                        className="p-5 rounded-2xl border border-slate-200 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                            {addr.addressType} {addr.isDefault && '• Default'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              className="text-slate-400 hover:text-brand-600 p-1"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-sm text-slate-800">{addr.fullName}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`} <br />
                          {addr.city}, {addr.state} - {addr.postalCode} <br />
                          {addr.country}
                        </p>
                        <p className="text-xs text-slate-600 font-semibold pt-1">
                          Phone: {addr.mobile}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Security & Credentials</h2>
                  <p className="text-xs text-slate-400">Keep your account secure with a strong password</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.mobile}
                      onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.addressLine2}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address Type</label>
                  <select
                    value={addressForm.addressType}
                    onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
