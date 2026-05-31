import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { login, googleLogin, reset } from '../../../redux/slices/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    if (isError) {
      dispatch(reset());
    }
  }, [user, isError, message, dispatch, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      dispatch(login({ email, password }));
    }
  };

  const handleGoogleSuccess = useCallback((credentialResponse) => {
    console.log('Google login success');
    dispatch(googleLogin(credentialResponse.credential));
  }, [dispatch]);

  const handleGoogleError = useCallback(() => {
    console.error('Google login failed');
  }, []);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Hero/Testimonial Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">Hobu</h1>
            <p className="text-gray-400 text-sm mt-2">What's our Jobseekers Said.</p>
          </div>
          
          <div className="max-w-md mx-auto my-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-gray-200 leading-relaxed mb-6">
                "Search and find your dream job is now easier than ever. Just browse a job and apply if you see it."
              </p>
              <div>
                <p className="font-semibold text-white text-lg">Mas Parjono</p>
                <p className="text-sm text-gray-400">UI Designer at Google</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            © 2024 Hobu. All rights reserved.
          </div>
        </div>
        
        <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900">Hobu</h1>
          </div>

          {/* Login Section */}
          <div>
            {/* Google Sign In */}
            <div className="flex justify-center mb-5">
              <div className="w-full max-w-[280px] flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  shape="circle"
                  width="280"
                  text="signin_with"
                  logo_alignment="center"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400 uppercase tracking-wider">
                  Or
                </span>
              </div>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">
                  {message || 'Invalid email or password'}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-0 py-2 border-0 border-b-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'} bg-transparent focus:outline-none focus:ring-0 transition-colors text-gray-900 text-base placeholder-gray-400`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-0 py-2 border-0 border-b-2 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'} bg-transparent focus:outline-none focus:ring-0 transition-colors text-gray-900 text-base placeholder-gray-400 pr-12`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Forgot Password Link - Moved to bottom of button */}
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700 text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-gray-900 font-bold hover:underline">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Bottom Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Get your right job and right place apply now
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Be among the first founders to experience the easiest way to start your own business.
              </p>
            </div>

            {/* Footer Text */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">@jobuaccount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;