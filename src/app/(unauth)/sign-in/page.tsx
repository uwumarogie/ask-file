import SignInForm from "./form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  if (session?.user) {
    redirect("/documents");
  }
  return <SignInForm />;
}
