import { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import { getTemplatesByCategory } from '../../../services/api';

function ResumeTemplates({ category, onSelectTemplate, onBack }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    if (category) {
      console.log(`🔵 STEP 2: ResumeTemplates mounted for category: ${category}`);
      fetchTemplates();
    }
  }, [category]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      console.log(`📡 API CALL 2: getTemplatesByCategory("${category}") - Fetching templates`);
      const response = await getTemplatesByCategory(category);
      console.log(`📡 API RESPONSE 2: Templates response for ${category}:`, response);
      
      let templatesData = [];
      if (response.data && Array.isArray(response.data)) {
        templatesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        templatesData = response.data.data;
      } else if (Array.isArray(response)) {
        templatesData = response;
      } else {
        templatesData = [];
      }
      
      setTemplates(templatesData);
      setError(null);
    } catch (err) {
      console.error(`❌ Error fetching templates for ${category}:`, err);
      setError('Failed to load templates. Please try again.');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template) => {
    console.log(`🟢 User selected template: ${template.name}`);
    setSelectedTemplateId(template._id);
    onSelectTemplate(template);
  };

  const getCategoryTitle = () => {
    const titles = {
      fresher: 'Resume Templates for Freshers',
      experienced: 'Resume Templates for Experienced Professionals',
      creative: 'Creative Resume Templates',
      modern: 'Modern Resume Templates',
      executive: 'Executive Resume Templates'
    };
    return titles[category] || 'Resume Templates';
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getCategoryTitle()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
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
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getCategoryTitle()}</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button onClick={fetchTemplates} className="text-red-700 hover:text-red-800 text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getCategoryTitle()}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-600">No templates found for this category. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{getCategoryTitle()}</h2>
      <p className="text-gray-600 mb-6">Choose a template that best represents your professional style</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id || template.id}
            onClick={() => handleSelect(template)}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedTemplateId === (template._id || template.id) ? 'ring-4 ring-blue-500 rounded-xl' : ''
            }`}
          >
            <Card className="hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative">
                {template.type === 'premium' && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ₹{template.price}
                    </span>
                  </div>
                )}
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Select Template
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeTemplates;