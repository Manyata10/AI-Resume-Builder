import { Mail, Phone, MapPin, Linkedin, Globe, Github, Code } from "lucide-react";

const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 font-light text-[13px] leading-snug">
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-nowrap items-center gap-4 text-sm text-gray-600 whitespace-nowrap">
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Mail size={14}/> Email-id</a>
                    )}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Phone size={14}/> {data.personal_info.phone}</a>
                    )}
                    {data.personal_info?.location && <span className="flex items-center gap-1"><MapPin size={14}/> {data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <a href={data.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Linkedin size={14}/> LinkedIn</a>
                    )}
                    {data.personal_info?.github && (
                        <a href={data.personal_info.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Github size={14}/> GitHub</a>
                    )}
                    {data.personal_info?.leetcode && (
                        <a href={data.personal_info.leetcode} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Code size={14}/> LeetCode</a>
                    )}
                    {data.personal_info?.website && (
                        <a href={data.personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors"><Globe size={14}/> Portfolio</a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">CGPA: {edu.gpa}</p>}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(edu.graduation_date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="space-y-2">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700">
                                <strong>{skill.title || "Skill"}:</strong> {skill.items ? skill.items.join(", ") : skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Custom Sections */}
            {data.custom_sections && data.custom_sections.length > 0 && (
                <div className="space-y-10">
                    {data.custom_sections.map((section, index) => (
                        <section key={index}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                                    {section.title || "Additional Info"}
                                </h2>
                                {(section.start_date || section.end_date) && (
                                    <span className="text-sm text-gray-500">
                                        {formatDate(section.start_date)}
                                        {formatDate(section.start_date) && formatDate(section.end_date) ? " - " : ""}
                                        {formatDate(section.end_date)}
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {section.description}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MinimalTemplate;