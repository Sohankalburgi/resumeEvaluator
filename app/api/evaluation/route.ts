import { NextResponse } from 'next/server';
import { generateSummary, evaluateCandidate, generateCompanyMatches, evaluateFeedBack } from '@/lib/gemini';
import { addScoreMetaData } from '@/lib/pinecone';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
	const { email } = await req.json();

	const submittedForm = await prisma.user.findUnique({
		where: {
			email
		},
	});

	if (!submittedForm) {
		return NextResponse.json({ success: false, message: "Something error happened" }, { status: 400 });
	}

	// Generate AI summary
	const summary = await generateSummary(submittedForm.resumeText);

	// Evaluate Companies that the Resume matches
	const companyMatches = await generateCompanyMatches(submittedForm.resumeText);

	// Evaluate against job description
	const score = await evaluateCandidate(submittedForm.jobDescription, submittedForm.resumeText);
	
	const feedback = await evaluateFeedBack(submittedForm.jobDescription, submittedForm.resumeText);
	
	const evaluation = {score: (score), feedback };
	
	await addScoreMetaData(email, evaluation.score);

	return NextResponse.json({ summary, evaluation, companyMatches, ...submittedForm });
}