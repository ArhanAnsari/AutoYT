"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Handle AI Generation
  const generateContent = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setGeneratedData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) throw new Error("Failed to generate content");

      const data = await res.json();
      setGeneratedData(data);
    } catch (error) {
      setGeneratedData({ error: "❌ Error generating content. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-600 dark:bg-gray-900 text-white dark:text-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1
          className="text-2xl font-bold text-rose-600 dark:text-rose-400 cursor-pointer"
          onClick={() => router.push("/")}
        >
          AutoYT 🚀
        </h1>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg shadow-md"
          >
            {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Authentication Buttons */}
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-2xl shadow-xl p-6 md:p-12 w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-4 text-rose-600 dark:text-rose-400">
            AI Content Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Generate amazing AI-powered content instantly!
          </p>

          {/* Input & Button */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic..."
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-600 dark:focus:ring-rose-400"
            />
            <button
              onClick={generateContent}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold shadow-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {loading ? "Generating..." : "Generate Content 🚀"}
            </button>
          </div>

          {/* Display Generated Content */}
          {generatedData && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg">
              <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                Generated Output:
              </h2>
              {generatedData.error ? (
                <p className="mt-2 text-red-500">{generatedData.error}</p>
              ) : (
                <div className="mt-2 space-y-4">
                  <p>📜 **Script:** {generatedData.script}</p>
                  <p>🔊 **Voice Preview:**</p>
                  <audio controls src={generatedData.voice} className="w-full" />
                  <p>🎥 **Generated Video:**</p>
                  <video controls className="w-full rounded-lg">
                    <source src={generatedData.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p>🖼 **Thumbnail:**</p>
                  <img
                    src={generatedData.thumbnail}
                    alt="Generated Thumbnail"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/")}
              className="text-rose-600 dark:text-rose-400 hover:underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
