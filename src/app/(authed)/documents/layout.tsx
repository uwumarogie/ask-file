import React from "react";
import { DocumentSidebar } from "@/components/document/document-sidebar";
export const dynamic = "force-dynamic";

export default async function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <DocumentSidebar />
      {children}
    </React.Fragment>
  );
}
