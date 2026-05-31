import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { logout, reset } from '../../../redux/slices/authSlice';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      // Dispatch logout action (this will clear localStorage and state)
      await dispatch(logout()).unwrap();
      dispatch(reset());
      
      // Clear Google session if exists
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, force clear and redirect
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('rememberedEmail');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
        
        <Card title={`Welcome back, ${user?.name || 'User'}!`}>
          <p className="text-gray-600">You have successfully logged in.</p>
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
  );
}

export default Dashboard;