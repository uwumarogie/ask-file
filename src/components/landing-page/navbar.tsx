"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { useSession } from "@/auth/client";

const navItems = [
  {
    slug: "/#features",
    text: "Features",
  },
  {
    slug: "/docs",
    text: "Documentation",
  },
  {
    slug: "/support",
    text: "Support",
  },
];

export function LandingPageNavbar() {
  const router = useRouter();
  const session = useSession();

  return (
    <header className="w-full py-6 border-b border-border">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-semibold text-xl">AskFile</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(({ slug, text }) => (
            <Link
              key={text}
              href={slug}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {text}
            </Link>
          ))}
        </nav>{" "}
        {session.data ? (
          <Button variant="outline" onClick={() => router.push("/documents")}>
            Dashboard
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button variant="outline" onClick={() => router.push("/sign-in")}>
            Sign Up
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
