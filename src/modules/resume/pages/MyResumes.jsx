import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { getUserResumes, deleteResume } from '../../../redux/slices/resumeSlice';

function MyResumes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userResumes, isLoading } = useSelector((state) => state.resume);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getUserResumes());
  }, [dispatch, user, navigate]);

  const handleEdit = (resumeId) => {
    navigate(`/resume-builder?id=${resumeId}`);
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await dispatch(deleteResume(resumeId));
      dispatch(getUserResumes());
    }
  };

  const handleCreateNew = () => {
    navigate('/resume-builder');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your resumes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <div className="flex-grow">
          {/* Hero Banner */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between relative z-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">My Resumes</h1>
                <p className="text-white/80 text-sm mt-1">Manage and edit your saved resumes</p>
              </div>
              <Button 
                onClick={handleCreateNew} 
                variant="primary" 
                className="!bg-white/10 !text-white hover:!bg-white/20 border border-white/20 backdrop-blur-md !rounded-xl"
              >
                + Create New Resume
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-16">
            {!userResumes || userResumes.length === 0 ? (
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-5xl">📄</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No resumes yet</h3>
                  <p className="text-slate-500 mb-6">Create your first professional resume now</p>
                  <Button onClick={handleCreateNew} variant="primary">
                    Create Resume
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Stats Bar */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-slate-600">Total Resumes:</span>
                      <span className="font-bold text-indigo-600">{userResumes.length}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <span className="text-slate-600">Last updated:</span>
                      <span className="font-medium text-slate-700">
                        {userResumes.length > 0 ? new Date(userResumes[0]?.updatedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userResumes.map((resume) => (
                    <Card key={resume._id} className="border-0 shadow-xl shadow-slate-200/50 bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                      <div className="relative">
                        {/* Premium Badge */}
                        {resume.isPremiumTemplate && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                              Premium
                            </span>
                          </div>
                        )}
                        
                        {/* Template Preview Area */}
                        <div className="w-full h-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff20_1px,transparent_1px),linear-gradient(-45deg,#ffffff20_1px,transparent_1px)] bg-[size:20px_20px]" />
                          <span className="text-5xl relative z-10">📄</span>
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">
                            {resume.title || 'Untitled Resume'}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-xs text-slate-500">
                              Template: {resume.templateName || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-slate-400">
                              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(resume._id)}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                            >
                              Edit Resume
                            </button>
                            <button
                              onClick={() => handleDelete(resume._id)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MyResumes;