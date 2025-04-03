"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");

  async function handleGenerate() {
    if (!session) {
      alert("Please sign in to generate content.");
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-8">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">AI YouTube Generator</h1>
        {session ? (
          <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 text-white rounded">Sign Out</button>
        ) : (
          <button onClick={() => signIn("google")} className="bg-blue-500 px-4 py-2 text-white rounded">Sign In with Google</button>
        )}
      </header>

      {session && (
        <>
          <div className="mt-8">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter video topic"
              className="border p-2 w-full"
            />
            <button onClick={handleGenerate} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">Generate</button>
          </div>

          <pre className="mt-6 p-4 bg-gray-100">{output}</pre>
        </>
      )}
    </div>
  );
}
