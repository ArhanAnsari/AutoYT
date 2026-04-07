"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Clapperboard } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="bg-primary text-white p-2 rounded-lg">
            <Clapperboard className="w-6 h-6" />
          </span>
          <span className="font-bold text-2xl tracking-tighter">AutoYT</span>
        </Link>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to automate your YouTube channel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full h-12 flex items-center justify-center gap-3 bg-white"
              onClick={() => signIn("google", { callbackUrl: "/dashboard", prompt: "consent" })}
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>
            <div className="text-xs text-center px-4 py-2 bg-blue-50/50 text-blue-800 rounded-md border border-blue-100">
              <span className="font-semibold block mb-1">YouTube Required:</span> 
              AutoYT needs access to your YouTube channel to upload your AI-generated videos on your behalf.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign up effortlessly.
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}