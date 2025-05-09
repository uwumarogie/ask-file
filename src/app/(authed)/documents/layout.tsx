import React from "react";
import { DocumentNavbar } from "@/components/document/sidebar";
export const dynamic = "force-dynamic";

export default async function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <DocumentNavbar />
      {children}
    </React.Fragment>
  );
}
