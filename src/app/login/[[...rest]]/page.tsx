"use client";
import { SignIn } from "@clerk/nextjs";
import { FileText } from "lucide-react";
export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-semibold text-xl">DocuMind</span>
        </div>
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">
          Sign in to access your documents
        </p>
      </div>

      <div className="flex justify-center items-center">
        <SignIn redirectUrl="/documents" />
      </div>

      <p className="text-muted-foreground text-sm mt-8">
        Don't have an account?{" "}
        <a href="/sign-up" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
