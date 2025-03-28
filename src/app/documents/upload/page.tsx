import { DocumentUpload } from "@/components/document/upload";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function Page() {
  const user = await currentUser();

  if (user === null || user === undefined) {
    redirect("/login");
  }

  return <DocumentUpload />;
}
