"use client";
import React, { useState } from "react";
import { FileUploadZone } from "@/components/file-upload-zone";
import {
  FileText, MessageSquare, Search, Activity, FileStack, Headphones, Sparkles,
  Upload, Brain, Lightbulb, Star, ChevronDown, Mail, Phone, MessageCircle,
  CheckCircle, Shield, Zap, Users
} from "lucide-react";
import { Footer } from "@/components/landing-page/footer";
import { LandingPageNavbar } from "./navbar";

/**
 * HeroSection Component
 * Displays the main hero section with a title, description, and file upload zone.
 * Features a pulsing badge and gradient text effects.
 * 
 * @param {boolean} isUploading - Indicates if a file is currently being uploaded
 */
function HeroSection({ isUploading }: { isUploading: boolean }) {
  return (
    <section className="py-20 container max-w-5xl mx-auto text-center relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>

      <div className="relative">
        {/* Pulsing badge */}
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Document Intelligence
        </span>

        {/* Main heading with gradient effect */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
          Your technical documents,{" "}
          <span className="relative">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              intelligently enhanced
            </span>
            <span className="absolute inset-0 bg-primary/10 blur-xl -z-10"></span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Upload your technical documents and instantly search, query, and
          extract insights with our advanced AI technology.
        </p>

        {/* File upload zone with glass effect */}
        <div className="max-w-2xl mx-auto glass rounded-2xl p-8 shadow-elevated backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300">
          <FileUploadZone />
        </div>

        {/* Loading indicator */}
        {isUploading && (
          <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
            <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin mr-2"></div>
            Processing your documents...
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * StatsSection Component
 * Displays key platform statistics in a grid layout.
 * Each stat card features an icon, value, and label with hover effects.
 */
function StatsSection() {
  const stats = [
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      value: "99.9%",
      label: "Uptime"
    },
    {
      icon: <FileStack className="w-8 h-8 text-primary" />,
      value: "50K+",
      label: "Documents Processed"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      value: "24/7",
      label: "Support"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      value: "1M+",
      label: "Queries Answered"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Platform Stats
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who trust our platform
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              {/* Stat card */}
              <div className="relative bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/5 shadow-elevated">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                <div className="flex flex-col items-center">
                  {/* Icon container */}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>

                  {/* Value with gradient effect */}
                  <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-2">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-muted-foreground font-medium">{stat.label}</div>

                  {/* Animated progress bar */}
                  <div className="mt-4 h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-primary rounded-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Features array containing the main platform features
 * Each feature has an icon, title, and description
 */
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

/**
 * FeaturesSection Component
 * Displays the main platform features in a grid layout.
 * Each feature card includes an icon, title, and description with hover effects.
 */
function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Features
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the future of document management with our advanced AI technology
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5"
            >
              {/* Card top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

              {/* Icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
              </div>

              {/* Feature title with gradient */}
              <h3 className="text-xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

              {/* Animated progress bar */}
              <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-full bg-primary rounded-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * HowItWorksSection Component
 * Displays the three-step process of using the platform.
 * Each step includes an icon, title, and description.
 */
function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="w-10 h-10 text-primary" />,
      title: "Upload Documents",
      description: "Simply drag and drop your technical documents or use our file picker."
    },
    {
      icon: <Brain className="w-10 h-10 text-primary" />,
      title: "AI Processing",
      description: "Our advanced AI analyzes and indexes your documents for quick access."
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-primary" />,
      title: "Get Insights",
      description: "Ask questions and get instant answers from your document collection."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Simple Process
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5">
              {/* Card top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

              {/* Icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6">
                  {step.icon}
                </div>
              </div>

              {/* Step title with gradient */}
              <h3 className="text-xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {step.title}
              </h3>

              {/* Step description */}
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * TestimonialsSection Component
 * Displays customer testimonials in a grid layout.
 * Each testimonial includes a quote, author, role, and company.
 */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This platform has revolutionized how we handle our technical documentation. The AI-powered search is incredibly accurate.",
      author: "Sarah Chen",
      role: "CTO, TechCorp",
      company: "TechCorp"
    },
    {
      quote: "The document management system is intuitive and powerful. It's become an essential tool for our team.",
      author: "Michael Rodriguez",
      role: "Lead Developer",
      company: "DevFlow"
    },
    {
      quote: "The AI chat feature has saved us countless hours of searching through documentation. Highly recommended!",
      author: "Emily Thompson",
      role: "Product Manager",
      company: "InnovateX"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Testimonials
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5">
              {/* Card top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {/* Star rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                    ))}
                  </div>

                  {/* Testimonial quote */}
                  <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                </div>

                {/* Author info */}
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * PricingSection Component
 * Displays pricing plans in a grid layout.
 * Each plan includes features, pricing, and a call-to-action button.
 */
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small teams",
      features: [
        "Up to 100 documents",
        "Basic AI search",
        "Standard support",
        "1GB storage"
      ]
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited documents",
        "Advanced AI search",
        "Priority support",
        "10GB storage",
        "Custom integrations"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "Custom AI training",
        "Unlimited storage",
        "SLA guarantee",
        "On-premise option"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Pricing
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
        </div>

        {/* Pricing plans grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border ${plan.popular ? 'border-primary/50 ring-primary ring-4 scale-105' : 'border-primary/5'}`}>
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              {/* Card top border */}
              {index !== 1 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-primary flex-shrink-0"></div>
                    <span className="text-muted-foreground leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <button className={`w-full py-3 rounded-lg font-medium ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'} hover:opacity-90 transition-opacity`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * FAQSection Component
 * Displays frequently asked questions in an accordion layout.
 * Each FAQ item includes a question and answer.
 */
function FAQSection() {
  const faqs = [
    {
      question: "What types of documents are supported?",
      answer: "We support a wide range of document formats including PDF, DOCX, TXT, and more. Our AI can process and understand technical documentation, research papers, and general text content."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and regular security audits to ensure your data is protected."
    },
    {
      question: "Can I integrate this with my existing systems?",
      answer: "Yes! We offer various integration options including API access, webhooks, and pre-built integrations with popular tools and platforms."
    },
    {
      question: "How accurate is the AI search?",
      answer: "Our AI search is highly accurate, using advanced natural language processing to understand context and meaning. It continuously learns and improves from user interactions."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-4xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            FAQ
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card/80 backdrop-blur-sm rounded-xl shadow-elevated border border-primary/5 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ContactSection Component
 * Displays contact information and a contact form in a two-column layout.
 * Left column contains contact methods (email, phone, chat) with interactive cards.
 * Right column contains a contact form with input fields and submit button.
 */
function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30"></div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Contact
          </span>
          <h2 className="text-3xl font-medium text-center mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Methods Column */}
          <div className="flex flex-col justify-between">
            {/* Email Card */}
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5 hover:border-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">We'll respond as soon as possible</p>
                </div>
              </div>
              <a
                href="mailto:support@askfile.com"
                className="block w-full py-3 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-center font-medium"
              >
                support@askfile.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5 hover:border-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Call Us</h3>
                  <p className="text-sm text-muted-foreground">Mon-Fri from 8am to 6pm</p>
                </div>
              </div>
              <a
                href="tel:+15551234567"
                className="block w-full py-3 px-4 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-center font-medium"
              >
                +1 (555) 123-4567
              </a>
            </div>

            {/* Live Chat Card */}
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5 hover:border-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Available 24/7 for instant support</p>
                </div>
              </div>
              <button className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                Start Chat
              </button>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-elevated border border-primary/5">
            <h3 className="text-2xl font-medium mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Send us a Message
            </h3>
            <form className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Main Index Component
 * Renders the complete landing page with all sections in a logical order.
 * Includes navigation, main content sections, and footer.
 */
export function Index() {
  const [isUploading, _] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingPageNavbar />
      <main className="flex-1">
        <HeroSection isUploading={isUploading} />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}