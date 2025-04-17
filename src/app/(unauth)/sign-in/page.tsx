import SignInForm from "./form";
import { auth } from "@/auth";
export default async function SignIn() {
  const session = await auth();
  console.debug(session);
  return <SignInForm />;
}
