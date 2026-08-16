import React from "react";
import { Mail, Phone, Linkedin, Globe, Github, Code } from "lucide-react";

const ATSProfessionalTemplate = ({ data }) => {

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${new Date(year, month - 1).toLocaleString("en-US", { month: "short" })} ${year}`;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white text-black px-8 py-6 font-serif text-[13px] leading-tight flex flex-col">

      {/* HEADER */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <div className="mt-2 flex flex-nowrap justify-center items-center whitespace-nowrap">
          {data.personal_info?.phone && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-1"><Phone size={14} /> {data.personal_info.phone}</a></div>}
          {data.personal_info?.email && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-1"><Mail size={14} /> Email-id</a></div>}
          {data.personal_info?.linkedin && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={data.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><Linkedin size={14} /> LinkedIn</a></div>}
          {data.personal_info?.github && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={data.personal_info.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><Github size={14} /> GitHub</a></div>}
          {data.personal_info?.leetcode && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={data.personal_info.leetcode} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><Code size={14} /> LeetCode</a></div>}
          {data.personal_info?.website && <div className="px-3 border-r border-gray-500 last:border-0 hover:text-blue-600 transition-colors"><a href={data.personal_info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1"><Globe size={14} /> Portfolio</a></div>}
        </div>
      </div>

      {/* SUMMARY */}
      {data.professional_summary && (
        <section className="mb-5">
          <h2 className="font-bold uppercase border-b mb-2">Summary</h2>
          <p>{data.professional_summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase border-b mb-2">
            Skills
          </h2>
          {data.skills.map((skill, index) => (
            <p key={index}>
              <strong>{skill.title || "Skill"}:</strong> {skill.items ? skill.items.join(", ") : skill}
            </p>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {data.project?.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase border-b mb-2">Projects</h2>

          {data.project.map((proj, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between font-semibold">
                <span>{proj.name}</span>
                <span>{formatDate(proj.start_date)} – {proj.end_date || "Present"}</span>
              </div>

              <p className="italic">{proj.tech_stack}</p>

              <ul className="list-disc list-inside mt-1">
                {proj.description.split("\n").map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase border-b mb-2">Experience</h2>

          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between font-semibold">
                <span>{exp.position}</span>
                <span>{formatDate(exp.start_date)} – {exp.end_date || "Present"}</span>
              </div>

              <p className="italic">{exp.company} — {exp.location}</p>

              <ul className="list-disc list-inside mt-1">
                {exp.description.split("\n").map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold uppercase border-b mb-2">Education</h2>

          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{edu.institution}</span>
                <span>{formatDate(edu.start_date)} – {formatDate(edu.graduation_date)}</span>
              </div>
              <div className="flex justify-between items-center italic">
                <p>
                  {edu.degree}, {edu.field}
                </p>
                {edu.gpa && <p>CGPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications?.length > 0 && (
        <section>
          <h2 className="font-bold uppercase border-b mb-2">
            Certifications
          </h2>

          <ul className="list-disc list-inside">
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* CUSTOM SECTIONS */}
      {data.custom_sections?.length > 0 && (
        <div className="space-y-5">
            {data.custom_sections.map((section, index) => (
                <section key={index} className="mt-5">
                    <div className="flex justify-between font-bold uppercase border-b mb-2 text-sm">
                        <h2>{section.title || "Additional Info"}</h2>
                        {(section.start_date || section.end_date) && (
                            <span className="font-semibold text-gray-700">
                                {formatDate(section.start_date)}
                                {formatDate(section.start_date) && formatDate(section.end_date) ? " – " : ""}
                                {formatDate(section.end_date)}
                            </span>
                        )}
                    </div>
                    <div className="whitespace-pre-line mt-1">
                        {section.description}
                    </div>
                </section>
            ))}
        </div>
      )}

    </div>
  );
};

export default ATSProfessionalTemplate;
