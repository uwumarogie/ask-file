"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignInPage() {
  // const session = useSession();
  // if (session !== null) {
  //   redirect("/documents");
  // }
  //
  return (
    <div className="flex items-center justify-center h-fit min-h-screen">
      <div className="shadow-xl p-12 rounded-2xl flex flex-col gap-4">
        <form
          action={() => {
            signIn("github", { redirectTo: "/documents" });
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center gap-3 border border-black bg-black cursor-pointer text-white p-2 px-3 rounded hover:scale-105 transition"
          >
            Sign in with Github
          </button>
        </form>
        <form
          action={() => {
            signOut();
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center gap-3 border border-black bg-black cursor-pointer text-white p-2 px-3 rounded hover:scale-105 transition"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
