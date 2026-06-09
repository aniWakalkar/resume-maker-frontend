import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import ExperienceSelector from '../components/ExperienceSelector';
import ResumeTemplates from '../components/ResumeTemplates';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { 
  setExperienceType, 
  setSelectedTemplate, 
  setCurrentStep,
  loadFromLocalStorage,
  clearResumeState,
  setCurrentResume
} from '../../../redux/slices/resumeSlice';
import { getUserResumesFromBackend, getResumeByIdFromBackend } from '../../../services/api';

function ResumeBuilder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const newResume = searchParams.get('new') === 'true';
  
  const { 
    experienceType, 
    selectedTemplate, 
    currentStep,
    currentResume
  } = useSelector((state) => state.resume);
  
  const [step, setStep] = useState(1);
  const [localExperienceType, setLocalExperienceType] = useState(null);
  const [localSelectedTemplate, setLocalSelectedTemplate] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [hasLoadedResume, setHasLoadedResume] = useState(false);

  // Load saved resume when entering STEP 3 (form)
  useEffect(() => {
    if (step === 3 && !hasLoadedResume && !newResume && !resumeId) {
      console.log('🔵 STEP 3 reached - Loading saved resume from API');
      fetchUserResumes();
    }
  }, [step, hasLoadedResume, newResume, resumeId]);

  // If specific resume ID is provided, load it regardless of step
  useEffect(() => {
    if (resumeId && !hasLoadedResume) {
      console.log('🔵 Loading specific resume by ID:', resumeId);
      fetchSpecificResume(resumeId);
    }
  }, [resumeId]);

  const fetchSpecificResume = async (id) => {
    try {
      setLoadingResume(true);
      console.log('📡 API CALL: getResumeByIdFromBackend with ID:', id);
      const response = await getResumeByIdFromBackend(id);
      console.log('📡 API RESPONSE:', response);
      
      if (response.data.success && response.data.data) {
        loadResumeIntoForm(response.data.data);
        setHasLoadedResume(true);
      }
    } catch (error) {
      console.error('❌ Error fetching specific resume:', error);
      setLoadingResume(false);
    }
  };

  const fetchUserResumes = async () => {
    try {
      setLoadingResume(true);
      console.log('📡 API CALL 3: getUserResumesFromBackend() - Fetching user\'s saved resumes');
      const response = await getUserResumesFromBackend();
      console.log('📡 API RESPONSE 3:', response);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const userResumes = response.data.data;
        console.log(`✅ Found ${userResumes.length} saved resumes`);
        
        const latestResume = userResumes.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
        
        console.log('📝 Loading latest resume into form:', latestResume._id);
        loadResumeIntoForm(latestResume);
        setHasLoadedResume(true);
      } else {
        console.log('❌ No saved resumes found - starting fresh');
        setLoadingResume(false);
        setHasLoadedResume(true);
      }
    } catch (error) {
      console.error('❌ Error fetching user resumes:', error);
      setLoadingResume(false);
      setHasLoadedResume(true);
    }
  };

  const loadResumeIntoForm = (resume) => {
    console.log('📝 Loading resume into form:', resume);
    
    dispatch(setCurrentResume(resume));
    
    if (resume.experienceType) {
      setLocalExperienceType(resume.experienceType);
      dispatch(setExperienceType(resume.experienceType));
    }
    
    if (resume.templateId) {
      let templateData;
      if (typeof resume.templateId === 'object') {
        templateData = {
          _id: resume.templateId._id,
          slug: resume.templateSlug,
          name: resume.templateName,
          category: resume.templateId?.category
        };
      } else {
        templateData = {
          _id: resume.templateId,
          slug: resume.templateSlug,
          name: resume.templateName
        };
      }
      setLocalSelectedTemplate(templateData);
      dispatch(setSelectedTemplate(templateData));
    }
    
    setLoadingResume(false);
  };

  // On mount, set initial step
  useEffect(() => {
    if (newResume) {
      console.log('🆕 Creating new resume - starting from step 1');
      dispatch(clearResumeState());
      setStep(1);
      setLocalExperienceType(null);
      setLocalSelectedTemplate(null);
    } else if (currentStep) {
      setStep(currentStep);
    }
  }, []);

  const handleExperienceSelect = (type) => {
    setLocalExperienceType(type);
    setStep(2);
    dispatch(setExperienceType(type));
    dispatch(setCurrentStep(2));
  };

  const handleTemplateSelect = (template) => {
    setLocalSelectedTemplate(template);
    setStep(3);
    dispatch(setSelectedTemplate(template));
    dispatch(setCurrentStep(3));
  };

  const handleFormSubmit = (data) => {
    setStep(4);
    dispatch(setCurrentStep(4));
  };

  const handleBackToForm = () => {
    setStep(3);
    dispatch(setCurrentStep(3));
  };

  const handleBackToTemplates = () => {
    setStep(2);
    dispatch(setCurrentStep(2));
  };

  const handleBackToExperience = () => {
    setStep(1);
    dispatch(setCurrentStep(1));
  };

  const getResumeDataForPreview = () => {
    if (!currentResume) return null;
    
    if (currentResume.formData) {
      return currentResume.formData;
    }
    
    if (currentResume.personalInfo) {
      return {
        fullName: currentResume.personalInfo.fullName,
        email: currentResume.personalInfo.email,
        phone: currentResume.personalInfo.phone,
        address: currentResume.personalInfo.address,
        linkedin: currentResume.personalInfo.linkedin,
        portfolio: currentResume.personalInfo.portfolio,
        summary: currentResume.personalInfo.profileSummary || currentResume.summary,
        experience: currentResume.experience || [],
        education: currentResume.education || [],
        skills: Array.isArray(currentResume.skills) ? currentResume.skills.map(s => s.name).join(', ') : '',
        projects: currentResume.projects || [],
        certifications: currentResume.certifications || [],
        languages: currentResume.languages || []
      };
    }
    
    return currentResume;
  };

  const resumePreviewData = getResumeDataForPreview();

  if (loadingResume) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your saved resume...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <div className={`w-16 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  4
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-16 text-sm text-gray-600">
                <span>Experience</span>
                <span>Template</span>
                <span>Details</span>
                <span>Preview</span>
              </div>
            </div>
          </div>

          {/* Step 1: Experience Level */}
          {step === 1 && (
            <ExperienceSelector onSelect={handleExperienceSelect} />
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && localExperienceType && (
            <ResumeTemplates 
              category={localExperienceType} 
              onSelectTemplate={handleTemplateSelect}
              onBack={handleBackToExperience}
            />
          )}

          {/* Step 3: Resume Form */}
          {step === 3 && localSelectedTemplate && (
            <ResumeForm
              template={localSelectedTemplate}
              onSubmit={handleFormSubmit}
              savedResume={currentResume}
              onBack={handleBackToTemplates}
            />
          )}

          {/* Step 4: Resume Preview & Download */}
          {step === 4 && resumePreviewData && (
            <ResumePreview
              resumeData={resumePreviewData}
              template={localSelectedTemplate}
              onBack={handleBackToForm}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ResumeBuilder;