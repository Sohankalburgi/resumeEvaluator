import { generateEmbedding } from "@/lib/embedding";
import { storeEmbedding } from "@/lib/pinecone";
import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
	const formData = await request.formData();

	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const linkedIn = formData.get('linkedin') as string;
	const resume = formData.get('resume') as File;
	const skills = formData.get('skills') as string;
	const jobDescription = formData.get('jobDescription') as string;
	console.log(name, email, linkedIn, resume, skills);
	if (!resume) {
		return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
	}

	console.log("Resume Type:", typeof resume); // Debugging output

	if (!(resume instanceof Blob)) {
		return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
	}
	const resumeArrayBuffer = await resume.arrayBuffer();
	const buffer = Buffer.from(resumeArrayBuffer);

	const resumeText = (await pdfParse(buffer, { max: 2 })).text;

	const extractExperienceText = extractExperience(resumeText);
	const extractSkillsText = extractSkills(resumeText);


	const vector = await generateEmbedding(resumeText);
	await storeEmbedding(vector, name,email, linkedIn, extractSkillsText.join(', '));

	
	await prisma.user.create({
		data:{
			email,
			skills: extractSkillsText.join(', '),
			experience: extractExperienceText,
			jobDescription,
			linkedIn,
			resumeText,
			name,
		}
	});
	

	return NextResponse.json({
		success: true,
		skills: extractSkills,
		experience: extractExperience,
		linkedIn,
		name,
		email,
		jobDescription
	});
}


function extractSkills(text: string): string[] {
	// Simple regex-based skill extraction
	const skillsSection = text.match(/Skills:(.*?)(?=\n\w+:|$)/is)?.[1] || '';
	return [...new Set([
		...skillsSection.split(/,\s*|\n/),
		...text.match(/(JavaScript|Python|Java|React|Node\.js)/gi) || []
	])].filter(Boolean);
}

function extractExperience(resumeText: string) {
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


