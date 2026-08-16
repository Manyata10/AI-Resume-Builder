import React, { useEffect, useRef, useState } from 'react'
import ATSProfessionalTemplate from './templates/ATSClassic'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'

const ResumePreview = ({data, template, accentColor, classes = ""}) => {
    
    const [resumeHeight, setResumeHeight] = useState(1123);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setResumeHeight(entries[0].target.offsetHeight);
        });
        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [data, template, classes]);

    const numPages = Math.max(1, Math.ceil(resumeHeight / 1123));

    const renderTemplate = ()=>{
        switch (template){
            case "ats-template":
                return <ATSProfessionalTemplate data={data} accentColor={accentColor}/>
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimum":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
            default:
                return <ClassicTemplate data={data} accentColor={accentColor} />;
        }
    }

  return (
    <div className='w-full flex justify-center relative bg-transparent'>
        
        {/* The Continuous Master Flow - Used exclusively for measuring dynamically AND for the actual final print export */}
        <div id="resume-preview" className="absolute top-0 opacity-0 pointer-events-none -z-50 print:opacity-100 print:pointer-events-auto print:relative print:z-0">
            <div ref={contentRef} className={'w-[794px] min-h-[1123px] bg-white print:shadow-none print:border-none break-words print:overflow-visible flex flex-col ' + classes}>
                {renderTemplate()}
            </div>
        </div>

        {/* The Visual UI Pagination Engine (Disabled during printing!) */}
        <div className="flex flex-col gap-10 print:hidden relative z-10 w-[794px]">
            {[...Array(numPages)].map((_, i) => (
                <div key={i} className="relative w-[794px] h-[1123px] max-h-[1123px] bg-white overflow-hidden shadow-2xl ring-1 ring-gray-200 shrink-0">
                    
                    {/* Minimalist Watermark showing which page you are looking at */}
                    {numPages > 1 && (
                        <div className="absolute bottom-2 right-4 text-gray-300 text-xs select-none z-50">
                            Page {i + 1} of {numPages}
                        </div>
                    )}

                    {/* Highly exact slicing translation via margin-padding scaling */}
                    <div className="w-[794px]" style={{ marginTop: `-${i * 1123}px` }}>
                        <div className={'w-[794px] min-h-[1123px] bg-white break-words flex flex-col ' + classes}>
                            {renderTemplate()}
                        </div>
                    </div>
                    
                </div>
            ))}
        </div>

        <style jsx>
            {`
            @page {
                size: a4 portrait;
                margin: 0;
            }

            @media print {
                html, body {
                    width: 210mm;
                    height: 297mm;
                    overflow: visible;
                }

                body * {
                    visibility: hidden;
                }

                #resume-preview, #resume-preview * {
                    visibility: visible;
                }
            }
            `}
        </style>      
    </div>
  )
}

export default ResumePreview