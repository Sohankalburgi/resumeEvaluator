import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-slate-50">AI-Powered Resume Evaluator</h1>
        <p className="text-lg text-slate-300 mt-4">
          Get instant feedback on your resume and optimize it for your dream job using AI insights.
        </p>
        <div className="flex justify-center mt-6">
          <Button className="text-lg">
            <a href="/form" className="w-full h-full mb-2">Get Started</a>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Card className="p-6 text-center bg-transparent shadow-none">
          <CardContent>
            <CheckCircle className="text-green-500 text-4xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Smart Analysis</h3>
            <p className="text-gray-600 mt-2">Our AI evaluates your resume and suggests improvements.</p>
          </CardContent>
        </Card>
        <Card className="p-6 text-center bg-transparent shadow-none">
          <CardContent>
            <CheckCircle className="text-green-500 text-4xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Job Matching</h3>
            <p className="text-gray-600 mt-2">Find out how well your resume matches your target job.</p>
          </CardContent>
        </Card>
        <Card className="p-6 text-center bg-transparent shadow-none">
          <CardContent>
            <CheckCircle className="text-green-500 text-4xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Instant Feedback</h3>
            <p className="text-gray-600 mt-2">Receive actionable suggestions in seconds.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}