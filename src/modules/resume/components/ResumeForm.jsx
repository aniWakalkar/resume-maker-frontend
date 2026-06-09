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
    // First priority: Check if we have savedResume from backend
    if (savedResume && savedResume.personalInfo) {
      console.log('Loading saved resume data:', savedResume);
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
      
    // Second priority: Check if we have currentResume with formData (frontend format)
    if (currentResume?.formData && Object.keys(currentResume.formData).length > 0) {
      return currentResume.formData;
    }
    
    // Third priority: Check if we have currentResume with personalInfo (backend format)
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
    
    // Default empty form
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

  // Save form data to Redux whenever it changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      dispatch(updateFormData(formData));
    }
  }, [formData, dispatch]);

  const handleChange = (e, section, index, field) => {
    if (section !== undefined && index !== undefined && field) {
      // Create a deep copy of the array to avoid readonly issues
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
    
    console.log('🟢 User clicked Save & Continue');
    console.log('📝 Form data being saved:', formData);
    
    dispatch(updateFormData(formData));
    
    // IMPORTANT: Send the actual MongoDB ObjectId, not the slug
    // template._id is the actual MongoDB ObjectId (e.g., "6a26ef9ebd52c26acdc6dc3f")
    // NOT the slug (e.g., "template_fresher_1")
    const templateIdToUse = template?._id || selectedTemplate?._id;
    
    console.log('🆔 Template ObjectId being used:', templateIdToUse);
    console.log('📌 Template name:', template?.name || selectedTemplate?.name);
    
    const resumeData = {
      templateId: templateIdToUse,  // Send actual ObjectId
      experienceType: experienceType || 'fresher',
      title: `${formData.fullName || 'Untitled'}'s Resume`,
      formData: formData
    };
    
    try {
      let result;
      if (savedResume?._id || currentResume?._id) {
        const resumeId = savedResume?._id || currentResume?._id;
        result = await dispatch(updateResume({ id: resumeId, resumeData })).unwrap();
        console.log('✅ Updated existing resume:', result);
      } else {
        result = await dispatch(saveResume(resumeData)).unwrap();
        console.log('✅ Created new resume:', result);
      }
      onSubmit(formData);
    } catch (error) {
      console.error('❌ Failed to save:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}

      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <Card title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New York, NY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </Card>

      {/* Professional Summary */}
      <Card title="Professional Summary">
        <textarea
          name="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a brief summary of your professional background..."
        />
      </Card>

      {/* Work Experience */}
      <Card title="Work Experience">
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Experience #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('experience', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" value={exp.company || ''} onChange={(e) => handleChange(e, 'experience', index, 'company')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input type="text" value={exp.position || ''} onChange={(e) => handleChange(e, 'experience', index, 'position')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Job title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="text" value={exp.startDate || ''} onChange={(e) => handleChange(e, 'experience', index, 'startDate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Jan 2020" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="text" value={exp.endDate || ''} onChange={(e) => handleChange(e, 'experience', index, 'endDate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Present" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={exp.description || ''} onChange={(e) => handleChange(e, 'experience', index, 'description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Describe your responsibilities..." />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Experience
        </button>
      </Card>

      {/* Education */}
      <Card title="Education">
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Education #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('education', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input type="text" value={edu.degree || ''} onChange={(e) => handleChange(e, 'education', index, 'degree')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Bachelor of Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input type="text" value={edu.institution || ''} onChange={(e) => handleChange(e, 'education', index, 'institution')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="University Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="text" value={edu.year || ''} onChange={(e) => handleChange(e, 'education', index, 'year')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="2020-2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/GPA</label>
                  <input type="text" value={edu.percentage || ''} onChange={(e) => handleChange(e, 'education', index, 'percentage')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="85% / 3.8 GPA" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('education', { degree: '', institution: '', year: '', percentage: '' })} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Education
        </button>
      </Card>

      {/* Skills */}
      <Card title="Skills">
        <textarea
          name="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="JavaScript, React, Node.js, Python, MongoDB (comma-separated)"
        />
        <p className="text-sm text-gray-500 mt-1">Enter skills separated by commas</p>
      </Card>

      {/* Projects */}
      <Card title="Projects">
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Project #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('projects', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" value={project.name || ''} onChange={(e) => handleChange(e, 'projects', index, 'name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="E-commerce Website" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <input type="text" value={project.technologies || ''} onChange={(e) => handleChange(e, 'projects', index, 'technologies')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={project.description || ''} onChange={(e) => handleChange(e, 'projects', index, 'description')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Describe the project and your role..." />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('projects', { name: '', description: '', technologies: '' })} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Project
        </button>
      </Card>

      {/* Certifications */}
      <Card title="Certifications">
        {formData.certifications.map((cert, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Certification #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('certifications', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                <input type="text" value={cert.name || ''} onChange={(e) => handleChange(e, 'certifications', index, 'name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="AWS Certified Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                <input type="text" value={cert.issuer || ''} onChange={(e) => handleChange(e, 'certifications', index, 'issuer')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Amazon Web Services" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Obtained</label>
                <input type="text" value={cert.year || ''} onChange={(e) => handleChange(e, 'certifications', index, 'year')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="2023" />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addField('certifications', { name: '', issuer: '', year: '' })} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Certification
        </button>
      </Card>

      {/* Languages */}
      <Card title="Languages">
        {formData.languages.map((lang, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Language #{index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeField('languages', index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <input type="text" value={lang.name || ''} onChange={(e) => handleChange(e, 'languages', index, 'name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select value={lang.proficiency || ''} onChange={(e) => handleChange(e, 'languages', index, 'proficiency')} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
        <button type="button" onClick={() => addField('languages', { name: '', proficiency: '' })} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          + Add Language
        </button>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={saveStatus === 'saving'} className="px-8 py-3">
          {saveStatus === 'saving' ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>

      {/* Save Status Indicators */}
      {saveStatus === 'saving' && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Saving your resume...
        </div>
      )}
      {saveStatus === 'saved' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✓ Resume saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✗ Save failed. Please try again.
        </div>
      )}
    </form>
  );
}

export default ResumeForm;