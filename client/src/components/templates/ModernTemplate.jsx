import { Mail, Phone, MapPin, Linkedin, Globe, Github, Code } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short"
		});
	};

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800 text-[13px] leading-snug">
			{/* Header */}
			<header className="p-6 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Mail className="size-4" />
							<span>Email-id</span>
						</a>
					)}
					{data.personal_info?.phone && (
						<a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</a>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" rel="noopener noreferrer" href={data.personal_info?.linkedin} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Linkedin className="size-4" />
							<span className="text-xs">LinkedIn</span>
						</a>
					)}
					{data.personal_info?.github && (
						<a target="_blank" rel="noopener noreferrer" href={data.personal_info?.github} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Github className="size-4" />
							<span className="text-xs">GitHub</span>
						</a>
					)}
					{data.personal_info?.leetcode && (
						<a target="_blank" rel="noopener noreferrer" href={data.personal_info?.leetcode} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Code className="size-4" />
							<span className="text-xs">LeetCode</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" rel="noopener noreferrer" href={data.personal_info?.website} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Globe className="size-4" />
							<span className="text-xs">Portfolio</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Professional Summary
						</h2>
						<p className="text-gray-700 ">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
							Experience
						</h2>

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200">

									<div className="flex justify-between items-start mb-2">
										<div>
											<h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
											<p className="font-medium" style={{ color: accentColor }}>{exp.company}</p>
										</div>
										<div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
											{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
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
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Projects
						</h2>

						<div className="space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>


									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
								Education
							</h2>

							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="font-semibold text-gray-900">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex justify-between items-center text-sm text-gray-600">
											<span>{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span>CGPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.skills && data.skills.length > 0 && (
						<section>
							<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
								Skills
							</h2>

							<div className="flex flex-col gap-3">
								{data.skills.map((skill, index) => (
									<div key={index}>
                                        <h3 className="font-medium text-gray-900 mb-1">{skill.title || "Skill"}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(skill.items || [skill]).map((item, id) => (
                                                <span
                                                    key={id}
                                                    className="px-3 py-1 text-sm text-white rounded-full"
                                                    style={{ backgroundColor: accentColor }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
								))}
							</div>
						</section>
					)}
				</div>

				{/* Custom Sections */}
				{data.custom_sections && data.custom_sections.length > 0 && (
					<div className="space-y-8 mt-8">
						{data.custom_sections.map((section, index) => (
							<section key={index}>
                                <div className="flex justify-between items-end border-b border-gray-200 mb-4 pb-2">
                                    <h2 className="text-2xl font-light">
                                        {section.title || "Additional Info"}
                                    </h2>
                                    {(section.start_date || section.end_date) && (
                                        <span className="text-sm font-medium text-gray-500 mb-1">
                                            {formatDate(section.start_date)}
                                            {formatDate(section.start_date) && formatDate(section.end_date) ? " - " : ""}
                                            {formatDate(section.end_date)}
                                        </span>
                                    )}
                                </div>
								<div className="text-gray-700 leading-relaxed whitespace-pre-line mt-3">
									{section.description}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default ModernTemplate;