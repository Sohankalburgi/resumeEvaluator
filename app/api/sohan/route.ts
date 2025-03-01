import { generateEmbedding } from "@/lib/embedding";
import { extractExperience, extractSkills } from "@/lib/extractor";
import { storeEmbedding } from "@/lib/pinecone";
import prisma from "@/lib/prisma";

import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";

export async function POST(request: Request) {
	const formData = await request.formData();

	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const linkedIn = formData.get('linkedin') as string;
	const resume = formData.get('resume') as File;
	const skills = formData.get('skills') as string;
	const jobDescription = formData.get('jobDescription') as string;
	console.log(name, email, linkedIn, resume, skills);
	const formSchema = z.object({
		name: z.string().nonempty("Name is required"),
		email: z.string().email("Invalid email format"),
		linkedin: z.string().url("Invalid LinkedIn URL"),
		resume: z.custom<File>((value) => value instanceof File, { message: "Resume must be a file" }),
		skills: z.string().nonempty("Skills are required"),
		jobDescription: z.string().nonempty("Job description is required"),
	});

	const formDataObject = {
		name,
		email,
		linkedin: linkedIn,
		resume,
		skills,
		jobDescription,
	};

	const validation = formSchema.safeParse(formDataObject);

	if (!validation.success) {
		return NextResponse.json({ success: false,error: validation.error.errors.join(', ') }, { status: 400 });
	}

	if (!resume) {
		return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
	}

	console.log("Resume Type:", typeof resume); // Debugging output

	if (!(resume instanceof Blob)) {
		return NextResponse.json({success:false, error: "Invalid file format" }, { status: 400 });
	}
	const resumeArrayBuffer = await resume.arrayBuffer();
	const buffer = Buffer.from(resumeArrayBuffer);

	const parseBuffer = await pdfParse(buffer);
	const resumeText = parseBuffer.text;
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

// Optional: Handle GET method to prevent 405 errors
export function GET() {
	return NextResponse.json({success:false, message: "GET methodddddd not allowed" }, { status: 405 });
}
