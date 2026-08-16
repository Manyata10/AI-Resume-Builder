import { Plus, Trash2, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import AIAssistantModal from './AIAssistantModal'

const ProjectForm = ({data = [], onChange}) => {
  const [aiModalTarget, setAiModalTarget] = useState(null);
  
  const addProject =() =>{
        const newProject = {
            name: "",
            type:"",
            description:"",
        };
        onChange([...data, newProject])
    }
    const removeProject = (index)=>{
        const updated = data.filter((_,i) => i !== index);
        onChange(updated)
    }
    const updateProject = (index, field, value)=>{
        const updated = [...data];
        updated[index] = {...updated[index], [field]:value}
        onChange(updated)
    }
  
    return (
        <div>
         <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                <p className='text-sm text-gray-500'>Add your Projects</p>
            </div>
            <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Plus className='size-4'/>
                Add Project
            </button>
        </div>
        <div className='space-y-4 mt-6'>
        {data.map((projects, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>

                <div className='flex justify-between items-start'>
                    <h4>Project #{index + 1}</h4>
                    <button onClick={()=>removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                        <Trash2 className='size-4'/>
                    </button>
                </div>

                <div className='grid gap-3'>

                    <input value={projects.name || ""} onChange={(e)=>updateProject(index, "name", e.target.value)} type="text" placeholder='Project Name' className='px-3 py-2 text-sm rounded-lg '/>

                    <input value={projects.type || ""} onChange={(e)=>updateProject(index, "type", e.target.value)} type="text" placeholder='Project Type' className='px-3 py-2 text-sm rounded-lg'/>
                   
                   <div className='flex items-center justify-between mt-2'>
                        <label className='text-sm text-gray-700' htmlFor="">Project Description</label>
                        <button onClick={() => setAiModalTarget(index)} className='flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 cursor-pointer'>
                            <Sparkles className='w-3 h-3'/>
                            Enhance with AI
                        </button>
                    </div>
                   <textarea rows={4} value={projects.description || ""} onChange={(e)=>updateProject(index, "description", e.target.value)} type="text" className='px-3 py-2 text-sm rounded-lg resize-none' placeholder='Describe your Project...'/>
                </div>
                
               
            </div>
        ))}
        </div>
        
        <AIAssistantModal 
            isOpen={aiModalTarget !== null} 
            onClose={() => setAiModalTarget(null)} 
            endpoint="/api/ai/enhance-project-desc" 
            currentText={aiModalTarget !== null && data[aiModalTarget] ? data[aiModalTarget].description : ""} 
            onApply={(suggestion) => {
                if (aiModalTarget !== null) {
                    updateProject(aiModalTarget, "description", suggestion);
                }
            }} 
        />
    </div>
  )
}

export default ProjectForm