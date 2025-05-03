import React from "react";
import { DocumentSidebar } from "@/components/document/document-sidebar";
import { SessionProvider } from "next-auth/react";
export default async function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DocumentSidebar />
      {children}
    </SessionProvider>
  );
}
