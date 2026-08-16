import { Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({data = [], onChange}) => {
    const [title, setTitle] = useState("")
    const [skillsString, setSkillsString] = useState("")

    const addSkillGroup = () => {
        if(title.trim() && skillsString.trim()) {
            const items = skillsString.split(',').map(s => s.trim()).filter(Boolean);
            onChange([...data, { title: title.trim(), items }]);
            setTitle("");
            setSkillsString("");
        }
    }

    const removeSkillGroup = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

  return (
    <div className='space-y-4'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Skills </h3>
            <p className='text-sm text-gray-500'> Add your technical and soft skills grouped by category </p>
        </div>
        <div className='flex flex-col gap-3'>
            <input 
                type="text" 
                placeholder='Skill Category (e.g., Languages)' 
                className='w-full px-3 py-2 text-sm border rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none' 
                onChange={(e) => setTitle(e.target.value)} 
                value={title} 
            />
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder='Skills (comma separated, e.g., JavaScript, Python, C++)' 
                    className='flex-1 px-3 py-2 text-sm border rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none' 
                    onChange={(e) => setSkillsString(e.target.value)} 
                    value={skillsString} 
                    onKeyDown={(e) => e.key === "Enter" && addSkillGroup()} 
                />
                <button 
                    onClick={addSkillGroup} 
                    disabled={!title.trim() || !skillsString.trim()} 
                    className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <Plus className='size-4'/> Add 
                </button>
            </div>
        </div>
        
        {data.length > 0 ? (
            <div className='space-y-3 mt-4'>
                {data.map((skillGroup, index) => {
                    let displayTitle = skillGroup?.title || "Skill";
                    let displayItems = skillGroup?.items || [skillGroup];
                    
                    return (
                        <div key={index} className='bg-gray-50 p-3 rounded border flex justify-between items-start'>
                            <div>
                                <h4 className='font-semibold text-sm text-gray-800'>{displayTitle}</h4>
                                <p className='text-sm text-gray-600'>{typeof displayItems === 'string' ? displayItems : displayItems.join(", ")}</p>
                            </div>
                            <button onClick={()=>removeSkillGroup(index)} className='p-1 text-red-500 hover:bg-red-50 rounded transition-colors'>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className='text-center py-6 text-gray-500'>
                <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300'/>
                <p>No skills added yet.</p>
                <p className='text-sm'>Add your technical and soft skills above</p>
            </div>
        )}
        <div className='bg-blue-50 p-3 rounded-lg'>
            <p className='text-sm text-blue-800'><strong>Tip:</strong> Create categories like "Frontend", "Backend", "Tools" and add your relevant skills separated by commas.</p>
        </div>
    </div>
  )
}

export default SkillsForm