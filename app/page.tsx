"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SunIcon, MoonIcon, Video, Mic, Image, Upload, Home } from "lucide-react";
import { Button } from "../components/Button";
import { NavItem } from "../components/NavItem";
import { Card } from "../components/Card";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) {
      setDarkMode(storedMode === "true");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="h-screen w-64 bg-white dark:bg-rose-700 text-black dark:text-white p-5 shadow-lg">
        <h1
          className="text-2xl font-bold text-rose-600 dark:text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
        AutoYT
      </h1>
          <nav className="mt-8 space-y-4">
            <NavItem icon={<Home size={20} />} label="Dashboard" />
            <NavItem icon={<Video size={20} />} label="AI Video" />
            <NavItem icon={<Mic size={20} />} label="AI Voice" />
            <NavItem icon={<Image size={20} />} label="Thumbnails" />
            <NavItem icon={<Upload size={20} />} label="Upload" />
          </nav>
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
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            Sign In
          </button>
        )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 shadow-md">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <Button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </Button>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Generate Script" description="Create AI-powered video scripts." />
            <Card title="Generate Video" description="Convert script into AI-generated video." />
            <Card title="Generate Voiceover" description="Use AI to narrate your video." />
            <Card title="Generate Thumbnail" description="Create eye-catching thumbnails." />
            <Card title="Upload & Schedule" description="Automatically upload videos to YouTube." />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}