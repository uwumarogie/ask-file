import React from "react";
import { DocumentSidebar } from "@/components/document/document-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (user === null || user === undefined) {
    redirect("/login");
  }

  const userDetails = {
    name: user.fullName,
    email: user.emailAddresses[0].emailAddress,
    image: user.imageUrl,
  };

  return (
    <React.Fragment>
      <DocumentSidebar user={userDetails} />
      {children}
    </React.Fragment>
  );
}
