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
      
      // Handle different response structures
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
        // Fallback to default categories
        categoriesData = [
          { id: 'fresher', title: 'Fresher / Entry Level', description: 'Recent graduate with limited work experience', icon: '🎓', color: 'blue', count: 0 },
          { id: 'experienced', title: 'Experienced', description: 'Have professional work experience', icon: '💼', color: 'purple', count: 0 }
        ];
        console.log('⚠️ Using fallback categories');
      }
      
      setCategories(categoriesData);
      setError(null);
      console.log('✅ Step 1 Complete: Categories loaded and ready for selection');
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError('Failed to load experience categories. Please refresh the page.');
      // Fallback to default categories
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
    console.log(`➡️ Moving to STEP 2: Template selection for category: ${categoryId}`);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { ring: 'ring-blue-500', bg: 'from-blue-500 to-blue-600', hover: 'hover:shadow-blue-100' },
      purple: { ring: 'ring-purple-500', bg: 'from-purple-500 to-purple-600', hover: 'hover:shadow-purple-100' },
      pink: { ring: 'ring-pink-500', bg: 'from-pink-500 to-pink-600', hover: 'hover:shadow-pink-100' },
      green: { ring: 'ring-green-500', bg: 'from-green-500 to-green-600', hover: 'hover:shadow-green-100' },
      slate: { ring: 'ring-slate-500', bg: 'from-slate-500 to-slate-600', hover: 'hover:shadow-slate-100' },
      gray: { ring: 'ring-gray-500', bg: 'from-gray-500 to-gray-600', hover: 'hover:shadow-gray-100' }
    };
    return colorMap[color] || colorMap.gray;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Experience Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Experience Level</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchCategories}
            className="text-red-700 hover:text-red-800 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Experience Level</h2>
      <p className="text-gray-600 mb-6">Choose the category that best matches your career stage</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <div
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selected === category.id ? `ring-4 ${colors.ring} rounded-xl` : ''
              }`}
            >
              <Card className="text-center hover:shadow-xl transition-all duration-300 h-full">
                <div className={`text-6xl mb-4 inline-block p-4 bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                {category.count > 0 && (
                  <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
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