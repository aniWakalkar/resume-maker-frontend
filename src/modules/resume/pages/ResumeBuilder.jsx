import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
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

  useEffect(() => {
    if (step === 3 && !hasLoadedResume && !newResume && !resumeId) {
      console.log('🔵 STEP 3 reached - Loading saved resume from API');
      fetchUserResumes();
    }
  }, [step, hasLoadedResume, newResume, resumeId]);

  useEffect(() => {
    if (resumeId && !hasLoadedResume) {
      console.log('🔵 Loading specific resume by ID:', resumeId);
      fetchSpecificResume(resumeId);
    }
  }, [resumeId]);

  const fetchSpecificResume = async (id) => {
    try {
      setLoadingResume(true);
      const response = await getResumeByIdFromBackend(id);
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
      const response = await getUserResumesFromBackend();
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const userResumes = response.data.data;
        const latestResume = userResumes.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
        loadResumeIntoForm(latestResume);
        setHasLoadedResume(true);
      } else {
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

  useEffect(() => {
    if (newResume) {
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
    if (currentResume.formData) return currentResume.formData;
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
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your saved resume...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <div className="flex-grow">
          {/* Hero Banner */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="max-w-6xl mx-auto px-4 h-full flex items-center relative z-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Resume Builder</h1>
                <p className="text-white/80 text-sm mt-1">Create your professional resume in 4 simple steps</p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-16">
            {/* Progress Indicator - Modern Style */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-8">
              <div className="flex items-center justify-between">
                {[
                  { step: 1, label: 'Experience', icon: '🎓' },
                  { step: 2, label: 'Template', icon: '📄' },
                  { step: 3, label: 'Details', icon: '✏️' },
                  { step: 4, label: 'Preview', icon: '👁️' }
                ].map((item, idx) => (
                  <div key={item.step} className="flex-1 text-center">
                    <div className="relative">
                      <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        step >= item.step 
                          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        <span className="text-sm font-bold">{item.step}</span>
                      </div>
                      {idx < 3 && (
                        <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${
                          step > item.step ? 'bg-gradient-to-r from-indigo-600 to-pink-600' : 'bg-slate-200'
                        }`} style={{ width: 'calc(100% - 2.5rem)' }} />
                      )}
                    </div>
                    <p className={`text-xs font-medium mt-2 ${
                      step >= item.step ? 'text-indigo-600' : 'text-slate-400'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                ))}
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
        <Footer />
      </div>
    </>
  );
}

export default ResumeBuilder;