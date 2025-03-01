import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSummary(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `Summarize this resume into a candidate profile: ${text}`;
  const result = await model.generateContent(prompt);
  console.log(result.response.text()); 
  return result.response.text();
}

export async function generateCompanyMatches(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `Generate a list of companies that this candidate would be a good fit for the skills: ${text}`;
  const result = await model.generateContent(prompt);
  console.log(result.response.text()); 
  return result.response.text();
}

export async function evaluateCandidate(jobDesc: string, resumeText: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `Evaluate how well this resume matches the job description. 
    Job Description: ${jobDesc}
    Resume: ${resumeText}
    Provide a score out of 100 and format of number only as the result`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function evaluateFeedBack(jobDesc: string, resumeText: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `Provide feedback on how the candidate can improve their resume to better match the job description.
    Job Description: ${jobDesc}
    Resume: ${resumeText}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}