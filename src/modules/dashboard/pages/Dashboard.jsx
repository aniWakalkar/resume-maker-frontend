import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Navbar from '../../../components/layout/Navbar';
import { clearResumeState } from '../../../redux/slices/resumeSlice';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCreateNewResume = () => {
    // Clear any existing resume state
    dispatch(clearResumeState());
    // Navigate to resume builder with new flag to start fresh
    navigate('/resume-builder');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rememberedEmail');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to your Hobu dashboard</p>
            </div>
            <Button onClick={handleLogout} variant="danger">
              Logout
            </Button>
          </div>
          
          <Card title={`Welcome back, ${user?.name || 'User'}!`}>
            <p className="text-gray-600 mb-6">You have successfully logged in.</p>
            
            {/* Resume Builder Button */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Professional Resume</h3>
              <p className="text-gray-600 mb-4">
                Choose from our professionally designed templates and build your resume in minutes.
              </p>
              <Button onClick={handleCreateNewResume} variant="primary">
                Create New Resume
              </Button>
            </div>

            {/* View My Resumes Button */}
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/my-resumes')} 
                variant="secondary"
              >
                View My Resumes
              </Button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">User Information:</p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                Email: {user?.email}
              </p>
              {user?.name && (
                <p className="text-sm font-medium text-gray-700">
                  Name: {user?.name}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboard;