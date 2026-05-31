import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, reset } from '../../../redux/slices/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message, user } = useSelector((state) => state.auth);

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
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...registerData } = formData;
      dispatch(register(registerData));
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Hero/Testimonial Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">Hobu</h1>
            <p className="text-gray-400 text-sm mt-2">Join our community</p>
          </div>
          
          <div className="max-w-md mx-auto my-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-gray-200 leading-relaxed mb-6">
                "The best platform to find your dream job. Simple, fast, and effective!"
              </p>
              <div>
                <p className="font-semibold text-white text-lg">Sarah Johnson</p>
                <p className="text-sm text-gray-400">Product Manager at Microsoft</p>
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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900">Hobu</h1>
          </div>

          {/* Register Section - Heading REMOVED */}
          <div>
            {/* Empty spacer to match layout - keeps consistent spacing */}
            <div className="mb-6"></div>

            {/* Error Message */}
            {isError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">
                  {message || 'Registration failed'}
                </p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-0 py-2 border-0 border-b-2 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'} bg-transparent focus:outline-none focus:ring-0 transition-colors text-gray-900 text-base placeholder-gray-400`}
                  placeholder="Full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-0 py-2 border-0 border-b-2 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-900'} bg-transparent focus:outline-none focus:ring-0 transition-colors text-gray-900 text-base placeholder-gray-400 pr-12`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-gray-900 font-bold hover:underline">
                  Sign in
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

export default Register;