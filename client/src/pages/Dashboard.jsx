import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, Sparkles, XIcon, CheckCircle2, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../configs/api';
import {toast} from 'react-hot-toast';

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth)

  const colors=[ "#9333ea" , "#d97706" , "#dc2626", "#0284c7" , "#16a34a" ]
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [title, setTitle] = useState('')
  const [editResumeId, setEditResumeId] = useState('')

  // ATS AI Checker States
  const [showAtsChecker, setShowAtsChecker] = useState(false)
  const [atsResumeFile, setAtsResumeFile] = useState(null)
  const [atsJobDescription, setAtsJobDescription] = useState('')
  const [atsRoleLevel, setAtsRoleLevel] = useState('Entry Level')
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsResult, setAtsResult] = useState(null)
  const [atsImprovingState, setAtsImprovingState] = useState(false)
  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      if (!token) return;
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching resumes");
    }
  }

  const createResume = async(event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', {title}, {headers: {
        Authorization: token}})
        setAllResumes([...allResumes, data.resume])
        setTitle('')
        setShowCreateResume(false)
        navigate(`/app/choose-template/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleATSCheck = async (e) => {
    e.preventDefault();
    if (!atsResumeFile) return toast.error("Please explicitly select your resume PDF");
    if (!atsJobDescription) return toast.error("Job description is entirely compulsory");

    const formData = new FormData();
    formData.append("resumePdf", atsResumeFile);
    formData.append("jobDescription", atsJobDescription);
    formData.append("roleLevel", atsRoleLevel);

    try {
      setAtsLoading(true);
      const { data } = await api.post("/api/ai/check-ats", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token }
      });
      setAtsResult(data.atsResult);
      setAtsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to parse ATS score! Maybe the PDF is an image.");
      setAtsLoading(false);
    }
  }

  const generateImprovedResume = async () => {
    if(!atsResumeFile || !atsJobDescription) return;
    const formData = new FormData();
    formData.append("resumePdf", atsResumeFile);
    formData.append("jobDescription", atsJobDescription);
    formData.append("roleLevel", atsRoleLevel);

    try {
      setAtsImprovingState(true);
      const { data } = await api.post("/api/ai/improve-resume", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token }
      });
      setAllResumes(prev => [...prev, data.resume]);
      setAtsImprovingState(false);
      setShowAtsChecker(false);
      setAtsResult(null);
      navigate('/app/builder/' + data.resumeId);
      toast.success("AI tailored a new resume for you!");
    } catch (error) {
       toast.error(error?.response?.data?.message || "Failed to generate improved resume.");
       setAtsImprovingState(false);
    }
  }

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      if (!editResumeId) return;
      const formData = new FormData();
      formData.append('resumeId', editResumeId);
      formData.append('resumeData', JSON.stringify({ title }));

      await api.put('/api/resumes/update', formData, {
        headers: { Authorization: token }
      });
      toast.success('Resume title updated');
      setAllResumes(prev => prev.map(res => res._id === editResumeId ? { ...res, title } : res));
      setEditResumeId('');
      setTitle('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error updating title');
    }
  }

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure you want to delete this resume?');
    if(confirm){
      try {
        await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token }
        });
        setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
        toast.success("Resume deleted successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Error deleting resume');
      }
    }
  }

  useEffect(()=>{
    if(token) {
      loadAllResumes()
    }
  },[token])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, {user?.name}</p>
        <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-6'>
          <div onClick={()=>setShowCreateResume(true)} className='w-full bg-white sm:max-w-40 sm:min-w-40 h-56 flex flex-col items-center justify-center rounded-xl gap-4 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <div className='p-3.5 bg-indigo-500 text-white rounded-full group-hover:bg-indigo-600 transition-colors shadow-md'>
                <PlusIcon className='size-6'/>
            </div>
            <p className='text-[15px] font-medium group-hover:text-indigo-600 transition-colors'>Create Resume</p>
          </div>
          <div onClick={()=> setShowAtsChecker(true)} className='w-full bg-white sm:max-w-40 sm:min-w-40 h-56 flex flex-col items-center justify-center rounded-xl gap-4 text-slate-600 border border-dashed border-slate-300 group hover:border-fuchsia-500 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative'>
            <div className='absolute top-0 w-full h-1 bg-fuchsia-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left'></div>
            <div className='p-3.5 bg-fuchsia-500 text-white rounded-full group-hover:bg-fuchsia-600 group-hover:scale-110 transition-all shadow-md'>
                <Sparkles className='size-6'/>
            </div>
            <p className='text-[15px] font-medium group-hover:text-fuchsia-600 transition-colors px-4 text-center'>AI ATS Checker</p>
          </div>
        </div>
        <hr className='border-slate-300 my-6 sm:w-[305px]'/>
        <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-6'>
          {allResumes.map((resume, index)=>{
            const baseColor=colors[index % colors.length];
            return(
              <div key={index} onClick={()=>navigate(`/app/builder/${resume._id}`)} className= 'relative w-full sm:max-w-40 sm:min-w-40 h-56 flex flex-col items-center justify-center rounded-xl gap-3 border group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden' style={{background:`linear-gradient(135deg, ${baseColor}20, ${baseColor}40)`, borderColor: baseColor + '40'}}>
                
                <FilePenLineIcon className='size-8 group-hover:scale-110 mb-1 transition-transform duration-300' style={{color:baseColor}} />
                
                <p className='text-[15px] font-medium px-4 text-center line-clamp-2' style={{color:baseColor}}>{resume.title}</p>
                
                <div className='flex flex-col items-center mt-2'>
                  <p className='text-[15px] text-gray-900 font-medium'>Updated on</p>
                  <p className='text-[15px] text-gray-900 font-medium'>{new Date(resume.updatedAt).toLocaleDateString()}</p>
                </div>

                <div onClick={e=> e.stopPropagation()} className='absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button onClick={(e)=>{e.stopPropagation(); setEditResumeId(resume._id); setTitle(resume.title);}} className="p-1.5 hover:bg-white/60 rounded-md text-slate-700 transition-colors mr-1 cursor-pointer">
                      <PencilIcon className="size-4" />
                  </button>
                  <button onClick={(e)=>{e.stopPropagation(); deleteResume(resume._id)}} className="p-1.5 hover:bg-white/60 rounded-md text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                      <TrashIcon className="size-4"/>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          {showCreateResume && (
            <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className= 'fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e=> e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
                <input onChange={(e)=>setTitle(e.target.value)} value={title}  type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Create Resume</button>

                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => { 
                  setShowCreateResume(false);
                  setTitle('');
                }}
          />
              </div>
            </form>
          )
          }
          {showAtsChecker && (
            <div onClick={()=> setShowAtsChecker(false)} className= 'fixed inset-0 bg-black/70 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto'>
              
              {/* ATS Configuration View */}
              {!atsResult ? (
                <div onClick={e=> e.stopPropagation()} className='relative bg-white border shadow-2xl rounded-2xl w-full max-w-lg p-8 my-auto'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2 bg-fuchsia-100 rounded-lg text-fuchsia-600'><Sparkles size={24}/></div>
                    <div>
                      <h2 className='text-2xl font-bold tracking-tight text-gray-800'>AI ATS Checker</h2>
                      <p className='text-sm text-gray-500'>Analyze your resume seamlessly against any job role.</p>
                    </div>
                  </div>

                  <form onSubmit={handleATSCheck} className="space-y-5">
                    {/* Resume Upload Box */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Upload Resume (PDF only) <span className="text-red-500">*</span>
                      </label>
                      <label htmlFor="ats-resume" className={`flex flex-col items-center justify-center gap-2 border-2 text-slate-500 border-dashed rounded-xl p-8 hover:border-fuchsia-500 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-all cursor-pointer ${atsResumeFile ? 'border-fuchsia-500 bg-fuchsia-50 font-medium' : 'border-slate-300'}`}>
                        {atsResumeFile ? (
                          <>
                            <CheckCircle2 className="size-10 text-fuchsia-600"/>
                            <p className='text-fuchsia-700 font-bold max-w-full truncate px-4'>{atsResumeFile.name}</p>
                          </>
                        ):(
                          <>
                            <UploadCloud className='size-10'/>
                            <p>Click to browse PDF</p>
                          </>
                        )}
                      </label>
                      <input type="file" id='ats-resume' accept='application/pdf' hidden onChange={(e)=>setAtsResumeFile(e.target.files[0])}/>
                    </div>

                    {/* Role Level Optional */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Candidate Level
                      </label>
                      <select value={atsRoleLevel} onChange={(e)=>setAtsRoleLevel(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 bg-gray-50/50">
                        <option value="Student / Entry Level">Student / Entry Level (0-2 YOE)</option>
                        <option value="Intermediate Level">Intermediate Level (3-5 YOE)</option>
                        <option value="Senior Level">Senior / 5+ Experience Level</option>
                      </select>
                    </div>

                    {/* Job Description */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-700 mb-2'>
                        Job Description / Target Role <span className="text-red-500">*</span>
                      </label>
                      <textarea value={atsJobDescription} onChange={e=>setAtsJobDescription(e.target.value)} rows="4" placeholder="Paste the exact responsibilities or job description you are aiming for natively here..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 bg-gray-50/50 text-sm resize-none" required></textarea>
                    </div>

                    <button disabled={atsLoading} className="w-full mt-2 py-3.5 bg-fuchsia-600 font-semibold text-white rounded-xl shadow-md hover:bg-fuchsia-700 transition-all flex items-center justify-center gap-2 group">
                      {atsLoading ? <span className="animate-pulse">Analyzing with AI...</span> : <><Sparkles size={18} className="group-hover:scale-110 transition-transform"/> Start ATS Scan</>}
                    </button>
                  </form>

                  <XIcon className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" onClick={() => { 
                    setShowAtsChecker(false);
                    setAtsResumeFile(null);
                    setAtsJobDescription('');
                  }}/>
                </div>
              ) : (

                /* Results View UI */
                <div onClick={e=> e.stopPropagation()} className='relative bg-white border shadow-2xl rounded-2xl w-full max-w-2xl p-8 my-auto'>
                  <div className="flex justify-between items-start mb-6 border-b pb-4">
                     <div>
                        <h2 className='text-3xl font-black text-gray-900'>ATS Results</h2>
                        <p className="text-gray-500 font-medium">For: {atsRoleLevel}</p>
                     </div>
                     <div className="flex flex-col items-center">
                        <div className={`text-4xl font-black ${atsResult.score >= 80 ? 'text-green-500' : atsResult.score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                           {atsResult.score}<span className="text-lg">%</span>
                        </div>
                        <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Match</span>
                     </div>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto px-1 custom-scrollbar space-y-6">
                     
                     <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <h4 className="font-bold flex items-center gap-2 text-gray-800 mb-2"> <Sparkles size={16} className="text-fuchsia-500"/> Final Verdict</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{atsResult.finalVerdict}</p>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                           <h4 className="font-bold flex items-center gap-2 text-green-700 mb-3"><CheckCircle2 size={16}/> Matched Keywords</h4>
                           <div className="flex flex-wrap gap-2">
                              {atsResult.matchedKeywords?.map((kw, i)=>(
                                 <span key={i} className="px-2.5 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-md uppercase tracking-wider">{kw}</span>
                              ))}
                              {atsResult.matchedKeywords?.length===0 && <span className="text-xs text-gray-500">No strong matches found.</span>}
                           </div>
                        </div>
                        <div>
                           <h4 className="font-bold flex items-center gap-2 text-red-700 mb-3"><XCircle size={16}/> Missing Keywords</h4>
                           <div className="flex flex-wrap gap-2">
                              {atsResult.missingKeywords?.map((kw, i)=>(
                                 <span key={i} className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-md uppercase tracking-wider">{kw}</span>
                              ))}
                              {atsResult.missingKeywords?.length===0 && <span className="text-xs text-gray-500">Looking great!</span>}
                           </div>
                        </div>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                           <h4 className="font-bold text-gray-800 mb-2">Strengths 🚀</h4>
                           <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-gray-600">
                             {atsResult.strengths?.map((str, i)=><li key={i}>{str}</li>)}
                           </ul>
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800 mb-2">Weaknesses ⚠️</h4>
                           <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-gray-600">
                             {atsResult.weaknesses?.map((wk, i)=><li key={i}>{wk}</li>)}
                           </ul>
                        </div>
                     </div>

                  </div>

                  <div className="mt-8 pt-4 border-t w-full flex flex-col-reverse sm:flex-row justify-between gap-3">
                    <button onClick={generateImprovedResume} disabled={atsImprovingState} className="px-6 py-2.5 bg-fuchsia-600 shadow-md text-white font-medium rounded-lg hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2">
                       {atsImprovingState ? <span className="animate-pulse">Generating ATS Resume...</span> : <><Sparkles size={18}/> Generate Auto-Tailored Resume</>}
                    </button>
                    <button onClick={()=>{setAtsResult(null); setAtsResumeFile(null)}} className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">Start New Scan</button>
                  </div>

                  <XIcon className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" onClick={() => { 
                    setShowAtsChecker(false);
                    setAtsResult(null);
                  }}/>
                </div>
              )}
            </div>
          )}
          
          {editResumeId && (
            <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className= 'fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e=> e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
                <input onChange={(e)=>setTitle(e.target.value)} value={title}  type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Update</button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => {setEditResumeId(false); setTitle('')
                }}/>
              </div>
            </form>
          )} 
        </div>
      </div>
    </div>
  )
}

export default Dashboard