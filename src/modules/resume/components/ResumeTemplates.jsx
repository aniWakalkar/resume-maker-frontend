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
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Loading Templates</h2>
          <p className="text-slate-500 mt-1">Please wait while we fetch the best templates for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
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
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{getCategoryTitle()}</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchTemplates} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{getCategoryTitle()}</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <svg className="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-amber-600 mb-2">No templates found</p>
          <p className="text-amber-500 text-sm">No templates available for this category yet. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Experience
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{getCategoryTitle()}</h2>
        <p className="text-slate-500 mt-2">Choose a template that best represents your professional style</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id || template.id}
            onClick={() => handleSelect(template)}
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
              selectedTemplateId === (template._id || template.id) ? 'ring-4 ring-indigo-500 rounded-2xl' : ''
            }`}
          >
            <Card className="hover:shadow-2xl transition-all duration-300 h-full border-0 shadow-lg overflow-hidden group">
              <div className="relative">
                {/* Premium Badge */}
                {template.type === 'premium' && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      ₹{template.price}
                    </span>
                  </div>
                )}
                
                {/* Template Preview Area */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-t-2xl flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff20_1px,transparent_1px),linear-gradient(-45deg,#ffffff20_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <span className="text-5xl relative z-10 transition-transform group-hover:scale-110 duration-300">📄</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{template.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{template.description}</p>
                  
                  {/* Template Features Preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features?.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {feature.length > 20 ? feature.slice(0, 20) + '...' : feature}
                      </span>
                    ))}
                    {template.features?.length > 2 && (
                      <span className="text-xs text-slate-400">+{template.features.length - 2} more</span>
                    )}
                  </div>
                  
                  <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Select Template
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeTemplates;