import { Mail, Phone, MapPin, Linkedin, Globe, Github, Code } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800 text-[13px] leading-snug">
            {/* Header */}
            <header className="text-center mb-5 pb-4 border-b-[1.5px]" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-nowrap justify-center items-center gap-3 text-sm text-gray-600 whitespace-nowrap">
                    {data.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Mail className="size-4" />
                            <span>Email-id</span>
                        </a>
                    )}
                    {data.personal_info?.phone && (
                        <a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Phone className="size-4" />
                            <span>{data.personal_info.phone}</span>
                        </a>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <a href={data.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Linkedin className="size-4" />
                            <span>LinkedIn</span>
                        </a>
                    )}
                    {data.personal_info?.github && (
                        <a href={data.personal_info.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Github className="size-4" />
                            <span>GitHub</span>
                        </a>
                    )}
                    {data.personal_info?.leetcode && (
                        <a href={data.personal_info.leetcode} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Code className="size-4" />
                            <span>LeetCode</span>
                        </a>
                    )}
                    {data.personal_info?.website && (
                        <a href={data.personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Globe className="size-4" />
                            <span>Portfolio</span>
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
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
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <ul className="space-y-3 ">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-6">
                                <div>
                                    <li className="font-semibold text-gray-800 ">{proj.name}</li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">CGPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        CORE SKILLS
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
                <div className="space-y-6 mb-6">
                    {data.custom_sections.map((section, index) => (
                        <section key={index}>
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold" style={{ color: accentColor }}>
                                    {section.title?.toUpperCase() || "ADDITIONAL INFO"}
                                </h2>
                                {(section.start_date || section.end_date) && (
                                    <div className="text-right text-sm text-gray-600 font-medium mt-1">
                                        <span>{formatDate(section.start_date)}</span>
                                        {formatDate(section.start_date) && formatDate(section.end_date) ? ' - ' : ''}
                                        <span>{formatDate(section.end_date)}</span>
                                    </div>
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

export default ClassicTemplate;