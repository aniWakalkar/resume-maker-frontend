import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
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
    dispatch(clearResumeState());
    navigate('/resume-builder');
  };

  if (!user) return null;

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
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-white/80 text-sm mt-1">Welcome back, {user?.name || 'User'}!</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
            <div className="w-full">
              {/* Main Create Resume Section */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white p-6 mb-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Create Your Professional Resume</h3>
                  <p className="text-sm text-slate-400 mt-1">Choose from our professionally designed, ATS-friendly templates and build an outstanding resume in minutes.</p>
                </div>
                
                {/* Main Create Callout Box */}
                {/* <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50/30 rounded-2xl p-6 border border-indigo-100/40 shadow-inner"> */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">Start a New Resume</h4>
                      <p className="text-sm text-slate-600">Get started with a fresh template and build your resume from scratch.</p>
                    </div>
                    <Button 
                      onClick={handleCreateNewResume} 
                      variant="primary" 
                      className="shadow-lg shadow-indigo-600/20 !rounded-xl whitespace-nowrap"
                    >
                      Create New Resume
                    </Button>
                  </div>
                {/* </div> */}
              </Card>

              {/* View Existing Resumes Section */}
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Your Saved Resumes</h3>
                    <p className="text-sm text-slate-400 mt-1">Access, edit, or download your previously created resumes.</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/my-resumes')} 
                    variant="secondary"
                    className="!rounded-xl sm:w-auto w-full justify-center bg-white text-black hover:bg-slate-50 border border-slate-200 shadow-sm"
                  >
                    View My Resumes
                  </Button>
                </div>

                {/* Quick Stats or Info */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-2xl font-bold text-indigo-600">5+</p>
                      <p className="text-xs text-slate-500">Professional Templates</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-2xl font-bold text-indigo-600">100%</p>
                      <p className="text-xs text-slate-500">ATS-Friendly</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-2xl font-bold text-indigo-600">PDF</p>
                      <p className="text-xs text-slate-500">Instant Download</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;