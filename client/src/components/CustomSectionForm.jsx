import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const CustomSectionForm = ({data = [], onChange}) => {
  
  const addSection =() =>{
        const newSection = {
            title: "",
            description:"",
            start_date:"",
            end_date:"",
        };
        onChange([...data, newSection])
    }
    const removeSection = (index)=>{
        const updated = data.filter((_,i) => i !== index);
        onChange(updated)
    }
    const updateSection = (index, field, value)=>{
        const updated = [...data];
        updated[index] = {...updated[index], [field]:value}
        onChange(updated)
    }
  
    return (
        <div>
         <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Custom Additions</h3>
                <p className='text-sm text-gray-500'>Add custom sections like Awards, Certifications, or Languages</p>
            </div>
            <button onClick={addSection} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Plus className='size-4'/>
                Add Section
            </button>
        </div>
        <div className='space-y-4 mt-6'>
        {data.map((section, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>

                <div className='flex justify-between items-start'>
                    <h4>Custom Section #{index + 1}</h4>
                    <button onClick={()=>removeSection(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                        <Trash2 className='size-4'/>
                    </button>
                </div>

                <div className='grid gap-3'>

                    <input value={section.title || ""} onChange={(e)=>updateSection(index, "title", e.target.value)} type="text" placeholder='Section Title (e.g., Languages, Awards)' className='px-3 py-2 text-sm rounded-lg '/>
                   
                   <div className='flex gap-3'>
                       <input value={section.start_date || ""} onChange={(e)=>updateSection(index, "start_date", e.target.value)} type="month" className='w-full px-3 py-2 text-sm rounded-lg' placeholder='Start Date (Optional)'/>
                       <input value={section.end_date || ""} onChange={(e)=>updateSection(index, "end_date", e.target.value)} type="month" className='w-full px-3 py-2 text-sm rounded-lg' placeholder='End Date (Optional)'/>
                   </div>

                   <textarea rows={4} value={section.description || ""} onChange={(e)=>updateSection(index, "description", e.target.value)} type="text" className='px-3 py-2 text-sm rounded-lg resize-none' placeholder='Describe your achievements or list extra details...'/>
                </div>
                
               
            </div>
        ))}
        </div>
        
    </div>
  )
}

export default CustomSectionForm
