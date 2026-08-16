import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2 } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const AIAssistantModal = ({ isOpen, onClose, onApply, endpoint, currentText }) => {
    const { token } = useSelector(state => state.auth);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasEnhanced, setHasEnhanced] = useState(false);

    const generateSuggestions = async () => {
        if (!currentText || currentText.trim().length === 0) {
            toast.error("Please write some text first for the AI to enhance.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post(endpoint, { userContent: currentText }, {
                headers: { Authorization: token }
            });
            const enhancedData = response.data.enhancedContent;
            
            // Ensure we handle both string and array formats just in case
            if (Array.isArray(enhancedData)) {
                setSuggestions(enhancedData);
            } else {
                try {
                    const parsed = JSON.parse(enhancedData);
                    setSuggestions(Array.isArray(parsed) ? parsed : [enhancedData]);
                } catch {
                    // Fallback to splitting by newlines and filtering if it's plain text
                    const parts = enhancedData.split('\n').filter(p => p.trim().length > 10);
                    setSuggestions(parts.length > 0 ? parts : [enhancedData]);
                }
            }
            setHasEnhanced(true);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error generating AI suggestions.');
            setHasEnhanced(false);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-600"/> 
                        AI Smart Suggestion
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100 shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {!hasEnhanced && !isLoading && (
                        <div className="text-center py-10">
                            <Sparkles className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                            <h4 className="text-xl text-gray-900 font-bold mb-3">Enhance your text with AI</h4>
                            <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">Our AI will analyze your current text and provide 3 highly professional, ATS-friendly variations to make your resume effortlessly stand out against others.</p>
                            <button onClick={generateSuggestions} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-bold shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 active:scale-95">
                                Generate Options Automatically
                            </button>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-6" />
                            <p className="text-base font-bold text-gray-800">AI is working its magic...</p>
                            <p className="text-sm text-gray-500 mt-2">Writing professional, ATS-friendly variations just for you.</p>
                        </div>
                    )}

                    {hasEnhanced && !isLoading && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-500 mb-3 px-1">Select a suggestion to apply it directly to your resume:</p>
                            <div className="grid gap-3">
                                {suggestions.map((suggestion, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => { onApply(suggestion); onClose(); toast.success("AI Suggestion Applied!") }}
                                        className="p-5 rounded-xl border-2 border-purple-100/50 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50 cursor-pointer transition-all group relative md:pr-14"
                                    >
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{suggestion}</p>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity max-md:hidden">
                                            <div className="bg-purple-600 text-white p-2 rounded-full shadow-md">
                                                <Check size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {hasEnhanced && !isLoading && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <button onClick={generateSuggestions} className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1.5 transition-colors">
                            <Sparkles size={16}/> Regenerate
                        </button>
                        <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all focus:ring-4 ring-gray-100">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAssistantModal;
