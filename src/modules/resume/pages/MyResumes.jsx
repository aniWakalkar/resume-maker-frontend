import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600 mt-1">Manage and edit your saved resumes</p>
            </div>
            <Button onClick={handleCreateNew} variant="primary">
              + Create New Resume
            </Button>
          </div>

          {!userResumes || userResumes.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-4">Create your first professional resume now</p>
              <Button onClick={handleCreateNew} variant="primary">
                Create Resume
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userResumes.map((resume) => (
                <Card key={resume._id} className="hover:shadow-xl transition-shadow">
                  <div className="p-2">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">📄</span>
                      </div>
                      {resume.isPremiumTemplate && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Template: {resume.templateName || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(resume._id)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyResumes;