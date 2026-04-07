import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard, PlayCircle, Sparkles, Zap, ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return ( 
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="px-6 lg:px-14 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <span className="bg-primary text-white p-1.5 rounded-lg">
            <Clapperboard className="h-5 w-5" />
          </span>
          <span className="font-bold text-xl tracking-tight">AutoYT</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#pricing">
            Pricing
          </Link>
          {session ? (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 lg:py-32 xl:py-48 px-4 flex justify-center text-center bg-gray-50/50">
          <div className="max-w-[800px] space-y-8">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-600 mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              The Next-Generation AI Content Platform
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500">
              Automate Your YouTube Empire.
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl lg:text-lg xl:text-xl mx-auto leading-relaxed">
              Generate scripts, voiceovers, visuals, and automatically publish to YouTube — all while you sleep. Set up rules and let the AI run your channel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg">
                  Start Automating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 px-4 flex justify-center bg-white">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Run your channel on autopilot</h2>
              <p className="text-gray-500 max-w-[600px] mx-auto text-lg">
                We handle the heavy lifting of video production so you can focus on strategy and growth.
              </p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-white border flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Scriptwriting</h3>
                <p className="text-gray-500">Gemini 3.1 Pro generates highly engaging, retentive scripts optimized for the YouTube algorithm.</p>
              </div>
              <div className="flex flex-col bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-white border flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Dynamic Visuals</h3>
                <p className="text-gray-500">Automatically prompt and generate high-fidelity images using Together AI for your scenes.</p>
              </div>
              <div className="flex flex-col bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-white border flex items-center justify-center mb-4">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Auto-Publishing</h3>
                <p className="text-gray-500">Connect your channel once and we will automatically render and upload your final videos via YouTube API.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-6 px-6 md:px-14 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-500">© 2026 AutoYT Inc. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
          <Link className="text-sm text-gray-500 hover:text-gray-900" href="#">Terms of Service</Link>
          <Link className="text-sm text-gray-500 hover:text-gray-900" href="#">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
