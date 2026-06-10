import { useRef } from 'react';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ResumePreview({ resumeData, template, onBack }) {
  const resumeRef = useRef();

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
      {/* Header with Back Button and Download */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Edit
        </button>
        <Button onClick={downloadPDF} variant="primary" className="!rounded-xl !bg-gradient-to-r !from-indigo-600 !to-purple-600">
          Download PDF
        </Button>
      </div>

      {/* Resume Preview */}
      <div ref={resumeRef} className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b border-slate-200">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">{normalizedData.fullName || 'Your Name'}</h1>
            <div className="flex justify-center gap-4 text-slate-600 flex-wrap">
              {normalizedData.email && <span>{normalizedData.email}</span>}
              {normalizedData.phone && <span>| {normalizedData.phone}</span>}
            </div>
            <div className="flex justify-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
              {normalizedData.address && <span>{normalizedData.address}</span>}
              {normalizedData.linkedin && <span>| LinkedIn: {normalizedData.linkedin}</span>}
              {normalizedData.portfolio && <span>| Portfolio: {normalizedData.portfolio}</span>}
            </div>
          </div>

          {/* Summary */}
          {normalizedData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Professional Summary
              </h2>
              <p className="text-slate-600 leading-relaxed">{normalizedData.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {normalizedData.experience && normalizedData.experience.length > 0 && normalizedData.experience.some(exp => exp.company || exp.position) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Work Experience
              </h2>
              {normalizedData.experience.map((exp, index) => (
                (exp.company || exp.position) && (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{exp.position || 'Position'}</h3>
                        <p className="text-indigo-600 font-medium">{exp.company || 'Company'}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-sm text-slate-500">
                          {exp.startDate || ''} {exp.startDate && exp.endDate && '-'} {exp.endDate || 'Present'}
                        </p>
                      )}
                    </div>
                    {exp.description && <p className="text-slate-600 mt-2">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Education */}
          {normalizedData.education && normalizedData.education.length > 0 && normalizedData.education.some(edu => edu.degree || edu.institution) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Education
              </h2>
              {normalizedData.education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{edu.degree || 'Degree'}</h3>
                        <p className="text-slate-600">{edu.institution || 'Institution'}</p>
                      </div>
                      {edu.year && <p className="text-sm text-slate-500">{edu.year}</p>}
                    </div>
                    {edu.percentage && <p className="text-sm text-slate-600 mt-1">Score: {edu.percentage}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Skills */}
          {getSkillsList().length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {getSkillsList().map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {normalizedData.projects && normalizedData.projects.length > 0 && normalizedData.projects.some(proj => proj.name) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Projects
              </h2>
              {normalizedData.projects.map((project, index) => (
                project.name && (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-slate-800">{project.name}</h3>
                    {project.technologies && (
                      <p className="text-sm text-indigo-600 mt-1">Tech: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</p>
                    )}
                    {project.description && <p className="text-slate-600 mt-1">{project.description}</p>}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Certifications */}
          {normalizedData.certifications && normalizedData.certifications.length > 0 && normalizedData.certifications.some(cert => cert.name) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Certifications
              </h2>
              {normalizedData.certifications.map((cert, index) => (
                cert.name && (
                  <div key={index} className="mb-2">
                    <p className="text-slate-700">
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
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-3">
                Languages
              </h2>
              {normalizedData.languages.map((lang, index) => (
                lang.name && (
                  <div key={index} className="mb-1">
                    <p className="text-slate-700">
                      <span className="font-semibold">{lang.name}</span>
                      {lang.proficiency && ` - ${lang.proficiency}`}
                    </p>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Empty state */}
          {!normalizedData.fullName && !normalizedData.summary && getSkillsList().length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500">No resume data available. Please go back and add your information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumePreview;