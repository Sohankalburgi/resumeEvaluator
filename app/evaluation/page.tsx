'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Evaluation = {
	score: number;
	feedback: string;
};
type Experience = {
	role: string;
	type: string;
	company: string;
	duration: string;
	location: string;
	description: string;
};

interface Result {
	id: string;
	email: string;
	name: string;
	linkedIn: string;
	skills: string;
	resumeText: string;
	experience: Experience[];
	jobDescription: string;
	summary: string;
	evaluation: Evaluation;
	companyMatches: string;
}

 function ScoreIndicator({ value, maxValue,className }: { value: number; maxValue: number;className?:string }) {
	const percentage = Math.round((value / maxValue) * 100);
	return (
		<div className="flex flex-col items-center">
			<div className={`w-32 h-32  flex items-center justify-center rounded-full border-4 border-primary ${className}`}>
				<span className="text-lg font-semibold">{percentage}%</span>
			</div>
		</div>
	);
}

export default function Dashboard() {
	const [result, setResult] = useState<Result | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		async function fetchResult() {
			setLoading(true);
			const email = await getCookie('email');
			if (!email) {
				router.push('/form');
			}
			const response = await fetch('/api/evaluation', {
				method: 'POST',
				body: JSON.stringify({ email }),
				headers: { 'Content-Type': 'application/json' },
			});
			const responseData = await response.json();
			setResult(responseData);
			setLoading(false);
		}
		fetchResult();
	}, []);

	return (
		<>
		{loading? <div className="flex justify-center items-center h-screen">Loading...</div>:
		<div className='flex  flex-col gap-6 w-full max-w-7xl justify-center items-center mx-24 mt-10'>
			<Card className="w-full  text-center flex ">
				<CardHeader>
					<h1 className="text-2xl font-bold capitalize">Hi, {result?.name}</h1>
					<p className="text-slate-300">Welcome to Resume Evaluator</p>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full ">
				<Card className='flex'>
					<CardHeader>
						<h2 className="text-xl font-bold">Score</h2>
					</CardHeader>
					<CardContent>
						<ScoreIndicator value={result?.evaluation.score || 0} maxValue={100} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">Skills</h2>
					</CardHeader>
					<CardContent>
						<div className='flex gap-2 flex-wrap'>{result?.skills.split(',').map((val, index) => {
							return (<Badge key={index}>{val}</Badge>)
						})}</div>
					</CardContent>
				</Card>
			</div>

			{/* <Card className="w-full ">
				<CardHeader>
					<h2 className="text-xl font-bold">Experience</h2>
				</CardHeader>
				<CardContent>
					{result?.experience.map((ex, index) => (
						<div key={index} className="mb-4 border-b pb-2">
							<h3 className="font-semibold text-lg">{ex.role}</h3>
							<p className="text-sm text-slate-300">{ex.company} | {ex.duration}</p>
							<p className="text-sm text-slate-300">{ex.location}</p>
							<p className="mt-2 text-justify text-wrap w-full text-white">{ex.description}</p>
						</div>
					))}
				</CardContent>
			</Card> */}

			<div className="flex  w-full ">
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">Summary</h2>
					</CardHeader>
					<CardContent>
						<p className='mt-2 text-justify text-wrap w-full'>{result?.summary}</p>
					</CardContent>
				</Card>
			</div>
			<div className=''>
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">Feedback</h2>
					</CardHeader>
					<CardContent>
						<p className='mt-2 text-justify text-wrap w-full'>{result?.evaluation.feedback}</p>
					</CardContent>
				</Card>
			</div>
			<Card className="w-full ">
				<CardHeader>
					<h2 className="text-xl font-bold">Contact</h2>
				</CardHeader>
				<CardContent>
					<p>Name: {result?.name}</p>
					<p>Email: {result?.email}</p>
					<p>LinkedIn: <a href={result?.linkedIn} className="text-primary underline" target="_blank">{result?.linkedIn}</a></p>
				</CardContent>
			</Card>
		</div>}
		</>
	);
}