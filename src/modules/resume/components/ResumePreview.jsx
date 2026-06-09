import { useRef } from 'react';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ResumePreview({ resumeData, template, onBack }) {
  const resumeRef = useRef();

  // Normalize data structure (handle both backend and frontend formats)
  const normalizedData = {
    fullName: resumeData?.personalInfo?.fullName || resumeData?.fullName || '',
    email: resumeData?.personalInfo?.email || resumeData?.email || '',
    phone: resumeData?.personalInfo?.phone || resumeData?.phone || '',
    address: resumeData?.personalInfo?.address || resumeData?.address || '',
    linkedin: resumeData?.personalInfo?.linkedin || resumeData?.linkedin || '',
    portfolio: resumeData?.personalInfo?.portfolio || resumeData?.portfolio || '',
    summary: resumeData?.personalInfo?.profileSummary || resumeData?.summary || '',
    experience: resumeData?.experience || [],
    education: resumeData?.education || [],
    skills: resumeData?.skills || [],
    projects: resumeData?.projects || [],
    certifications: resumeData?.certifications || [],
    languages: resumeData?.languages || []
  };

  const downloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${normalizedData.fullName || 'resume'}_resume.pdf`);
  };

  // Format skills for display (handle both array and string)
  const getSkillsList = () => {
    if (Array.isArray(normalizedData.skills)) {
      return normalizedData.skills.map(skill => 
        typeof skill === 'string' ? skill : skill.name
      ).filter(Boolean);
    }
    if (typeof normalizedData.skills === 'string') {
      return normalizedData.skills.split(',').map(s => s.trim());
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Edit
        </button>
        <Button onClick={downloadPDF} variant="primary">
          Download PDF
        </Button>
      </div>

      {/* Resume Preview */}
      <div ref={resumeRef} className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{normalizedData.fullName || 'Your Name'}</h1>
            <div className="flex justify-center gap-4 mt-2 text-gray-600 flex-wrap">
              {normalizedData.email && <span>{normalizedData.email}</span>}
              {normalizedData.phone && <span>| {normalizedData.phone}</span>}
            </div>
            <div className="flex justify-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
              {normalizedData.address && <span>{normalizedData.address}</span>}
              {normalizedData.linkedin && <span>| LinkedIn: {normalizedData.linkedin}</span>}
              {normalizedData.portfolio && <span>| Portfolio: {normalizedData.portfolio}</span>}
            </div>
          </div>

          {/* Summary */}
          {normalizedData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Professional Summary
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{normalizedData.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {normalizedData.experience && normalizedData.experience.length > 0 && normalizedData.experience.some(exp => exp.company || exp.position) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Work Experience
              </h2>
              {normalizedData.experience.map((exp, index) => (
                (exp.company || exp.position) && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        {exp.position && <h3 className="font-semibold text-gray-800">{exp.position}</h3>}
                        {exp.company && <p className="text-gray-600">{exp.company}</p>}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-sm text-gray-500">
                          {exp.startDate || ''} {exp.startDate && exp.endDate && '-'} {exp.endDate || 'Present'}
                        </p>
                      )}
                    </div>
                    {exp.description && <p className="text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Education */}
          {normalizedData.education && normalizedData.education.length > 0 && normalizedData.education.some(edu => edu.degree || edu.institution) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Education
              </h2>
              {normalizedData.education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        {edu.degree && <h3 className="font-semibold text-gray-800">{edu.degree}</h3>}
                        {edu.institution && <p className="text-gray-600">{edu.institution}</p>}
                      </div>
                      {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                    </div>
                    {edu.percentage && <p className="text-sm text-gray-600 mt-1">Score: {edu.percentage}</p>}
                    {edu.description && <p className="text-gray-700 mt-1 text-sm">{edu.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Skills */}
          {getSkillsList().length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {getSkillsList().map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {normalizedData.projects && normalizedData.projects.length > 0 && normalizedData.projects.some(proj => proj.name) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Projects
              </h2>
              {normalizedData.projects.map((project, index) => (
                project.name && (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    {project.technologies && (
                      <p className="text-sm text-gray-600">
                        Tech: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                      </p>
                    )}
                    {project.description && <p className="text-gray-700 mt-1">{project.description}</p>}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        View Project →
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Certifications */}
          {normalizedData.certifications && normalizedData.certifications.length > 0 && normalizedData.certifications.some(cert => cert.name) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Certifications
              </h2>
              {normalizedData.certifications.map((cert, index) => (
                cert.name && (
                  <div key={index} className="mb-2">
                    <p className="text-gray-800">
                      <span className="font-semibold">{cert.name}</span>
                      {cert.issuer && ` - ${cert.issuer}`}
                      {cert.year && ` (${cert.year})`}
                    </p>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Languages */}
          {normalizedData.languages && normalizedData.languages.length > 0 && normalizedData.languages.some(lang => lang.name) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-3">
                Languages
              </h2>
              {normalizedData.languages.map((lang, index) => (
                lang.name && (
                  <div key={index} className="mb-1">
                    <p className="text-gray-800">
                      <span className="font-semibold">{lang.name}</span>
                      {lang.proficiency && ` - ${lang.proficiency}`}
                    </p>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Empty state - no data */}
          {!normalizedData.fullName && !normalizedData.summary && getSkillsList().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No resume data available. Please go back and add your information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;