"use client";

import { SignIn } from "@/components/auth/sign-in";
import { SignUp } from "@/components/auth/sign-up";
import { Tabs } from "@/components/ui/tabs";
import { useSession } from "@/auth/client";
import { redirect } from "next/navigation";

export default function Page() {
  const session = useSession();

  if (session.data !== null) {
    console.log("session.data?.user !== null");
    redirect("/documents");
  }

  return (
    <div className="w-full">
      <div className="flex items-center flex-col justify-center w-full md:py-40">
        <div className="md:w-[400px] min-h-screen">
          <Tabs
            tabs={[
              {
                title: "Sign In",
                value: "sign-in",
                content: <SignIn />,
              },
              {
                title: "Sign Up",
                value: "sign-up",
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

