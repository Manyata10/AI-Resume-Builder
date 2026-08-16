import React, {useEffect, useState, useRef} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User, PlusIcon, Layout, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import { toast } from 'react-hot-toast';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import CustomSectionForm from '../components/CustomSectionForm';


const ResumeBuilder = () => {

  const {resumeId} = useParams();
  const navigate = useNavigate();

  const [zoomLevel, setZoomLevel] = useState(100);
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 40));
  const handleZoomReset = () => setZoomLevel(100);

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info:{},
    professional_summary:"",
    experience:[],
    education:[],
    project:[],
    skills:[],
    custom_sections:[],
    template:"classic",
    accent_color: "#3B82F6",
    public: false,

  })

  const { token } = useSelector(state => state.auth);

  const loadExistingResume = async () => {
    try {
      if (!token) return;
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token }
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error loading resume');
    }
  }

  const saveResume = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(resumeData));
      formData.append('removeBackground', removeBackground);

      await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error saving resume');
    }
  }

  const handleChangeTemplate = async () => {
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(resumeData));
      formData.append('removeBackground', removeBackground);

      await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });
      navigate(`/app/choose-template/${resumeId}`);
    } catch (error) {
      toast.error('Failed to save before switching. Please save first.');
    }
  };

  const [activeSectionIndex, setActiveSectionIndex] = useState (0);
  const [removeBackground, setRemoveBackground] = useState(false);

  // Robust mathematical zoom system directly tied to the physical layout window
  const previewContainerRef = useRef(null);
  const [baseZoom, setBaseZoom] = useState(0.85); // Default fallback

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        // Leave exactly 80px total padding (40px per side)
        const appropriateZoom = (width - 80) / 794;
        setBaseZoom(appropriateZoom);
    });
    observer.observe(previewContainerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const finalZoomFactor = baseZoom * (zoomLevel / 100);

  const sections = [
    {id:"personal", name: "Personal Info", icon:User},
    {id:"summary", name: "Summary", icon:FileText},
    {id:"experience", name: "Experience", icon:Briefcase},
    {id:"education", name: "Education", icon:GraduationCap},
    {id:"project", name: "Projects", icon:FolderIcon},
    {id:"skills", name: "Skills", icon:Sparkles},
    {id:"custom", name: "More", icon:PlusIcon},
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(()=> {
    if (token) {
      loadExistingResume()
    }
  },[token])

  const changeResumeVisibility = async() => {
    setResumeData({...resumeData, public: !resumeData.public})
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume",})
    }else{
      alert('Share not supportes on this browser.')
    }
  }

  const downloadResume = ()=>{
    window.print();
  }


  return (
    <div>

      <div className="max-w-7xl mx-auto px-4 py-6 print:hidden">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all' gap-2 items-cener text-slate-500 hover:text-slate-700 transition-all>
        <ArrowLeftIcon className='size-4'/>Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-12'>
          
          { /* Left Panel - Form */ }
          <div className= 'relative lg:col-span-5 rounded-lg overflow-hidden print:hidden'>
            <div className= 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

              {/* {Section Navigation} */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

                <div className='flex items-center gap-2'>
                  <button onClick={handleChangeTemplate} className='flex items-center gap-1 text-sm text-blue-600 bg-linear-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg'>
                    <Layout size={14} /><span className='max-sm:hidden'>Change Template</span>
                  </button>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev=>({...prev, accent_color: color}))}/>
                </div>
                  


              <div className='flex items-center'>
                {activeSectionIndex !== 0 && (
                  <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1, 0))} className= 'flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                    <ChevronLeft className='size-4'/>Previous
                  </button>
                )}
              </div>
                <button onClick={()=> setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1, sections.length-1))} className= {`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length-1}>
                  Next <ChevronRight className='size-4'/>
                </button>
              </div>


              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev=>({...prev, personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev=> ({...prev, professional_summary:data}))} setResumeData={setResumeData}/>
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=> ({...prev, experience: data}))}/>
                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=> ({...prev, education: data}))}/>
                )}
                {activeSection.id === 'project' && (
                  <ProjectForm data={resumeData.project} onChange={(data)=>setResumeData(prev=> ({...prev, project: data}))}/>
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data)=>setResumeData(prev=> ({...prev, skills: data}))}/>
                )}
                {activeSection.id === 'custom' && (
                  <CustomSectionForm data={resumeData.custom_sections} onChange={(data)=>setResumeData(prev=> ({...prev, custom_sections: data}))}/>
                )}
              </div>
              <button onClick={saveResume} className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm cursor-pointer'>
                Save Changes
              </button>
            </div>
          </div>
          
          { /* Right Panel -Preview */}
          <div className='lg:col-span-7 max-lg:mt-6 bg-gray-50 flex flex-col rounded-xl border border-gray-200 overflow-hidden relative lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] print:static print:h-auto print:border-none print:bg-white print:overflow-visible print:col-span-12 print:block'>
                
                {/* ---- Header / buttons ---- */}
                <div className='flex items-center justify-between p-3.5 bg-white border-b border-gray-200 z-50 shadow-sm overflow-x-auto custom-scrollbar flex-shrink-0 print:hidden'>
                    <div className='flex items-center gap-4'>
                        <h3 className='font-semibold text-gray-700 flex items-center gap-1.5 text-sm whitespace-nowrap'>
                            <EyeIcon size={16} className="text-gray-400"/> Live Preview
                        </h3>
                        
                        {/* Interactive Zoom Controls */}
                        <div className="flex items-center bg-gray-100 rounded-md p-1 border border-gray-200">
                            <button onClick={handleZoomOut} className="p-1 text-gray-600 hover:bg-white hover:text-purple-600 hover:shadow-sm rounded transition-all" title="Zoom Out"><ZoomOut size={14}/></button>
                            <span className="text-[11px] font-medium w-10 text-center select-none text-gray-600">{zoomLevel}%</span>
                            <button onClick={handleZoomIn} className="p-1 text-gray-600 hover:bg-white hover:text-purple-600 hover:shadow-sm rounded transition-all" title="Zoom In"><ZoomIn size={14}/></button>
                            <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                            <button onClick={handleZoomReset} className="p-1 text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded transition-all" title="Reset Zoom"><RotateCcw size={12}/></button>
                        </div>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                        {resumeData.public && (
                          <button onClick={handleShare} className='flex items-center p-2 px-3 gap-1.5 text-xs bg-white text-blue-700 rounded-md shadow-sm hover:shadow ring-1 ring-blue-200 hover:ring-blue-300 hover:bg-blue-50 transition-all font-medium whitespace-nowrap'>
                            <Share2Icon className='size-3.5'/> Share
                          </button>
                        )}
                        <button onClick={changeResumeVisibility} className='flex items-center p-2 px-3 gap-1.5 text-xs bg-white text-purple-700 rounded-md shadow-sm hover:shadow ring-1 ring-purple-200 hover:ring-purple-300 hover:bg-purple-50 transition-all font-medium whitespace-nowrap'>
                          {resumeData.public ? <EyeIcon className='size-3.5'/> : <EyeOffIcon className='size-3.5'/>}
                          {resumeData.public ? 'Public' : 'Private'}
                        </button>
                        <button onClick={downloadResume} className='flex items-center gap-1.5 px-4 py-2 text-xs bg-green-600 text-white rounded-md shadow hover:bg-green-700 hover:shadow-md transition-all font-medium whitespace-nowrap'>
                          <DownloadIcon className='size-3.5'/> Download PDF
                        </button>
                    </div>
                </div>

                {/* Scaled Preview Area */}
                <div ref={previewContainerRef} className="flex-1 w-full py-10 overflow-auto custom-scrollbar bg-slate-300 shadow-inner print:overflow-visible print:bg-white print:p-0 print:m-0 print:shadow-none">
                     <style>
                        {`
                          @media print {
                            .print-zoom-reset {
                              zoom: 1 !important;
                              transform: none !important;
                              width: 100% !important;
                              box-shadow: none !important;
                            }
                          }
                        `}
                     </style>
                     <div 
                        className={`origin-top transition-all duration-200 rounded-sm shrink-0 mx-auto print-zoom-reset ${zoomLevel <= 100 ? 'shadow-2xl' : 'shadow-xl'}`}
                        style={{ 
                            zoom: finalZoomFactor,
                            width: "794px"
                        }}
                     >
                         <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
                     </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder