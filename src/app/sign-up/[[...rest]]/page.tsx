import { FileText } from "lucide-react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-semibold text-xl">DocuMind</span>
        </div>
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">Sign up to try DocuMind</p>
      </div>
      <div className="flex justify-center items-center">
        <SignUp />
      </div>
      <p className="text-muted-foreground text-sm mt-8">
        Do you already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
