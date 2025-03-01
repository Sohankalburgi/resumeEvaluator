"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Match {
  id: string;
  score: number;
  values: number[];
  metadata: {
    email: string;
    linkedin: string;
    name: string;
    skills: string;
    score : number;
  };
}

interface MatchesResponse {
  matches: Match[];
  namespace: string;
  usage: {
    readUnits: number;
  };
}

function ScoreIndicator({
  value,
  maxValue,
  className,
}: {
  value: number;
  maxValue: number;
  className?: string;
}) {
  const percentage = Math.round((value / maxValue) * 100);
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full border-4 border-primary ${className}`}
      >
        <span className="text-lg font-semibold">{percentage}%</span>
      </div>
    </div>
  );
}

const Page = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSearch = async () => {
    if (search === "") {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    const res = await fetch(`/api/topList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobDescription: search }),
    });

    const data: MatchesResponse = await res.json();
    setResults(data.matches);
    console.log(data);
    setLoading(false);
  };

  return (
    <div className="flex w-full justify-center mt-10">
      <Card className="w-full max-w-xl p-6">
        <CardHeader className="text-center">
          <h1 className="font-bold text-3xl">Top List</h1>
          <p className="text-sm text-slate-400">
            Score Based on Job Description Text Semantic Search
          </p>
        </CardHeader>

        <div className="space-y-4">
          <Label>Enter Job Description</Label>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">Job Description is required</p>}

          <Button onClick={handleSearch} className="w-full">
            Search
          </Button>

          {loading ? (
            <p className="text-center mt-5">Loading...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((result, index) => (
                <Card key={index} className="flex flex-col md:flex-row items-center p-4 gap-4">
                  <CardContent className="text-lg font-semibold capitalize w-full">
                    {result.metadata.name}
                  </CardContent>
                  <CardContent className="flex gap-4 items-center">
                    <a
                      href={result.metadata.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.95v5.71h-3.56V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.4-1.86 3.63 0 4.3 2.39 4.3 5.5v6.25z" />
                      </svg>
                    </a>

                    <a href={`mailto:${result.metadata.email}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M12 12.713l11.985-7.99A1.993 1.993 0 0 0 22 4H2c-.73 0-1.374.393-1.735.723L12 12.713zM12 13.287L.015 5.297A1.993 1.993 0 0 0 0 6v12c0 1.103.897 2 2 2h20c1.103 0 2-.897 2-2V6c0-.703-.37-1.32-.985-1.703L12 13.287z" />
                      </svg>
                    </a>

                    <ScoreIndicator
                      value={Math.round(parseInt(result.metadata?.score.toString()))}
                      maxValue={100}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Page;
