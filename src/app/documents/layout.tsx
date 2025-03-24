import React from "react";
import { DocumentSidebar } from "@/components/document/document-sidebar";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DocumentSidebar />
      {children}
    </div>
  );
}
