import { Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import AIAssistantModal from './AIAssistantModal'

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {
    const MAX_WORDS = 100;
    
    const wordCount = data ? data.trim().split(/\s+/).filter(word => word.length > 0).length : 0;

    const handleTextChange = (e) => {
        const text = e.target.value;
        const currentWords = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        // Allow change if under/equal to max words, or if they are just reducing the text/words
        if (currentWords <= MAX_WORDS || currentWords < wordCount) {
            onChange(text);
        }
    }

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                <p className='text-sm text-gray-500'>Add summary for your resume here</p>
            </div>
            <button onClick={() => setIsAiModalOpen(true)} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 font-medium cursor-pointer'>
                <Sparkles className='size-4'/>
                AI Enhance
            </button>
        </div>
        <div className='mt-6'>
            <textarea 
                value={data || ""} 
                onChange={handleTextChange} 
                rows={7} 
                className={`w-full p-3 px-4 mt-2 border text-sm rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${wordCount >= MAX_WORDS ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-300'}`}
                placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
            />
            <div className="flex justify-between items-start mt-1 px-1">
                <p className="text-xs text-gray-500 flex-1 pr-4">Tip: Keep it concise (3-4) sentences and focus on your most relevant achievements and skills. ATS systems prefer summaries around 50-100 words max.</p>
                <div className={`text-xs font-semibold whitespace-nowrap mt-0.5 ${wordCount >= MAX_WORDS ? 'text-red-500' : 'text-gray-500'}`}>
                    {wordCount} / {MAX_WORDS} words
                </div>
            </div>
        </div>

        <AIAssistantModal 
            isOpen={isAiModalOpen} 
            onClose={() => setIsAiModalOpen(false)} 
            endpoint="/api/ai/enhance-pro-sum" 
            currentText={data} 
            onApply={(suggestion) => onChange(suggestion)} 
        />
    </div>
  )
}

export default ProfessionalSummaryForm