"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to /auth/signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-600 text-white p-8">
      <div className="bg-white text-black rounded-2xl shadow-xl p-6 md:p-12 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-rose-600">
          AI Content Generator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Generate amazing content with AI-powered tools!
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter a topic..."
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-600"
          />
          <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg shadow-lg transition">
            Generate Content 🚀
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="text-rose-600 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
