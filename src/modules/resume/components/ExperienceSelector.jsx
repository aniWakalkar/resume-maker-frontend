import { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import { getAllCategories } from '../../../services/api';

function ExperienceSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔵 STEP 1: ExperienceSelector mounted - fetching categories');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('📡 API CALL 1: getAllCategories() - Fetching experience categories');
      const response = await getAllCategories();
      console.log('📡 API RESPONSE 1: Categories response:', response);
      
      let categoriesData = [];
      if (response.data && response.data.success && response.data.data) {
        categoriesData = response.data.data;
        console.log('✅ Categories loaded from response.data.data:', categoriesData.length);
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
        console.log('✅ Categories loaded from response.data:', categoriesData.length);
      } else if (Array.isArray(response)) {
        categoriesData = response;
        console.log('✅ Categories loaded from response:', categoriesData.length);
      } else {
        console.error('❌ Unexpected response structure:', response);
        categoriesData = [
          { id: 'fresher', title: 'Fresher / Entry Level', description: 'Recent graduate with limited work experience', icon: '🎓', color: 'blue', count: 0 },
          { id: 'experienced', title: 'Experienced', description: 'Have professional work experience', icon: '💼', color: 'purple', count: 0 }
        ];
      }
      
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError('Failed to load experience categories. Please refresh the page.');
      setCategories([
        { id: 'fresher', title: 'Fresher / Entry Level', description: 'Recent graduate with limited work experience', icon: '🎓', color: 'blue', count: 0 },
        { id: 'experienced', title: 'Experienced', description: 'Have professional work experience', icon: '💼', color: 'purple', count: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (categoryId) => {
    console.log(`🟢 User selected experience: ${categoryId}`);
    setSelected(categoryId);
    onSelect(categoryId);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { ring: 'ring-indigo-500', bg: 'from-indigo-500 to-blue-500', hover: 'hover:shadow-indigo-100' },
      purple: { ring: 'ring-purple-500', bg: 'from-purple-500 to-pink-500', hover: 'hover:shadow-purple-100' },
      pink: { ring: 'ring-pink-500', bg: 'from-pink-500 to-rose-500', hover: 'hover:shadow-pink-100' },
      green: { ring: 'ring-emerald-500', bg: 'from-emerald-500 to-teal-500', hover: 'hover:shadow-emerald-100' },
      slate: { ring: 'ring-slate-500', bg: 'from-slate-500 to-gray-500', hover: 'hover:shadow-slate-100' },
      gray: { ring: 'ring-gray-500', bg: 'from-gray-500 to-gray-600', hover: 'hover:shadow-gray-100' }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Loading Experience Levels</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Select Your Experience Level</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Select Your Experience Level</h2>
        <p className="text-slate-500 mt-2">Choose the category that best matches your career stage</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <div
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                selected === category.id ? `ring-4 ${colors.ring} rounded-2xl` : ''
              }`}
            >
              <Card className="text-center hover:shadow-xl transition-all duration-300 h-full border-0 shadow-lg">
                <div className={`text-6xl mb-4 inline-block p-4 bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{category.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{category.description}</p>
                {category.count > 0 && (
                  <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {category.count} templates available
                  </span>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExperienceSelector;