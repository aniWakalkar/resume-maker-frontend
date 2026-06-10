import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Navbar from '../../../components/layout/Navbar';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Here you would dispatch an update profile action
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 pb-16">
        {/* Modern Top Hero Banner */}
        <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="max-w-6xl mx-auto px-4 h-full flex items-end pb-6 relative z-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="absolute top-6 left-4 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full transition-all border border-white/10 hover:bg-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </button>
          </div>
        </div>

        {/* Main Interface Wrapper */}
        <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Column 1: Sticky Profile Identity Card */}
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/50 bg-white">
                <div className="flex flex-col items-center pt-8 pb-6 px-6 text-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative w-28 h-28 bg-slate-900 border-4 border-white rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-inner">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  
                  <h2 className="mt-5 text-2xl font-bold text-slate-800 tracking-tight">{formData.name || 'User Profile'}</h2>
                  <p className="text-sm font-medium text-slate-400 mt-1">{formData.email}</p>
                  
                  <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-slate-100">
                    <div className="text-left bg-slate-50 p-3 rounded-xl">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role</span>
                      <span className="text-sm font-semibold text-slate-700">Member</span>
                    </div>
                    <div className="text-left bg-slate-50 p-3 rounded-xl">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Columns 2 & 3: Information & Account Management */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Info Box */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Personal Details</h3>
                    <p className="text-sm text-slate-400">Keep your core account information current.</p>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="!rounded-xl border-slate-200 hover:bg-slate-50">
                      Edit Info
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed"
                          disabled
                        />
                        <p className="text-[11px] text-slate-400 mt-1.5 pl-1">Primary email identity cannot be changed.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button onClick={handleSave} variant="primary" className="shadow-lg shadow-indigo-600/20">
                        Save Changes
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="border-slate-200">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</span>
                        <span className="text-base font-medium text-slate-800">{formData.name || '—'}</span>
                      </div>
                      <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</span>
                        <span className="text-base font-medium text-slate-800">{formData.email || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Advanced Security / Actions Box */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white p-6">
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Security & Privacy</h3>
                  <p className="text-sm text-slate-400">Manage critical credentials and sensitive account status.</p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
                    <div>
                      <p className="font-semibold text-slate-800">Update Password</p>
                      <p className="text-sm text-slate-400">Ensure your operational safety with regular updates.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/change-password')} className="!rounded-xl border-slate-200 sm:w-auto w-full justify-center">
                      Change Credentials
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5">
                    <div>
                      <p className="font-semibold text-rose-600">Danger Zone: Delete Account</p>
                      <p className="text-sm text-slate-400">This action safely wipes your data clusters permanently.</p>
                    </div>
                    <Button variant="danger" className="!bg-rose-50 !text-rose-600 hover:!bg-rose-600 hover:!text-white border-0 !rounded-xl sm:w-auto w-full justify-center transition-colors">
                      Terminate Account
                    </Button>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;