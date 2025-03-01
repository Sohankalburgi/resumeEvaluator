export function extractSkills(text: string): string[] {
	// Simple regex-based skill extraction
	const skillsSection = text.match(/Skills:(.*?)(?=\n\w+:|$)/is)?.[1] || '';
	return [...new Set([
		...skillsSection.split(/,\s*|\n/),
		...text.match(/(JavaScript|Python|Java|React|Node\.js)/gi) || []
	])].filter(Boolean);
}

export function extractExperience(resumeText: string) {
	const experience = [];

	// Generalized regex to capture experience sections
	const experienceRegex = /(.*?)\s•\s(Internship|Job)(.*?)\n(.*?),\s(.*?)\n([\s\S]+?)(?=\n[A-Z\s]+•|$)/g;

	let match;
	while ((match = experienceRegex.exec(resumeText)) !== null) {
		experience.push({
			role: match[1].trim(),         // Job Title (e.g., Full Stack Developer)
			type: match[2].trim(),         // Internship or Job
			duration: match[3].trim(),     // Duration (e.g., Dec 2024 - Feb 2025)
			company: match[4].trim(),      // Company Name (e.g., Infosys)
			location: match[5].trim(),     // Location (e.g., Virtual, Bangalore)
			description: match[6].trim().replace(/\n/g, ' ') // Job Description (cleaned up)
		});
	}
	return experience;
}


