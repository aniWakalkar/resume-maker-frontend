import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { updateFormData, saveResume, updateResume } from '../../../redux/slices/resumeSlice';

function ResumeForm({ template, onSubmit, savedResume, onBack }) {
  const dispatch = useDispatch();
  const { currentResume, saveStatus, experienceType, selectedTemplate } = useSelector((state) => state.resume);
  
  // Initialize form data from savedResume (backend) or currentResume (frontend) or create new
  const [formData, setFormData] = useState(() => {
    if (savedResume && savedResume.personalInfo) {
      return {
        fullName: savedResume.personalInfo.fullName || '',
        email: savedResume.personalInfo.email || '',
        phone: savedResume.personalInfo.phone || '',
        address: savedResume.personalInfo.address || '',
        linkedin: savedResume.personalInfo.linkedin || '',
        portfolio: savedResume.personalInfo.portfolio || '',
        summary: savedResume.personalInfo.profileSummary || savedResume.summary || '',
        experience: savedResume.experience && savedResume.experience.length > 0 
          ? JSON.parse(JSON.stringify(savedResume.experience)) 
          : [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
        education: savedResume.education && savedResume.education.length > 0 
          ? JSON.parse(JSON.stringify(savedResume.education)) 
          : [{ degree: '', institution: '', year: '', percentage: '' }],
        skills: Array.isArray(savedResume.skills) && savedResume.skills.length > 0
          ? savedResume.skills.map(s => s.name).join(', ')
          : '',
        projects: savedResume.projects && savedResume.projects.length > 0 
          ? JSON.parse(JSON.stringify(savedResume.projects)) 
          : [{ name: '', description: '', technologies: '' }],
        certifications: savedResume.certifications && savedResume.certifications.length > 0 
          ? JSON.parse(JSON.stringify(savedResume.certifications)) 
          : [{ name: '', issuer: '', year: '' }],
        languages: savedResume.languages && savedResume.languages.length > 0 
          ? JSON.parse(JSON.stringify(savedResume.languages)) 
          : [{ name: '', proficiency: '' }]
      };
    }
      
    if (currentResume?.formData && Object.keys(currentResume.formData).length > 0) {
      return currentResume.formData;
    }
    
    if (currentResume?.personalInfo) {
      return {
        fullName: currentResume.personalInfo.fullName || '',
        email: currentResume.personalInfo.email || '',
        phone: currentResume.personalInfo.phone || '',
        address: currentResume.personalInfo.address || '',
        linkedin: currentResume.personalInfo.linkedin || '',
        portfolio: currentResume.personalInfo.portfolio || '',
        summary: currentResume.personalInfo.profileSummary || currentResume.summary || '',
        experience: currentResume.experience && currentResume.experience.length > 0 
          ? JSON.parse(JSON.stringify(currentResume.experience))
          : [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
        education: currentResume.education && currentResume.education.length > 0 
          ? JSON.parse(JSON.stringify(currentResume.education))
          : [{ degree: '', institution: '', year: '', percentage: '' }],
        skills: Array.isArray(currentResume.skills) ? currentResume.skills.map(s => s.name).join(', ') : '',
        projects: currentResume.projects && currentResume.projects.length > 0 
          ? JSON.parse(JSON.stringify(currentResume.projects))
          : [{ name: '', description: '', technologies: '' }],
        certifications: currentResume.certifications && currentResume.certifications.length > 0 
          ? JSON.parse(JSON.stringify(currentResume.certifications))
          : [{ name: '', issuer: '', year: '' }],
        languages: currentResume.languages && currentResume.languages.length > 0 
          ? JSON.parse(JSON.stringify(currentResume.languages))
          : [{ name: '', proficiency: '' }]
      };
    }
    
    return {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: '',
      summary: '',
      experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
      education: [{ degree: '', institution: '', year: '', percentage: '' }],
      skills: '',
      projects: [{ name: '', description: '', technologies: '' }],
      certifications: [{ name: '', issuer: '', year: '' }],
      languages: [{ name: '', proficiency: '' }]
    };
  });

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      dispatch(updateFormData(formData));
    }
  }, [formData, dispatch]);

  const handleChange = (e, section, index, field) => {
    if (section !== undefined && index !== undefined && field) {
      const newArray = JSON.parse(JSON.stringify(formData[section]));
      newArray[index][field] = e.target.value;
      setFormData({ ...formData, [section]: newArray });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addField = (section, emptyItem) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], { ...emptyItem }]
    });
  };

  const removeField = (section, index) => {
    const newArray = [...formData[section]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [section]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(updateFormData(formData));
    
    const templateIdToUse = template?._id || selectedTemplate?._id;
    
    const resumeData = {
      templateId: templateIdToUse,
      experienceType: experienceType || 'fresher',
      title: `${formData.fullName || 'Untitled'}'s Resume`,
      formData: formData
    };
    
    try {
      let result;
      if (savedResume?._id || currentResume?._id) {
        const resumeId = savedResume?._id || currentResume?._id;
        result = await dispatch(updateResume({ id: resumeId, resumeData })).unwrap();
      } else {
        result = await dispatch(saveResume(resumeData)).unwrap();
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center mb-2">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group">
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Templates
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Fill Your Details</h2>
        <p className="text-slate-500 mt-1">Provide your professional information</p>
      </div>

      {/* Personal Information */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="New York, NY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </Card>

      {/* Professional Summary */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Professional Summary</h3>
        </div>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Write a brief summary of your professional background..."
        />
      </Card>

      {/* Work Experience */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Work Experience</h3>
          </div>
          <span className="text-xs text-slate-400">Add your professional journey</span>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Experience #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('experience', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Company</label>
                <input type="text" value={exp.company || ''} onChange={(e) => handleChange(e, 'experience', index, 'company')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Position</label>
                <input type="text" value={exp.position || ''} onChange={(e) => handleChange(e, 'experience', index, 'position')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Job title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
                <input type="text" value={exp.startDate || ''} onChange={(e) => handleChange(e, 'experience', index, 'startDate')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Jan 2020" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">End Date</label>
                <input type="text" value={exp.endDate || ''} onChange={(e) => handleChange(e, 'experience', index, 'endDate')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Present" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea value={exp.description || ''} onChange={(e) => handleChange(e, 'experience', index, 'description')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Describe your responsibilities..." />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Experience
        </button>
      </Card>

      {/* Education */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Education</h3>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Education #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('education', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Degree</label>
                <input type="text" value={edu.degree || ''} onChange={(e) => handleChange(e, 'education', index, 'degree')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Bachelor of Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Institution</label>
                <input type="text" value={edu.institution || ''} onChange={(e) => handleChange(e, 'education', index, 'institution')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="University Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Year</label>
                  <input type="text" value={edu.year || ''} onChange={(e) => handleChange(e, 'education', index, 'year')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="2020-2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Percentage/GPA</label>
                  <input type="text" value={edu.percentage || ''} onChange={(e) => handleChange(e, 'education', index, 'percentage')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="85% / 3.8 GPA" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('education', { degree: '', institution: '', year: '', percentage: '' })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Education
        </button>
      </Card>

      {/* Skills */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Skills</h3>
        </div>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="JavaScript, React, Node.js, Python, MongoDB (comma-separated)"
        />
        <p className="text-sm text-slate-400 mt-2">Enter skills separated by commas</p>
      </Card>

      {/* Projects */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Projects</h3>
        </div>
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Project #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('projects', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
                <input type="text" value={project.name || ''} onChange={(e) => handleChange(e, 'projects', index, 'name')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="E-commerce Website" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Technologies</label>
                <input type="text" value={project.technologies || ''} onChange={(e) => handleChange(e, 'projects', index, 'technologies')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea value={project.description || ''} onChange={(e) => handleChange(e, 'projects', index, 'description')} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Describe the project..." />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('projects', { name: '', description: '', technologies: '' })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Project
        </button>
      </Card>

      {/* Certifications */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Certifications</h3>
        </div>
        {formData.certifications.map((cert, index) => (
          <div key={index} className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Certification #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('certifications', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Certification Name</label>
                <input type="text" value={cert.name || ''} onChange={(e) => handleChange(e, 'certifications', index, 'name')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="AWS Certified Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Issuing Organization</label>
                <input type="text" value={cert.issuer || ''} onChange={(e) => handleChange(e, 'certifications', index, 'issuer')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Amazon Web Services" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Year</label>
                <input type="text" value={cert.year || ''} onChange={(e) => handleChange(e, 'certifications', index, 'year')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="2023" />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('certifications', { name: '', issuer: '', year: '' })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Certification
        </button>
      </Card>

      {/* Languages */}
      <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white">
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Languages</h3>
        </div>
        {formData.languages.map((lang, index) => (
          <div key={index} className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Language #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('languages', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Language</label>
                <input type="text" value={lang.name || ''} onChange={(e) => handleChange(e, 'languages', index, 'name')} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Proficiency</label>
                <select value={lang.proficiency || ''} onChange={(e) => handleChange(e, 'languages', index, 'proficiency')} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option value="">Select proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('languages', { name: '', proficiency: '' })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Language
        </button>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={saveStatus === 'saving'} className="!px-8 !py-3 !rounded-xl !bg-gradient-to-r !from-indigo-600 !to-purple-600 hover:!from-indigo-700 hover:!to-purple-700">
          {saveStatus === 'saving' ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>

      {/* Save Status Indicators */}
      {saveStatus === 'saving' && (
        <div className="fixed bottom-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Saving your resume...
        </div>
      )}
      {saveStatus === 'saved' && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Resume saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          Save failed. Please try again.
        </div>
      )}
    </form>
  );
}

export default ResumeForm;