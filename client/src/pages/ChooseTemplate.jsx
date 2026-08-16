import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../configs/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ArrowRightIcon, CheckCircle2 } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import { dummyResumeData } from '../assets/assets';

const templatesList = [
    {
        id: "ats-template",
        name: 'ATS Classic',
        preview: "An ATS friendly, formatted, clean and clear structured resume template",
        color: "#3B82F6"
    },
    {
        id: "classic",
        name: "Classic",
        preview: "A clean, traditional resume format with clear sections and professional typography",
        color: "#16a34a"
    },
    {
        id: "modern",
        name: "Modern",
        preview: "Sleek design with strategic use of color and modern font choices",
        color: "#9333ea"
    },
    {
        id: "minimal-image",
        name: "Minimal Image",
        preview: "Minimal design with a single image and clean typography",
        color: "#d97706"
    },
    {
        id: "minimal",
        name: "Minimal",
        preview: "Ultra-clean design that puts your content front and center",
        color: "#0284c7"
    }
];

const ChooseTemplate = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const [selected, setSelected] = useState('ats-template');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleContinue = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify({ template: selected }));
      
      await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });
      navigate(`/app/builder/${resumeId}`);
    } catch (error) {
      toast.error('Failed to update template. Continuing anyway...');
      navigate(`/app/builder/${resumeId}`);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4'>
      <div className='max-w-7xl mx-auto'>
        
        <div className='text-center mb-12 mt-4'>
          <h1 className='text-4xl font-extrabold text-gray-900 mb-4 tracking-tight tracking-[-0.02em]'>Choose Your Template</h1>
          <p className='text-lg text-gray-500'>Select a professional design to get started. You can always change it later inside the builder.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto'>
            {templatesList.map((tpl) => (
                <div 
                  key={tpl.id} 
                  onClick={() => setSelected(tpl.id)}
                  className={`group relative flex flex-col items-center bg-white rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden w-full max-w-[400px] ${selected === tpl.id ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02]' : 'border border-gray-200 hover:shadow-xl hover:-translate-y-2'}`}
                  style={{ containerType: 'inline-size' }}
                >
                    {/* Miniature Preview Container */}
                    <div className="w-full overflow-hidden relative pointer-events-none rounded-t-2xl border-b border-gray-200 bg-white">
                        
                        {/* Overlay to prevent interactions */}
                        <div className="absolute inset-0 z-10 w-full h-full"></div>

                        {/* ForeignObject perfectly scales the fixed-width HTML like an image */}
                        <svg viewBox="0 0 794 1123" className="w-full block pointer-events-none">
                            <foreignObject width="794" height="1123">
                                <div className="w-[794px] h-[1123px] bg-white text-left">
                                    <ResumePreview data={dummyResumeData[0]} template={tpl.id} accentColor={tpl.color} />
                                </div>
                            </foreignObject>
                        </svg>

                        {selected === tpl.id && (
                          <div className="absolute top-4 right-4 z-20">
                              <CheckCircle2 className="w-8 h-8 text-blue-500 fill-white" />
                          </div>
                        )}
                    </div>

                    <div className='p-6 py-5 text-center w-full bg-white z-20'>
                        <h3 className='text-lg font-bold text-gray-900 mb-2'>{tpl.name}</h3>
                        <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>{tpl.preview}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className='mt-12 flex justify-center pb-20'>
            <button 
                onClick={handleContinue} 
                disabled={isUpdating}
                className='flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-75 disabled:active:scale-100 cursor-pointer'
            >
                {isUpdating ? 'Preparing...' : 'Use This Template'}
                <ArrowRightIcon className='size-5' />
            </button>
        </div>

      </div>
    </div>
  )
}

export default ChooseTemplate;
