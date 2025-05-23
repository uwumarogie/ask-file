"use client";
import React, { useState } from "react";
import { FileUploadZone } from "@/components/file-upload-zone";
import { FileText, MessageSquare, Search } from "lucide-react";
import { Footer } from "@/components/landing-page/footer";
import { LandingPageNavbar } from "./navbar";

const features = [
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: "Document Management",
    description:
      "Upload, organize, and access your technical documents in one secure location.",
  },
  {
    icon: <Search className="w-10 h-10 text-primary" />,
    title: "Intelligent Search",
    description:
      "Find exactly what you need with our advanced semantic search capabilities.",
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-primary" />,
    title: "AI-Powered Chat",
    description:
      "Ask questions and get answers directly from your technical documentation.",
  },
];

export function Index() {
  const [isUploading, _] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingPageNavbar />
      <main className="flex-1">
        <section className="py-20 container max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-accent text-accent-foreground mb-4">
            Document Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
            Your technical documents, <br />
            <span className="text-primary">intelligently enhanced</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload your technical documents and instantly search, query, and
            extract insights with our advanced AI technology.
          </p>

          <div className="max-w-2xl mx-auto glass rounded-2xl p-8 shadow-elevated">
            <FileUploadZone />
          </div>

          {isUploading && (
            <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin mr-2"></div>
              Processing your documents...
            </div>
          )}
        </section>
        <section id="features" className="py-20 bg-secondary/50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-medium text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-subtle flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
